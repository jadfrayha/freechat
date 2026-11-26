// Bot or Faker — live server
// Detectives chat with a "subject" and guess: real AI or a human faking it.
// Fakers are humans trying to pass as AI.
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const bot = require('./bot');

const PORT = process.env.PORT || 3000;
const SKIP_AFTER = 90 * 1000; // minimum time before a game can be skipped or voted on (1:30)

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_q, r) => r.send('ok'));
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e4 });

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
  s.data = { role: null, game: null, last: 0 };
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
      if (g.mode === 'human') { to(g.act, 'msg', { text }); suggest(g, text); }
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
    s.emit('result', { kind: 'det', ok: vote === g.truth, vote, truth: g.truth, mode: g.mode });
    if (g.act) to(g.act, 'result', { kind: 'act', fooled: vote === 'ai', reason: '' });
    endGame(g);
  });

  // Every game lasts at least 3 minutes before the player may skip it.
  s.on('skip', () => {
    const g = games.get(s.data.game); if (!g || g.over) return;
    const left = Date.now() - g.start;
    if (left < SKIP_AFTER) return s.emit('skipWait', { ms: SKIP_AFTER - left });
    const other = g.det === s.id ? g.act : g.det;
    if (other) to(other, 'left');
    endGame(g);
    s.emit('skipped');
  });

  s.on('leave', () => { leave(s); waiting.delete(s.id); counts(); });
  s.on('disconnect', () => { leave(s); waiting.delete(s.id); counts(); });
});

server.listen(PORT, () => console.log(`Bot or Faker on :${PORT} (free built-in bot)`));
