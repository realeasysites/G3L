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

## Theme
Green Life's own lime/black logo colors stay the brand. v3 adds a light game-day spin for Jose (Giants fan) using only a navy + red palette and football-flavored copy ("Call the play", "Special teams", "Four quarters, one crew", "highlight reel", "home crowd"). No team name, logo or wordmark is used anywhere, so there are no trademark issues.

## Standing Real Easy Sites rules applied
- Password-only admin login (ADMIN_PASSWORD), every lead deletable.
- Footer credit bottom-right: "Website by Real Easy Sites" → getrealeasysites.com.
- Share image (og:image) is the client's logo.
- No numbered 1-2-3 "How it works" section. It's replaced by the "Call the play" picker: the visitor taps a yard problem, sees the fix, and "Call this play" pre-selects that service in the quote form.

## Business facts used (verified)
- Owner: **Jose Lugo** (BBB profile). Business started 2022. Sole proprietorship per BBB.
- **BBB Accredited since 3/24/2025, A+ rating** (client also supplied a photo of the certificate).
- BBB-listed services: landscaping, landscape design, cleanup, lawn maintenance, mulch, tree trimming, pressure washing, gutter cleaning, snow plowing. Photos add stump grinding + river-rock paths.
- Reviews on site are real and verbatim: Michael C. + Joan G. (BBB, 5★), Stephanie M. + Linda S. (Facebook recommendations — no stars shown for those).
- BBB lists a street address (Rochester 14625). It is intentionally NOT shown on the site — confirm with Jose whether he wants it public.

## Photos (all real, client-supplied, resized to ≤1600px, metadata/GPS stripped)
Hero: hero-colonial-stripes · Services: landscape-brick-colonial, mowing-stripes-hedges, crew-mulching-beds, crew-hedge-ladder, stump-grinding · "Special teams" band: snow-plow-trucks, pressure-washed-storefront, gutter-cleaning · About: crew-at-work + bbb-accredited · "Call the play" cards: brick-house-mulch-bed, fall-lawn, mower-seat-stripes, topiary-shrubs, bucket-truck-tree-removal, paver-patio-plantings, snow-plow-trucks, pressure-washed-storefront, gutter-cleaning · Gallery (10): boulder-island-bed, bucket-truck-tree-removal, paver-walkway-bed, stone-wall-raised-bed, crew-trimming-topiary, crew-mowing-lawn, work-large-property, new-bed-stone-edging, shaped-shrubs, crew-mower-trailer.

**Logo:** pulled from the client's business card, upscaled with Higgsfield (bytedance upscaler, no regeneration, so the lettering is the original), then the card's border lines and grommet holes were painted out. Files: logo-round.png, logo-square.jpg (share image), favicon-*.png.

**From the business card (added to the site):** services list (mowing, trimming, mulching, weeding, tree removal, debris removal, spring/fall cleanups, snow plowing, gutters, grading/leveling, sod, top soil, stone install) and the deals band: 10% off military, free gutter cleaning with a seasonal contract, free mowing with trimming service, golfer's specials.

## Before launch — open items
- [ ] Confirm commercial work is something he wants to advertise (photos show roadside/commercial lots).
- [ ] Facebook lists "Delivery" as a specialty — mulch/stone delivery? Add if so.
- [ ] Confirm service area towns (Rochester + Greece confirmed; BBB address is 14625 — Penfield/Webster side?).
- [ ] Confirm the card deals are still running, and what the "Golfer's specials" are.
- [ ] Confirm the storefront photo is his pressure-washing work and the plow trucks are his.
- [ ] NOTIFY_EMAIL — preset to greenlifelawn22@gmail.com (from the Facebook page). Confirm, and set up SMTP sender (Gmail App Password).
- [ ] Set ADMIN_PASSWORD + SESSION_SECRET (login is password-only).
- [ ] Does he use Jobber or another scheduling tool? If so, the quote form could feed that instead.
- [ ] Domain: Jose bought it on Namecheap. He adds realeasy365@gmail.com via Share Access (Sharing & Transfer tab, DNS permissions). Kivvy needs a Namecheap account on that email to accept.
- [ ] Pricing: $500 setup + $20/mo hosting-only ($40 per change), or $49/mo with 4 changes/mo. Waiting on Jose's pick.
