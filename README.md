# freechat

Free, anonymous, one-on-one chat with strangers. English and Arabic (right-to-left), works on phones and desktop.

No database, no sign-up, and **no packages to install**: it's one Node.js file plus a `public/` folder.

## What's inside

```
freechat/
  server.js        the whole backend: website + real-time chat + matching + moderation
  package.json     tells hosts how to start it (npm start)
  public/
    index.html     the page
    styles.css     the design (light and dark mode)
    app.js         the chat logic in the browser, plus all English/Arabic text
    favicon.svg
```

## Features

- Random 1-on-1 matching, with optional interests (people who share an interest are matched first; after 8 seconds anyone is fair game)
- Skip / next (press twice to confirm, or press Esc twice on a keyboard)
- "Stranger is typing" indicator, unread count in the browser tab
- Optional nickname, shown to the person you're chatting with
- Add friend: both people agree, then they can invite each other to chat whenever both are online. Friends are saved on each device (no accounts), so clearing the browser removes them
- Photos: anyone can send one; it arrives blurred until the receiver taps it. Photos are resized in the browser, which also strips location data, and are never stored on the server
- English / Arabic switch, remembers the choice, auto-picks Arabic for Arabic phones
- Safety built in:
  - 18+ confirmation before anyone can chat
  - Safety notice on the home page and at the start of every chat: don't send anything that could harm you (name, number, address, photos, socials)
  - Skipping someone means you're never matched with them again in that session
  - Links are removed automatically (stops spam and scams)
  - Flood protection (max ~1 message/second after a short burst), message length limit
  - Max 4 open connections per IP
  - Messages are never stored. Only a scrambled (hashed) IP is kept, and only while connected

## Run it on your computer

Needs Node.js 18 or newer (https://nodejs.org).

```
cd freechat
node server.js
```

Open http://localhost:3000 in two different browser windows (one normal, one incognito) and chat with yourself.

## Put it online for free

### Render (easiest)
1. Make a free GitHub account, create a new repository, and upload everything in this folder.
2. Go to https://render.com, sign in with GitHub, click **New → Web Service**, pick your repository.
3. Settings: **Runtime** Node, **Build command** leave empty (or `npm install`), **Start command** `node server.js`, **Instance type** Free.
4. Click **Create**. In a minute you get a link like `https://freechat-xxxx.onrender.com`.

Note: Render's free plan sleeps after 15 minutes without visitors, so the first visit after a pause takes ~30–50 seconds to wake up. When the site gets real traffic, the cheapest paid instance (~$7/month) keeps it always on.

### Railway or Fly.io
Same idea: connect the GitHub repo, start command `node server.js`. Both support WebSockets, which this needs.

### Your own domain
Buy a domain (e.g. freechat.lb or something available on Namecheap/Cloudflare), then add it as a custom domain in Render's settings. HTTPS is automatic.

## Settings (environment variables, optional)

| Variable | Default | What it does |
|---|---|---|
| `PORT` | 3000 | Set automatically by hosts |
| `BLOCK_LINKS` | true | `false` lets people send links |
| `MAX_CONN_PER_IP` | 4 | Open tabs allowed per IP |
| `MAX_MSG_CHARS` | 1000 | Longest message |
| `ALLOWED_ORIGINS` | (any) | e.g. `https://freechat.lb` so other sites can't connect to your server |
| `TRUST_PROXY` | true | Keep `true` on Render/Railway/Fly. Set `false` if you run it directly on a server with no proxy in front |

## Things to know before launching publicly

- **There is no report button**, so you have no way to remove someone who keeps harassing people. If abuse becomes a problem, reporting can be added back.
- **Anonymous chat attracts abuse.** If you ever learn of content involving minors, report it (in Lebanon: the Internal Security Forces cybercrime bureau; internationally: NCMEC CyberTipline).
- **Write a real Terms page and Privacy Policy** before promoting it. The in-app rules and privacy text are a solid start.
- One server process handles a few thousand people at once. Past that you'd need multiple servers with shared matching (Redis); cross that bridge later.

## Changing text or colors

- All words (English and Arabic) are at the top of `public/app.js` in the `T` object.
- Colors are at the top of `public/styles.css` (`--cobalt` is the main brand color).
- The headline conversation on the home page is `heroA`, `heroB`, `heroC` in `app.js`.
