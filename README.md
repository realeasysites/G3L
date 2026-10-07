# Green Life Lawn and Landscaping LLC — Website

High-converting site + lead system for Green Life Lawn and Landscaping LLC (Rochester, NY).
Built on the Real Easy Sites / TBLC template pattern: Node/Express + SQLite, admin lead dashboard.

## Structure
```
server.js          thin entry point (middleware + route mounting)
db/database.js     SQLite (better-sqlite3) — leads table + queries
lib/mailer.js      emails new quote requests to NOTIFY_EMAIL (fails soft)
lib/auth.js        single-user admin login (env vars + session)
routes/quote.js    POST /api/quote  (validation, honeypot, rate limit)
routes/admin.js    /admin login, dashboard, JSON API, CSV export
views/             admin-login.html, admin.html
public/            the website (index.html, css/, js/, images/, 404.html)
```

## Run locally
```
npm install
cp .env.example .env     # then edit values
npm start                # http://localhost:3000   admin: /admin
```
Node is pinned to 20.x (`.node-version` + `engines`) — better-sqlite3 has no prebuilt binary for newer Node.

## Deploy (Render)
1. Push this folder to a new GitHub repo.
2. Render → New Web Service → connect repo. Build: `npm install` · Start: `npm start`.
   (If the project ends up in a subfolder of the repo, set Render's Root Directory to it.)
3. Add the env vars from `.env.example`.
4. Add a persistent disk mounted at `/opt/render/project/src/db` so leads survive redeploys (or plan on CSV exports).

## Business facts used (verified)
- Owner: **Jose Lugo** (BBB profile). Business started 2022. Sole proprietorship per BBB.
- **BBB Accredited since 3/24/2025, A+ rating** (client also supplied a photo of the certificate).
- BBB-listed services: landscaping, landscape design, cleanup, lawn maintenance, mulch, tree trimming, pressure washing, gutter cleaning, snow plowing. Photos add stump grinding + river-rock paths.
- Reviews on site are real and verbatim: Michael C. + Joan G. (BBB, 5★), Stephanie M. + Linda S. (Facebook recommendations — no stars shown for those).
- BBB lists a street address (Rochester 14625). It is intentionally NOT shown on the site — confirm with Jose whether he wants it public.

## Photos (all real, client-supplied, resized to ≤1600px, metadata/GPS stripped)
| File | Where it's used |
|---|---|
| hero-striped-lawn.jpg | Hero |
| crew-at-work.jpg | About (crew member in branded shirt) |
| stone-path.jpg | Landscaping & Design card |
| mowing-stripes-hedges.jpg | Lawn Mowing card |
| yard-cleanup.jpg | Cleanups card |
| shaped-shrubs.jpg | Shrub & Tree Trimming card |
| stump-grinding.jpg | Tree Removal & Stump Grinding card |
| work-*.jpg (5) | Recent Work gallery |
| bbb-accredited.jpg | BBB credential chip in About |
| logo-round.png / logo-square.jpg / favicon-*.png | Logo (cropped from client's logo photo) |

No photos yet for snow plowing, pressure washing, or gutter cleaning — those live in the "Also on the menu" band, which is designed to work without images.

## Before launch — open items
- [ ] Confirm commercial work is something he wants to advertise (photos show roadside/commercial lots).
- [ ] Facebook lists "Delivery" as a specialty — mulch/stone delivery? Add if so.
- [ ] Confirm service area towns (Rochester + Greece confirmed; BBB address is 14625 — Penfield/Webster side?).
- [ ] Logo is cropped from a photo of a screen (slight line pattern up close). Ask for the original logo file for a crisper header.
- [ ] NOTIFY_EMAIL — preset to greenlifelawn22@gmail.com (from the Facebook page). Confirm, and set up SMTP sender (Gmail App Password).
- [ ] Change ADMIN_PASSWORD + SESSION_SECRET.
- [ ] Does he use Jobber or another scheduling tool? If so, the quote form could feed that instead.
- [ ] Domain: client buys and owns it.
