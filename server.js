// freechat — anonymous 1-on-1 chat server.
// Zero dependencies: plain Node.js (18+). Run with `node server.js`.

'use strict';

const http = require('node:http');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

// ---------- Settings (change with environment variables) ----------
const PORT = Number(process.env.PORT) || 3000;
const MAX_MSG_CHARS = Number(process.env.MAX_MSG_CHARS) || 1000;
const BLOCK_LINKS = process.env.BLOCK_LINKS !== 'false';       // replace links with [link removed]
const MAX_CONN_PER_IP = Number(process.env.MAX_CONN_PER_IP) || 4;
const INTEREST_WAIT_MS = 8000;                                   // then match with anyone
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const IP_SALT = process.env.IP_SALT || crypto.randomBytes(16).toString('hex');
const TRUST_PROXY = process.env.TRUST_PROXY !== 'false';           // true on Render/Railway/Fly
const PUBLIC_DIR = path.join(__dirname, 'public');

// ---------- Static files ----------
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
};
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; " +
    "img-src 'self' data:; connect-src 'self' ws: wss:; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }
  if (url.pathname === '/api/online') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify({ online: clients.size }));
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405); return res.end();
  }
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/index.html';
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
      return res.end('Not found');
    }
    const ext = path.extname(file);
    res.writeHead(200, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
      ...SECURITY_HEADERS,
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
});

// ---------- Minimal WebSocket (RFC 6455) ----------
const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const MAX_FRAME = 16 * 1024;

function clientIp(req) {
  // Behind Render/Railway/Fly the real IP is the first x-forwarded-for entry.
  const fwd = TRUST_PROXY && req.headers['x-forwarded-for'];
  const ip = (fwd ? String(fwd).split(',')[0] : req.socket.remoteAddress) || 'unknown';
  return ip.trim();
}
const hashIp = ip => crypto.createHash('sha256').update(IP_SALT + ip).digest('hex').slice(0, 16);

function encodeFrame(opcode, payload) {
  const len = payload.length;
  let header;
  if (len < 126) { header = Buffer.alloc(2); header[1] = len; }
  else if (len < 65536) { header = Buffer.alloc(4); header[1] = 126; header.writeUInt16BE(len, 2); }
  else { header = Buffer.alloc(10); header[1] = 127; header.writeBigUInt64BE(BigInt(len), 2); }
  header[0] = 0x80 | opcode;
  return Buffer.concat([header, payload]);
}

class WSConn {
  constructor(socket, onMessage, onClose) {
    this.socket = socket;
    this.buf = Buffer.alloc(0);
    this.fragments = null;
    this.alive = true;
    this.closed = false;
    this.onMessage = onMessage;
    this.onClose = onClose;
    socket.setNoDelay(true);
    socket.on('data', d => this._data(d));
    socket.on('close', () => this._closed());
    socket.on('error', () => this._closed());
  }
  _data(chunk) {
    this.buf = Buffer.concat([this.buf, chunk]);
    if (this.buf.length > MAX_FRAME * 2) return this.close(1009);
    while (this.buf.length >= 2) {
      const b0 = this.buf[0], b1 = this.buf[1];
      const fin = (b0 & 0x80) !== 0, opcode = b0 & 0x0f, masked = (b1 & 0x80) !== 0;
      let len = b1 & 0x7f, off = 2;
      if (!masked) return this.close(1002);               // clients must mask
      if (len === 126) { if (this.buf.length < 4) return; len = this.buf.readUInt16BE(2); off = 4; }
      else if (len === 127) { if (this.buf.length < 10) return; const big = this.buf.readBigUInt64BE(2); if (big > BigInt(MAX_FRAME)) return this.close(1009); len = Number(big); off = 10; }
      if (len > MAX_FRAME) return this.close(1009);
      if (this.buf.length < off + 4 + len) return;
      const mask = this.buf.subarray(off, off + 4);
      const payload = Buffer.from(this.buf.subarray(off + 4, off + 4 + len));
      for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i & 3];
      this.buf = this.buf.subarray(off + 4 + len);
      this._frame(fin, opcode, payload);
      if (this.closed) return;
    }
  }
  _frame(fin, opcode, payload) {
    if (opcode === 0x8) return this.close(1000);
    if (opcode === 0x9) return this._raw(encodeFrame(0xA, payload));
    if (opcode === 0xA) { this.alive = true; return; }
    if (opcode === 0x1 || opcode === 0x0) {
      if (opcode === 0x1) this.fragments = [];
      if (!this.fragments) return this.close(1002);
      this.fragments.push(payload);
      const total = this.fragments.reduce((n, b) => n + b.length, 0);
      if (total > MAX_FRAME) return this.close(1009);
      if (fin) {
        const text = Buffer.concat(this.fragments).toString('utf8');
        this.fragments = null;
        this.onMessage(text);
      }
      return;
    }
    if (opcode === 0x2) return this.close(1003);          // no binary
  }
  _raw(buf) { if (!this.closed && this.socket.writable) this.socket.write(buf); }
  send(obj) { this._raw(encodeFrame(0x1, Buffer.from(JSON.stringify(obj)))); }
  ping() { this._raw(encodeFrame(0x9, Buffer.alloc(0))); }
  close(code = 1000) {
    if (this.closed) return;
    const p = Buffer.alloc(2); p.writeUInt16BE(code);
    this._raw(encodeFrame(0x8, p));
    this.socket.end();
    setTimeout(() => this.socket.destroy(), 1000).unref();
    this._closed();
  }
  _closed() {
    if (this.closed) return;
    this.closed = true;
    this.onClose();
  }
}

