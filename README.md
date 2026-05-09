# InvDeck

Clickable investor deck hub built with React + Vite, ready to deploy on Vercel.

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
4. Deploy and copy the generated `https://<project>.vercel.app` URL.

`vercel.json` includes an SPA rewrite so routes like `/pitch-v2` work directly.

## Suggested next upgrade

For smoother investor flow, replace placeholder pages with embedded assets:

- `public/pitch-v1.pdf`
- `public/pitch-v2.pdf`

Then render each with an `<iframe>` or PDF viewer for true click-through slides.
