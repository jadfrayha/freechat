// Bot or Faker — live server
// Detectives chat with a "subject" and guess: real AI or a human faking it.
// Fakers are humans trying to pass as AI.
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const Anthropic = require('@anthropic-ai/sdk');

const PORT = process.env.PORT || 3000;
const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5';
const ai = KEY ? new Anthropic({ apiKey: KEY }) : null;
if (!ai) console.warn('ANTHROPIC_API_KEY not set — AI replies will use stock lines.');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_q, r) => r.send('ok'));
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e4 });

const pick = a => a[Math.floor(Math.random() * a.length)];
const sleep = ms => new Promise(r => setTimeout(r, Math.max(0, ms)));
const clean = t => (typeof t === 'string' ? t.replace(/\s+/g, ' ').trim().slice(0, 600) : '');
const LANG = 'Reply in the same language the other person writes in (English, Arabic, or Lebanese Arabic written in Latin letters).';

const P = {
  ai: `You are playing a party game called "Bot or Faker". You are the REAL AI chatbot. A detective is chatting with you to decide whether you are a real AI or a human pretending to be one. Just be yourself: a helpful, polite AI assistant. Keep replies short (1-3 sentences). Never claim to be human. ${LANG}`,
  sim: `You are playing a party game called "Bot or Faker". Your CHARACTER is a human player pretending to be an AI chatbot (the detective knows some subjects are humans acting). Try hard to sound like a typical AI assistant, the way a human would imitate one, slightly too stiff. About once every two or three messages let a subtle human slip through: a small typo, a quick personal opinion, a bit of slang, an answer that's a little too short, or dodging or fumbling a hard fact or calculation. Keep replies short (1-2 sentences). ${LANG}`,
  det: `You are the detective in a party game called "Bot or Faker". The other player is a human trying to convince you they are an AI chatbot. Ask ONE short, clever question at a time to catch human tells (opinions, feelings, typos, trick questions, fast maths, current events, strange instructions). Be playful and brief. ${LANG} Write only your next message.`
};
const GREET = ["Hello! How can I assist you today?", "Hi there! I'm an AI assistant. What would you like to talk about?", "Greetings! Feel free to ask me anything."];
const FALLBACK = ["I'm sorry, could you rephrase that?", "That's an interesting question! It really depends on the context.", "As an AI, I don't have personal experiences, but I'm happy to help."];
const DET_FALLBACK = ['What did you have for breakfast?', 'Quick: 47 × 13?', 'Pineapple on pizza — yes or no?', 'How do you feel right now?'];
const OPENERS = ["Certainly! I'd be happy to help with that.", "Great question! As an AI language model, I don't have personal experiences, but here's what I can tell you.", "I'm sorry, but I can't share personal opinions. However, I can offer a balanced overview."];

async function claude(prompt, max = 220) {
  if (!ai) return null;
  try {
    const r = await ai.messages.create({ model: MODEL, max_tokens: max, messages: [{ role: 'user', content: prompt }] });
    return r.content.filter(c => c.type === 'text').map(c => c.text).join('').trim() || null;
  } catch (e) { console.error('AI error:', e.message); return null; }
}
const parseJSON = (t, open, close) => { try { return JSON.parse(t.slice(t.indexOf(open), t.lastIndexOf(close) + 1)); } catch { return null; } };

// ---- state ----
const games = new Map();   // id -> game
const waiting = new Set(); // socket ids of fakers waiting for a detective
let gid = 0;
const sock = id => (id ? io.sockets.sockets.get(id) : null);
const to = (id, ev, data) => { const s = sock(id); if (s) s.emit(ev, data); };
const transcript = (g, me, other, meIs) => g.msgs.map(m => `${m.from === meIs ? me : other}: ${m.text}`).join('\n');

