# InvDeck

Direct-link investor deck app built with React + Vite, ready for Vercel.

## Local development

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, click **Add New → Project** and import the repo.
3. Keep defaults:
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy and share the generated URL (root redirects to `/pitch-v2`).

`vercel.json` includes an SPA rewrite so direct links (for example `/pitch-v2`) work directly.

## Suggested upgrade for smoother flow

Add actual deck files and embed them inline:

- `public/pitch-v1.pdf`
- `public/pitch-v2.pdf`

This creates a true click-through experience without switching contexts.
