// Bot or Faker — live server
// Detectives chat with a "subject" and guess: real AI or a human faking it.
// Fakers are humans trying to pass as AI.
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const bot = require('./bot');

const PORT = process.env.PORT || 3000;
const SKIP_AFTER = (+process.env.MIN_SECONDS || 90) * 1000; // minimum time before a game can be skipped or voted on (1:30)

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_q, r) => r.send('ok'));
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 6e5 });

const pick = a => a[Math.floor(Math.random() * a.length)];
const sleep = ms => new Promise(r => setTimeout(r, Math.max(0, ms)));
const clean = t => (typeof t === 'string' ? t.replace(/\s+/g, ' ').trim().slice(0, 600) : '');
// ---- state ----
const games = new Map();   // id -> game
const waiting = new Set(); // socket ids of fakers waiting for a detective
let gid = 0;
const sock = id => (id ? io.sockets.sockets.get(id) : null);
const to = (id, ev, data) => { const s = sock(id); if (s) s.emit(ev, data); };
const transcript = (g, me, other, meIs) => g.msgs.map(m => `${m.from === meIs ? me : other}: ${m.text}`).join('\n');

function newGame(mode, truth, det, act) {
  const g = { id: ++gid, mode, truth, det, act, msgs: [], over: false, busy: false, aiCalls: 0, start: Date.now() };
  games.set(g.id, g);
  for (const id of [det, act]) { const s = sock(id); if (s) s.data.game = g.id; }
  return g;
}
function endGame(g) {
  g.over = true; games.delete(g.id);
  for (const id of [g.det, g.act]) { const s = sock(id); if (s && s.data.game === g.id) s.data.game = null; }
}
// ---- missions & points ----
// The faker gets one secret mission per human round; it is checked automatically.
const MISSIONS = [
  { k: 'word', w: 'banana' }, { k: 'word', w: 'pizza' }, { k: 'word', w: 'yalla' }, { k: 'word', w: 'habibi' },
  { k: 'word', w: 'coffee' }, { k: 'word', w: 'robot' }, { k: 'laugh' }, { k: 'math' }, { k: 'askHuman' },
  { k: 'photo', room: true },
];
const pickMission = inRoom => ({ ...pick(MISSIONS.filter(m => inRoom || !m.room)), done: false });
function missionHit(m, text, isPhoto) {
  if (!m || m.done) return false;
  if (m.k === 'word') return new RegExp('(^|[^a-z])' + m.w + '([^a-z]|$)', 'i').test(text);
  if (m.k === 'laugh') return /(ha){2,}|\blol\b|lmao|hhh|😂|🤣|ههه/i.test(text);
  if (m.k === 'math') return /\d\s*[-+*/×x÷]\s*\d/.test(text);
  if (m.k === 'askHuman') return /human|real person|insen|ensen|bashar|انسان|إنسان|بشر|are (you|u) (a |an )?(bot|ai|robot)/i.test(text);
  if (m.k === 'photo') return !!isPhoto;
  return false;
}
function checkMission(g, text, isPhoto) {
  if (g.mode === 'human' && missionHit(g.mission, text, isPhoto)) { g.mission.done = true; to(g.act, 'missionDone'); }
}
const isJpeg = d => typeof d === 'string' && d.length < 500000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(d);

