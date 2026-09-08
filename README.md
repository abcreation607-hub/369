# Charan Mobiles — GitHub Pages Edition

## What this version does
- Works as a static website on GitHub Pages.
- Public products and offers.
- QR code for the deployed website.
- Client-side PDF E-Bill generation.
- Responsive mobile design.
- No Node, Render, build command, TypeScript, server.js, or deployment build step.

## Publish on GitHub Pages
1. Create a GitHub repository.
2. Upload **all files inside this folder** (not the ZIP itself).
3. Repository → Settings → Pages.
4. Source: **Deploy from a branch**.
5. Branch: **main** and folder: **/(root)**.
6. Save.
7. Open the URL GitHub gives you.

## Important limitation
GitHub Pages is static hosting. It cannot safely run a private backend, secure authentication, private database credentials, or server-side storage.

Do NOT put Turso auth tokens or Tigris secret keys in app.js, HTML, or GitHub. Public repositories expose them to everyone.

To change products/offers, edit `app.js`.
