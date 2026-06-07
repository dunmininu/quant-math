# World Cup Quant Bot — RohOnChain Strategy Explainer

Interactive breakdown of Roan's FIFA World Cup 2026 Polymarket shock-recovery
trading bot and the Polymarket arbitrage math article.

## Tech stack
- React 18
- Vite 4
- Recharts 2

---

## Deploy to Netlify (3 options)

### Option A — Drag and drop (fastest, no Git needed)
1. `npm install`
2. `npm run build`   ← this creates a `dist/` folder
3. Go to https://app.netlify.com/drop
4. Drag the entire `dist/` folder onto the page
5. Done — live URL in seconds

### Option B — Connect a GitHub repo (recommended for updates)
1. Push this folder to a new GitHub repo
2. Go to https://app.netlify.com → "Add new site" → "Import an existing project"
3. Connect GitHub, select the repo
4. Netlify auto-detects Vite. Build settings will be pre-filled:
   - Build command:  `npm run build`
   - Publish dir:    `dist`
5. Click "Deploy site"
6. Every future `git push` auto-redeploys

### Option C — Netlify CLI
```bash
npm install -g netlify-cli
npm install
npm run build
netlify deploy --prod --dir=dist
```

---

## Run locally
```bash
npm install
npm run dev
```
Opens at http://localhost:5173

---

## Project structure
```
worldcup-quant-bot/
├── index.html          ← HTML shell
├── package.json        ← dependencies
├── vite.config.js      ← Vite + React plugin
├── netlify.toml        ← build command + SPA redirect
└── src/
    ├── main.jsx        ← React entry point
    └── App.jsx         ← the full interactive explainer
```
