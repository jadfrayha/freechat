# Bot or Faker

A live chat game. **Detectives** chat with a subject that claims to be an AI and vote: *Real AI* or *Human faking*. **Fakers** are humans trying to pass as an AI (with AI-style reply suggestions). When no faker is waiting, Claude plays one, so a round always starts. English + Arabic.

## Run locally
```
npm install
ANTHROPIC_API_KEY=sk-ant-... npm start
```
Open http://localhost:3000

## Deploy on Render
New → Blueprint → pick this repo (uses `render.yaml`), then set `ANTHROPIC_API_KEY` in the service's Environment tab.