// ---- friend rooms ----
// A room holds two friends. Each round one is the detective and one the faker;
// a coin flip decides if the faker types (human) or the bot answers for them (roombot).
// Roles swap every round.
const rooms = new Map(); // code -> { code, players: [id,id], det, round, ready:Set, score:{id:n} }
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newCode() { let c; do { c = Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join(''); } while (rooms.has(c)); return c; }
function roomRound(r) {
  const [a, b] = r.players; r.round++; r.ready = new Set();
  r.det = r.round === 1 ? b : (r.det === a ? b : a);   // the friend who joined starts as detective
  const act = r.det === a ? b : a;
  const human = Math.random() < 0.5;
  const g = newGame(human ? 'human' : 'roombot', human ? 'human' : 'ai', r.det, act);
  g.room = r.code;
  to(r.det, 'start', { mode: 'detective', room: r.code, round: r.round });
  to(act, 'start', { mode: human ? 'actor' : 'watch', room: r.code, round: r.round });
  if (human) { g.mission = pickMission(true); to(act, 'mission', g.mission); suggest(g, null); }
}
function closeRoom(s) {
  const r = rooms.get(s.data.room); s.data.room = null;
  if (!r) return;
  rooms.delete(r.code);
  for (const id of r.players) if (id !== s.id) { to(id, 'roomClosed'); const o = sock(id); if (o) o.data.room = null; }
}
function leave(s) {
  const g = games.get(s.data.game);
  if (g && !g.over) { const other = g.det === s.id ? g.act : g.det; to(other, 'left'); endGame(g); }
  s.data.game = null;
}
let countT = null;
function counts() {
  clearTimeout(countT);
  countT = setTimeout(() => {
    let det = 0;
    for (const s of io.sockets.sockets.values()) if (s.data.role === 'detective') det++;
    for (const id of waiting) if (!sock(id)) waiting.delete(id);
    io.emit('online', { total: io.engine.clientsCount, det, wait: waiting.size });
  }, 300);
}

// ---- bot turns ----
async function botReply(g) {
  if (g.busy || g.over) return;
  g.busy = true;
  const last = [...g.msgs].reverse().find(m => m.from === 'det');
  const text = bot.answer(last ? last.text : 'hi', g.mode === 'sim' ? 'sim' : 'ai');
  await sleep(500); if (!g.over) to(g.det, 'typing');
  await sleep(Math.min(7000, 900 + text.length * (g.mode === 'sim' ? 55 : 28) + Math.random() * 800));
  g.busy = false;
  if (g.over) return;
  g.msgs.push({ from: 'sub', text }); to(g.det, 'msg', { text });
  if (g.mode === 'roombot' && g.act) to(g.act, 'botmsg', { text });
  if (g.pending) { g.pending = false; botReply(g); }
}
async function detAsk(g) {
  if (g.over) return;
  if (g.msgs.filter(m => m.from === 'sub').length >= 6) return practiceVerdict(g);
  if (g.busy) return; g.busy = true;
  to(g.act, 'typing');
  const q = bot.nextQuestion(g.msgs);
  await sleep(1200 + q.length * 25);
  g.busy = false;
  if (g.over) return;
  g.msgs.push({ from: 'det', text: q }); to(g.act, 'msg', { text: q }); suggest(g, q);
}
async function practiceVerdict(g) {
  if (g.over) return; g.over = true;
  to(g.act, 'typing'); await sleep(1500);
  const r = bot.verdict(g.msgs);
  to(g.act, 'result', { kind: 'act', fooled: r.verdict === 'ai', reason: r.reason });
  endGame(g);
}
function suggest(g, last) {
  if (g.act && !g.over) setTimeout(() => { if (!g.over) to(g.act, 'sugs', bot.suggestions(last)); }, 600);
}

