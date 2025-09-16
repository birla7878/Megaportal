# MegaPortal Pro

A multi-page, responsive UI with **functional front‑end features** powered by LocalStorage:
- **Matrimonial**: live filters over demo profiles.
- **Social**: like, comment, and create posts (persisted).
- **Shop**: search, sort, and cart with checkout (persisted).
- **Cart**: quantity updates, remove, total computation, fake checkout.
- **Contact**: form validation and message store.

> This is a front-end demo. You can later connect it to your backend (WordPress REST API, Firebase, or custom).

## Files
- `index.html`, `about.html`, `contact.html`, `matrimonial.html`, `social.html`, `shop.html`, `cart.html`
- `assets/css/style.css`
- `assets/js/app.js`

## How to run
Just open `index.html` in your browser. For best results, serve via a local server:
- VS Code: `Live Server` extension
- Node: `npx serve` (or any static server)
- Python: `python -m http.server 8000`

## Notes
- Data and actions are **persisted in LocalStorage** under keys like `mp_cart`, `mp_posts`, etc.
- Replace demo images/strings as needed.
- All buttons show toasts so you can feel the flow end‑to‑end.