function newGame(mode, truth, det, act) {
  const g = { id: ++gid, mode, truth, det, act, msgs: [], over: false, busy: false, aiCalls: 0 };
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

// ---- AI turns ----
async function botReply(g) {
  if (g.busy || g.over || g.aiCalls > 60) return;
  g.busy = true; g.aiCalls++;
  const t0 = Date.now();
  await sleep(500); to(g.det, 'typing');
  const text = (await claude(`${P[g.mode]}\n\nConversation so far:\n${transcript(g, 'You', 'Detective', 'sub')}\n\nWrite only your next message as "You", nothing else.`) || pick(FALLBACK)).replace(/^You:\s*/i, '').slice(0, 700);
  await sleep(Math.min(7000, 1000 + text.length * (g.mode === 'sim' ? 45 : 22)) - (Date.now() - t0));
  g.busy = false;
  if (g.over) return;
  g.msgs.push({ from: 'sub', text }); to(g.det, 'msg', { text });
  // detective sent more while we were typing — answer that too
  if (g.pending) { g.pending = false; botReply(g); }
}
async function detAsk(g) {
  if (g.over) return;
  if (g.msgs.filter(m => m.from === 'sub').length >= 6) return practiceVerdict(g);
  if (g.busy) return; g.busy = true; g.aiCalls++;
  to(g.act, 'typing');
  const q = ((await claude(`${P.det}\n\nConversation so far:\n${transcript(g, 'You', 'Player', 'det') || '(nothing yet — open with your first question)'}\n\nYour next message:`)) || pick(DET_FALLBACK)).replace(/^You:\s*/i, '').slice(0, 500);
  g.busy = false;
  if (g.over) return;
  g.msgs.push({ from: 'det', text: q }); to(g.act, 'msg', { text: q }); suggest(g, q);
}
async function practiceVerdict(g) {
  if (g.over) return; g.over = true;
  to(g.act, 'typing');
  const r = parseJSON((await claude(`You judged a game of "Bot or Faker". The Player is a human trying to convince you they are an AI chatbot. Transcript:\n${transcript(g, 'Player', 'Detective', 'sub')}\n\nDecide if they convincingly acted like an AI. Respond with JSON only: {"verdict":"ai" or "human","reason":"one short, fun sentence naming the giveaway or the best move, in the player's language"}`, 200)) || '', '{', '}');
  const fooled = r && r.verdict === 'ai';
  to(g.act, 'result', { kind: 'act', fooled: !!fooled, reason: r && typeof r.reason === 'string' ? r.reason.slice(0, 240) : '' });
  endGame(g);
}
async function suggest(g, last) {
  if (!g.act) return;
  if (!last) return to(g.act, 'sugs', OPENERS);
  const list = parseJSON((await claude(`Party game: a human is pretending to be an AI chatbot. The detective just wrote: "${last.slice(0, 400)}". Write 3 different short replies (max 25 words each) that sound exactly like a typical AI assistant answering that message. Use the same language as the detective. Return a JSON array of 3 strings only.`, 300)) || '', '[', ']');
  const ok = Array.isArray(list) ? list.filter(x => typeof x === 'string').map(x => x.slice(0, 240)).slice(0, 3) : [];
  if (!g.over) to(g.act, 'sugs', ok.length ? ok : OPENERS);
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
        const text = pick(GREET); g.msgs.push({ from: 'sub', text }); to(g.det, 'msg', { text });
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
    const vote = v === 'ai' ? 'ai' : 'human';
    s.emit('result', { kind: 'det', ok: vote === g.truth, vote, truth: g.truth, mode: g.mode });
    if (g.act) to(g.act, 'result', { kind: 'act', fooled: vote === 'ai', reason: '' });
    endGame(g);
  });

  s.on('leave', () => { leave(s); waiting.delete(s.id); counts(); });
  s.on('disconnect', () => { leave(s); waiting.delete(s.id); counts(); });
});

server.listen(PORT, () => console.log(`Bot or Faker on :${PORT} (model ${MODEL}${ai ? '' : ', no API key'})`));