// ---- sockets ----
io.on('connection', s => {
  s.data = { role: null, game: null, last: 0, room: null };
  counts();

  s.on('role', r => {
    leave(s); waiting.delete(s.id);
    s.data.role = r === 'detective' ? 'detective' : r === 'actor' ? 'actor' : null;
    if (s.data.role === 'actor') waiting.add(s.id);
    counts();
  });

  s.on('find', () => {
    if (s.data.role !== 'detective') return;
    leave(s);
    const wantHuman = Math.random() < 0.5;
    const pool = [...waiting].filter(id => sock(id) && id !== s.id);
    if (wantHuman && pool.length) {
      const aid = pick(pool); waiting.delete(aid);
      const g = newGame('human', 'human', s.id, aid);
      s.emit('start', { mode: 'detective' });
      to(aid, 'start', { mode: 'actor' }); suggest(g, null);
      g.mission = pickMission(false); to(aid, 'mission', g.mission);
    } else {
      const g = newGame(wantHuman ? 'sim' : 'ai', wantHuman ? 'human' : 'ai', s.id, null);
      s.emit('start', { mode: 'detective' });
      setTimeout(async () => {
        if (g.over || g.msgs.length) return;
        to(g.det, 'typing'); await sleep(1200);
        if (g.over || g.msgs.length) return;
        const text = bot.greet(); g.msgs.push({ from: 'sub', text }); to(g.det, 'msg', { text });
      }, 1200 + Math.random() * 900);
    }
    counts();
  });

  s.on('createRoom', () => {
    leave(s); closeRoom(s); waiting.delete(s.id); s.data.role = null;
    const code = newCode();
    rooms.set(code, { code, players: [s.id], det: null, round: 0, ready: new Set(), score: {} });
    s.data.room = code; s.emit('room', { code }); counts();
  });

  s.on('joinRoom', raw => {
    const code = typeof raw === 'string' ? raw.trim().toUpperCase().slice(0, 4) : '';
    const r = rooms.get(code);
    if (!r || r.players.length !== 1 || r.players[0] === s.id || !sock(r.players[0])) return s.emit('roomError');
    leave(s); closeRoom(s); waiting.delete(s.id); s.data.role = null;
    r.players.push(s.id); s.data.room = code;
    roomRound(r); counts();
  });

  s.on('nextRound', () => {
    const r = rooms.get(s.data.room); if (!r || r.players.length !== 2 || games.get(s.data.game)) return;
    r.ready.add(s.id);
    if (r.ready.size === 2) roomRound(r);
    else { s.emit('roomWait'); const o = r.players.find(id => id !== s.id); to(o, 'friendReady'); }
  });

  // Photos: friend rooms only, blurred on arrival.
  s.on('photo', data => {
    const g = games.get(s.data.game); if (!g || g.over || !g.room || !isJpeg(data)) return;
    const now = Date.now(); if (now - (s.data.lastPhoto || 0) < 2000) return; s.data.lastPhoto = now;
    if (g.det === s.id) {
      if (g.act) to(g.act, 'photo', { data });
      checkMission(g, '', true);
      if (g.mode === 'roombot') setTimeout(() => {
        if (g.over) return;
        const last = [...g.msgs].reverse().find(m => m.from === 'det');
        const text = bot.photoReply(bot.lang(last ? last.text : ''));
        g.msgs.push({ from: 'sub', text }); to(g.det, 'msg', { text }); to(g.act, 'botmsg', { text });
      }, 1800 + Math.random() * 1200);
    } else if (g.act === s.id && g.mode === 'human') {
      to(g.det, 'photo', { data });
      if (g.dare && !g.dare.done) { g.dare.done = true; g.dare.ok = true; to(g.det, 'dareResult', { ok: true }); s.emit('dareResult', { ok: true }); }
    }
  });

  // Dare (friend rooms): the detective dares the subject to send a photo of their hand. One per round.
  s.on('dare', () => {
    const g = games.get(s.data.game); if (!g || g.over || !g.room || g.det !== s.id || g.dare) return;
    g.dare = { done: false, ok: false };
    s.emit('dareSent');
    if (g.mode === 'human') return to(g.act, 'dare');
    setTimeout(() => {
      if (g.over) return;
      const last = [...g.msgs].reverse().find(m => m.from === 'det');
      const text = bot.dareRefuse(bot.lang(last ? last.text : ''));
      g.dare.done = true;
      g.msgs.push({ from: 'sub', text }); to(g.det, 'msg', { text }); to(g.act, 'botmsg', { text });
      to(g.det, 'dareResult', { ok: false }); to(g.act, 'dareResult', { ok: false, bot: true });
    }, 2000 + Math.random() * 1500);
  });
  s.on('dareRefuse', () => {
    const g = games.get(s.data.game); if (!g || g.over || g.act !== s.id || !g.dare || g.dare.done) return;
    g.dare.done = true; to(g.det, 'dareResult', { ok: false }); s.emit('dareResult', { ok: false });
  });

  s.on('leaveRoom', () => { leave(s); closeRoom(s); counts(); });

  s.on('practice', () => {
    if (s.data.role !== 'actor') return;
    leave(s); waiting.delete(s.id);
    const g = newGame('practice', null, null, s.id);
    s.emit('start', { mode: 'practice' }); suggest(g, null); detAsk(g);
    counts();
  });

  s.on('msg', raw => {
    const text = clean(raw); const now = Date.now();
    if (!text || now - s.data.last < 600) return; s.data.last = now;
    const g = games.get(s.data.game); if (!g || g.over) return;
    if (g.det === s.id) {
      g.msgs.push({ from: 'det', text });
      checkMission(g, text, false);
      if (g.mode === 'human') { to(g.act, 'msg', { text }); suggest(g, text); }
      else if (g.mode === 'roombot') { to(g.act, 'msg', { text }); if (g.busy) g.pending = true; else botReply(g); }
      else if (g.busy) g.pending = true;
      else botReply(g);
    } else if (g.act === s.id) {
      g.msgs.push({ from: 'sub', text });
      if (g.mode === 'human') to(g.det, 'msg', { text });
      else if (g.mode === 'practice') detAsk(g);
    }
  });

  s.on('typing', () => {
    const g = games.get(s.data.game); if (!g || g.over || g.mode !== 'human') return;
    to(g.det === s.id ? g.act : g.det, 'typing');
  });

  s.on('vote', v => {
    const g = games.get(s.data.game); if (!g || g.over || g.det !== s.id) return;
    const left = Date.now() - g.start;
    if (left < SKIP_AFTER) return s.emit('voteWait', { ms: SKIP_AFTER - left });
    const vote = v === 'ai' ? 'ai' : 'human';
    // points: detective +1 for a correct call; faker +1 for fooling, +2 for the mission, +1 for a dare done
    const pd = vote === g.truth ? 1 : 0;
    let pa = 0;
    if (g.mode === 'human') pa = (vote === 'ai' ? 1 : 0) + (g.mission && g.mission.done ? 2 : 0) + (g.dare && g.dare.ok ? 1 : 0);
    const r = g.room && rooms.get(g.room);
    let score = null;
    if (r) {
      r.score[g.det] = (r.score[g.det] || 0) + pd;
      if (g.act) r.score[g.act] = (r.score[g.act] || 0) + pa;
      score = id => ({ me: r.score[id] || 0, them: r.score[r.players.find(x => x !== id)] || 0 });
    }
    s.emit('result', { kind: 'det', ok: vote === g.truth, vote, truth: g.truth, mode: g.mode, pts: pd, score: score && score(g.det) });
    if (g.act && g.mode === 'roombot') to(g.act, 'result', { kind: 'watch', ok: vote === g.truth, vote, pts: 0, score: score && score(g.act) });
    else if (g.act) to(g.act, 'result', { kind: 'act', fooled: vote === 'ai', reason: '', pts: pa, mission: g.mission, score: score && score(g.act) });
    endGame(g);
  });

  // Every game lasts at least 3 minutes before the player may skip it.
  s.on('skip', () => {
    const g = games.get(s.data.game); if (!g || g.over) return;
    const left = Date.now() - g.start;
    if (left < SKIP_AFTER) return s.emit('skipWait', { ms: SKIP_AFTER - left });
    const r = g.room && rooms.get(g.room);
    if (r) { endGame(g); return roomRound(r); }  // in a friend room, skipping starts the next round
    const other = g.det === s.id ? g.act : g.det;
    if (other) to(other, 'left');
    endGame(g);
    s.emit('skipped');
  });

  s.on('leave', () => { leave(s); waiting.delete(s.id); counts(); });
  s.on('disconnect', () => { leave(s); closeRoom(s); waiting.delete(s.id); counts(); });
});

server.listen(PORT, () => console.log(`Bot or Faker on :${PORT} (free built-in bot)`));
