# JSupport1 Website (Static HTML/CSS/JS)

This project has been converted from Next.js (App Router, React, TypeScript,
Tailwind build pipeline) to a **plain static site**: HTML + vanilla JS + the
Tailwind CDN. There is no framework, no build step, and no `node_modules`
required to run or deploy it — just static files, which is exactly what
GitHub Pages serves.

## What changed

- All `src/app/**/page.tsx` routes were converted to standalone `.html` files
  at the repo root (`index.html`, `about.html`, `services.html`,
  `industries.html`, `framework.html`, `case-studies.html`, `contact.html`,
  `privacy-policy.html`, `terms.html`).
- `Header` / `Footer` / `Button` / `Section` React components were converted
  into plain HTML markup, duplicated at the top/bottom of each page (no
  server-side templating, since GitHub Pages can't run one).
- Tailwind is now loaded via the CDN Play script (`assets/js/tailwind-config.js`
  holds the same custom theme colors — `primary`, `secondary`, `accent`,
  `background`, `section`, `text`, `border` — that used to live in
  `globals.css`'s `@theme` block), so no PostCSS/Tailwind build step is
  needed.
- `next/font` (Inter) was replaced with a regular Google Fonts `<link>`.
- `next/link` became plain `<a href="...">` tags pointing at the `.html`
  files.
- Small bits of client-side behavior that Next.js/React handled automatically
  are now in `assets/js/main.js`:
  - Mobile nav toggle (the hamburger button had no handler in the original
    code — this adds a minimal working toggle since a non-functional button
    isn't useful on a live static site).
  - Footer copyright year and the "Last updated" date on the Privacy Policy /
    Terms pages (previously computed with `new Date()` at render time).
  - The contact form now shows an inline confirmation on submit instead of
    doing a native full-page GET request. **It doesn't send the data
    anywhere** — the original Next.js form had no backend/API route either,
    so this preserves the same "no backend" behavior. Wire it up to
    Formspree, a serverless function, or similar if you want real
    submissions.
- Unused Next.js boilerplate (`next.svg`, `vercel.svg`, `next/image` import,
  `next.config.ts`, `tsconfig.json`, ESLint/TS configs, `package.json`
  dependencies on `next`/`react`) was dropped since none of it was actually
  used by any page.

## Project structure

```
index.html
about.html
services.html
industries.html
framework.html
case-studies.html
contact.html
privacy-policy.html
terms.html
favicon.ico
.nojekyll
assets/
  css/style.css          # small custom rules (font fallback, smooth scroll)
  js/tailwind-config.js  # Tailwind CDN theme (custom colors, font)
  js/main.js             # mobile menu, dynamic year/date, contact form
.github/workflows/deploy.yml
```

## Running locally

No build tools needed. Any static file server works, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly via `file://` also mostly works, but a local
server is recommended so relative asset paths behave the same way they will
on GitHub Pages.)

## Building for production

There is **no compile/bundle step** — this is already the production
artifact (unlike the old Next.js version, there's no `next build` to run).
"Building for production" here just means: verify it, optionally shrink it,
then publish it.

1. **Verify locally first.**
   ```bash
   python3 -m http.server 8000
   # open http://localhost:8000 and click through every page/link
   ```
   Confirm every nav link, footer link, and the contact form all work, and
   that the mobile menu (resize the window or use dev tools' device mode)
   toggles correctly.

2. **(Optional) Minify HTML/CSS/JS.** The files are already small
   (largest page is ~30KB uncompressed) and GitHub Pages serves everything
   over gzip/Brotli automatically, so this step is optional. If you want it
   anyway:
   ```bash
   npx html-minifier-terser --input-dir . --output-dir dist \
     --file-ext html --collapse-whitespace --remove-comments \
     --minify-css true --minify-js true
   ```
   This requires Node/npm only for this one-off optimization pass — the
   site itself still runs with zero build tooling. If you minify into a
   `dist/` folder, deploy `dist/` instead of the repo root (adjust the
   workflow's `path:` / the Pages source folder accordingly).

3. **(Optional) Swap the Tailwind CDN for a compiled stylesheet.**
   `assets/js/tailwind-config.js` currently loads Tailwind via the Play CDN
   at runtime (simplest option, no build step, fine for a marketing site
   this size). For a slightly faster production load you could instead run
   the Tailwind CLI once to generate a static `assets/css/tailwind.css`,
   then replace the `<script src="https://cdn.tailwindcss.com">` /
   `tailwind-config.js` tags in each page's `<head>` with a single
   `<link rel="stylesheet" href="assets/css/tailwind.css">`. Not required —
   only worth doing if you want to trim the Tailwind CDN's runtime JIT
   compilation.

4. **Double-check metadata per page.** Each page already has its own
   `<title>` and `<meta name="description">` (carried over from the
   original Next.js `metadata` exports) — update these directly in the
   relevant `.html` file's `<head>` if copy changes.

## Deploying to GitHub Pages

**Option A — GitHub Actions (included, recommended):**
1. Push this repo to GitHub (`main` branch).
2. In the repo, go to **Settings → Pages → Build and deployment → Source**
   and select **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` runs automatically on every
   push to `main` — no build commands execute, it just uploads the static
   files and publishes them.
4. Watch progress under the repo's **Actions** tab; the deployed URL appears
   there and under **Settings → Pages** once it succeeds.

**Option B — Deploy from a branch (no Actions needed):**
1. Push this repo to GitHub.
2. Go to **Settings → Pages → Build and deployment → Source** and select
   **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Save. GitHub serves `index.html` and the rest of the files directly —
   no build step required.

Either way, once enabled, the site goes live at
`https://<your-username>.github.io/<repo-name>/` (usually within a minute or
two of the workflow/deploy finishing).

**Custom domain (optional):** add a `CNAME` file at the repo root containing
your domain (e.g. `www.jsupport1.com`), then point your DNS `CNAME` record
at `<your-username>.github.io`. Set it under **Settings → Pages → Custom
domain** and GitHub will create/manage that `CNAME` file for you.

> If you use a **project site** (i.e. the URL above, not a custom domain or a
> `<username>.github.io` root repo), and you later add absolute asset paths,
> remember GitHub Pages serves it from a `/<repo-name>/` subpath. This project
> uses relative paths (`assets/...`, `about.html`, etc.) throughout, so it
> works correctly at any subpath without changes.

## Post-deploy checklist

- [ ] Every nav link (desktop + mobile) loads the right page
- [ ] Footer legal links (`privacy-policy.html`, `terms.html`) load
- [ ] "Request Consultation" / "Discuss Your Project" CTAs go to `contact.html`
- [ ] Contact form shows the confirmation message on submit
- [ ] Mobile hamburger menu opens/closes and closes after tapping a link
- [ ] Favicon shows in the browser tab
- [ ] Page titles are correct per page (check the browser tab / search result preview)