// ---------- Chat state ----------
const clients = new Map();   // id -> client
const queue = [];            // ids waiting for a partner
const connsPerIp = new Map();

function cleanText(s) {
  if (typeof s !== 'string') return '';
  let t = s.replace(/[\u0000-\u0009\u000B-\u001F\u007F​-‏‪-‮⁦-⁩]/g, '');
  t = t.replace(/\n{3,}/g, '\n\n').trim();
  if (t.length > MAX_MSG_CHARS) t = t.slice(0, MAX_MSG_CHARS);
  if (BLOCK_LINKS) {
    t = t.replace(/\b((https?:\/\/|www\.)\S+|[a-z0-9-]+\.(com|net|org|io|me|gg|ly|co|xyz|app|link|site|online|ru|tk)(\/\S*)?)/gi, '[link removed]');
  }
  return t;
}

function cleanInterests(list) {
  if (!Array.isArray(list)) return [];
  const out = new Set();
  for (const raw of list.slice(0, 8)) {
    const t = cleanText(String(raw)).toLowerCase().replace(/[#,]/g, '').slice(0, 24).trim();
    if (t) out.add(t);
  }
  return [...out];
}

function leaveQueue(c) {
  const i = queue.indexOf(c.id);
  if (i !== -1) queue.splice(i, 1);
}

function endChat(c, reason) {
  const p = c.partner && clients.get(c.partner);
  c.partner = null;
  c.state = 'idle';
  if (p) {
    p.partner = null;
    p.state = 'idle';
    p.ws.send({ t: 'ended', by: 'stranger', reason });
  }
}

function canPair(a, b) {
  return a.id !== b.id &&
    !a.blocked.has(b.id) && !b.blocked.has(a.id);
}

function pair(a, b, common) {
  leaveQueue(a); leaveQueue(b);
  a.state = b.state = 'chatting';
  a.partner = b.id; b.partner = a.id;
  a.ws.send({ t: 'matched', common });
  b.ws.send({ t: 'matched', common });
}

function tryMatch(c) {
  if (c.state !== 'waiting') return;
  const now = Date.now();
  const relaxed = x => x.interests.length === 0 || now - x.waitingSince > INTEREST_WAIT_MS;
  let fallback = null;
  for (const id of queue) {
    const o = clients.get(id);
    if (!o || o.state !== 'waiting' || !canPair(c, o)) continue;
    const common = c.interests.filter(i => o.interests.includes(i));
    if (common.length) return pair(c, o, common);
    if (!fallback && relaxed(c) && relaxed(o)) fallback = o;
  }
  if (fallback) pair(c, fallback, []);
}

setInterval(() => { for (const id of [...queue]) { const c = clients.get(id); if (c) tryMatch(c); } }, 1000).unref();

function onMessage(c, raw) {
  let m;
  try { m = JSON.parse(raw); } catch { return; }
  if (!m || typeof m.t !== 'string') return;

  if (m.t === 'hello') {
    if (m.adult !== true) return c.ws.send({ t: 'error', code: 'age' });
    c.agreed = true;
    return c.ws.send({ t: 'ready', online: clients.size });
  }
  if (!c.agreed) return c.ws.send({ t: 'error', code: 'age' });

  switch (m.t) {
    case 'find': {
      if (c.state === 'chatting') {
        const p = clients.get(c.partner);
        if (p) { c.blocked.add(p.id); p.blocked.add(c.id); }
        endChat(c, 'skipped');
      }
      c.interests = cleanInterests(m.interests);
      c.state = 'waiting';
      c.waitingSince = Date.now();
      leaveQueue(c);
      queue.push(c.id);
      c.ws.send({ t: 'waiting' });
      return tryMatch(c);
    }
    case 'stop': {
      leaveQueue(c);
      if (c.state === 'chatting') { endChat(c, 'left'); c.ws.send({ t: 'ended', by: 'you' }); }
      c.state = 'idle';
      return;
    }
    case 'msg': {
      if (c.state !== 'chatting') return;
      // token bucket: 6 messages burst, refills 1 per second
      const now = Date.now();
      c.tokens = Math.min(6, c.tokens + (now - c.lastRefill) / 1000);
      c.lastRefill = now;
      if (c.tokens < 1) {
        c.strikes++;
        c.ws.send({ t: 'error', code: 'slow' });
        if (c.strikes > 15) c.ws.close(4008);
        return;
      }
      c.tokens -= 1;
      const text = cleanText(m.text);
      if (!text) return;
      const p = clients.get(c.partner);
      if (!p) return;
      p.ws.send({ t: 'msg', text });
      return c.ws.send({ t: 'sent', id: typeof m.id === 'string' ? m.id.slice(0, 20) : '', text });
    }
    case 'typing': {
      const p = c.state === 'chatting' && clients.get(c.partner);
      if (p) p.ws.send({ t: 'typing', on: !!m.on });
      return;
    }
  }
}

server.on('upgrade', (req, socket) => {
  const fail = code => { socket.write(`HTTP/1.1 ${code}\r\n\r\n`); socket.destroy(); };
  if (new URL(req.url, 'http://x').pathname !== '/ws') return fail('404 Not Found');
  if (String(req.headers.upgrade).toLowerCase() !== 'websocket') return fail('400 Bad Request');
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.length && !ALLOWED_ORIGINS.includes(origin)) return fail('403 Forbidden');
  const key = req.headers['sec-websocket-key'];
  if (!key) return fail('400 Bad Request');

  const ip = clientIp(req);
  const ipHash = hashIp(ip);
  const n = connsPerIp.get(ipHash) || 0;
  if (n >= MAX_CONN_PER_IP) return fail('429 Too Many Requests');

  const accept = crypto.createHash('sha1').update(key + WS_GUID).digest('base64');
  socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`);

  const c = {
    id: crypto.randomBytes(8).toString('hex'), ipHash, state: 'idle', partner: null,
    interests: [], blocked: new Set(), agreed: false, waitingSince: 0,
    tokens: 6, lastRefill: Date.now(), strikes: 0, ws: null,
  };
  connsPerIp.set(ipHash, n + 1);
  c.ws = new WSConn(socket, raw => onMessage(c, raw), () => {
    leaveQueue(c);
    if (c.state === 'chatting') endChat(c, 'disconnected');
    clients.delete(c.id);
    const left = (connsPerIp.get(ipHash) || 1) - 1;
    if (left <= 0) connsPerIp.delete(ipHash); else connsPerIp.set(ipHash, left);
  });

  clients.set(c.id, c);
});

// Heartbeat: drop dead connections, and push the online count.
let lastCount = -1;
setInterval(() => {
  for (const c of clients.values()) {
    if (!c.ws.alive) { c.ws.close(1001); continue; }
    c.ws.alive = false;
    c.ws.ping();
  }
}, 25000).unref();
setInterval(() => {
  if (clients.size === lastCount) return;
  lastCount = clients.size;
  for (const c of clients.values()) if (c.agreed) c.ws.send({ t: 'online', n: clients.size });
}, 5000).unref();

server.listen(PORT, () => console.log(`freechat running on http://localhost:${PORT}`));
