# StarWall by AGRON

Scaffold for the StarWall marketing and product site — a maritime security intelligence product.

**Names.** StarWall is the security system and the platform. **AGRON 1** is the official name of the program — this version of the watch software and the code behind it. Later major versions will be AGRON 2, and so on. AGRON Inc. is the company. AGRON Container is the hardware box. Pilot is the watch advisor. The old working name “AGRON Bridge” is retired.

## Stack

- Next.js 14, TypeScript, App Router, `src/`
- Tailwind CSS with the StarWall design tokens
- Google fonts via `next/font`: Cormorant Garamond (`font-heading`), Inter (`font-body`), Space Grotesk (`font-ui`), JetBrains Mono (`font-mono`)

## Run locally

```bash
npm install
npm run dev
```

Dev server: `http://127.0.0.1:3000`

Local production server (stays up; starts Postgres and Next if they are down):

```bash
npm run ensure
```

Then open `http://127.0.0.1:3000` (and `http://127.0.0.1:43180` for the preview port).

To keep it running in the foreground and restart anything that dies:

```bash
npm run up
```

Cloud Agent environments run `scripts/ensure-site.sh` on every boot (`start` in `.cursor/environment.json`) and keep `npm run up` in a terminal. On this machine a cron job also checks once a minute and brings the site back if it is down.

The supervisor writes the current public URL to `/tmp/starwall-public-url.txt`. Quick-tunnel hostnames change when cloudflared restarts.

Pilot (the watch advisor) sits in AGRON 1 as a single watch display. Open Pilot on `/interface` and switch Talk / Instruments / Advice / Comms with labeled tabs. The D next to Pilot runs a spoken DEMO drill in the language selected on Pilot. DEMO follows the current scenario, sensors, and recommended action. LIVE stays honest: no invented contacts, and comms stay offline until a real satcom path exists. While Pilot is speaking, a HUD talk window opens (chat on the left, studio waveform on the right). AGRON 1 panels use rounded cards and Inter for readable labels. The jump rail shows an icon with its name underneath — no hex frames. The meter is a real green/red VU from the audio itself — not a simulated bounce. Speak, type, or tap a watch call and Pilot stops at once and takes your words first. **Clear** and labeled fullscreen sit in the sticky header on `/interface`. Light and dark theme tokens apply to Pilot, talk HUD, jump nav, library, and watch circuits.

Pilot speaks with a real adult male neural voice in every site language: English Andrew, Spanish Álvaro, French Henri, German Conrad, Russian Dmitry, Ukrainian Ostap, Arabic Hamed, Chinese Yunxi, Japanese Keita, Hebrew Avri. Replies go through `POST /api/tts` and play as MP3. The default path is Microsoft Edge online Neural speech (no API key). Set `AZURE_SPEECH_KEY` + `AZURE_SPEECH_REGION` for Azure, `OPENAI_API_KEY` (male voice `onyx`) or `ELEVENLABS_API_KEY` if you have those accounts — they take priority when present. If neural speech is down, Pilot falls back to a male browser voice when one is installed, then types. Listening uses Web Speech Recognition in Chrome or Edge after the microphone is allowed. Copy `.env.local.example` to `.env.local` and set `ANTHROPIC_API_KEY` for richer spoken answers. `.env*.local` is gitignored. Without the key Pilot still answers from the on-site briefing — it does not invent prices.

`NEXT_PUBLIC_SITE_URL` is used for canonical metadata, Open Graph, `robots.txt`, and `sitemap.xml`. Locally it defaults to `http://127.0.0.1:3000`. On Vercel it falls back to `https://$VERCEL_URL` if you leave it blank.

## PDF overview

The homepage “Download overview (PDF)” button uses the one-page leaflet in `public/overview-leaflet.jpg` as a thumbnail and serves `public/starwall-overview.pdf`.

The Technology page embeds the briefing deck `public/starwall-intelligence-platform.pdf`.

AGRON 1 walkthrough stills go in `public/bridge/`:

- `public/bridge/radar-normal.png`
- `public/bridge/risk-elevated.png`
- `public/bridge/recommended-action.png`
- `public/bridge/event-log-new.png`

## Routes

Shared sticky header and footer wrap every route via the root layout. The header keeps the main product pages. Levels, FAQ, and AGRON Container live in the footer.

| Path | Heading |
|---|---|
| `/` | StarWall — Overview |
| `/how-it-works` | How it works |
| `/interface` | Interface (public AGRON 1 demo — no sign-in) |
| `/interface/connections` | System Connections Map |
| `/levels` | Levels |
| `/pricing` | Plans — four levels, comparison, how pricing is built, request form |
| `/technology` | Technology (briefing deck + equipment catalog) |
| `/faq` | FAQ |
| `/containers` | AGRON Containers |
| `/containers/detection` | Detection Suite |
| `/containers/countermeasures` | Countermeasures |
| `/containers/tiers` | Container Tiers |
| `/containers/specs` | Specifications |
| `/containers/deployment` | Deployment |
| `/about` | Why StarWall — who builds it |
| `/contact` | Contact |
| `/login` | Sign in (email/password or Google) |
| `/signup` | Create an account |
| `/forgot-password` | Password reset request |
| `/tasks` | All tasks (gated; sign in first) |
| `/pricing/desk` | Closed Plans desk — Price Book and quotes (Super Admin, Admin, or assigned commercial role) |
| `/backend` | StarWall Backend (gated) |
| `/backend/users` | User Management (Super Admin) |
| `/backend/privacy` | Data & Privacy (gated) |
| `/privacy` | Privacy Policy (public) |
| `/terms` | Terms of Service (public) |

## Brand, theme, and language

The site logo is the chrome hex StarWall badge. Pages load `public/starwall-logo.webp` (about 50 KB; AVIF sibling is smaller). `public/SW3.png` is the PNG used in proposal PDFs. Favicon and Apple touch icons are separate small files; social previews use `public/og-starwall.jpg`. Rebuild optimized assets with `node scripts/optimize-logo.mjs <source.png>`. Do not recreate the wordmark.

Header and footer include a sun/moon theme switch (light/dark, stored in the browser) and a ten-language menu: English, Spanish, French, German, Russian, Ukrainian, Arabic, Chinese, Japanese, Hebrew. The choice is stored in `localStorage` (`starwall-locale`) and survives navigation. Arabic and Hebrew set `dir="rtl"`; Arabic also loads Noto Sans Arabic for body and headings.

Pilot, the watch advisor, sits as a living icon at the bottom-right of every page. Speech/type languages fold into a dropdown inside the panel.

`/interface`, `/backend`, and `/tasks` carry a DEMO / LIVE mode switch (`localStorage` key `starwall-mode`, default DEMO). DEMO is the full illustrative simulation. LIVE is an honest empty deployment: no fake contacts, events, or equipment status. Pilot stays available in both modes.

## Authentication

Sign-in is NextAuth.js (Auth.js) at `/api/auth/[...nextauth]`:

- **Credentials** — email + password, stored in Prisma (`User.role`, `passwordHash`, `lastSignInAt`). New sign-ups default to **Operator**.
- Demonstration sign-in: `demo` / `demo` (Super Admin). Role and commercial accounts share that same password and are not printed on `/login`.
- **Google** — “Continue with Google”. This needs a real OAuth client that only you can create.

Create a Google Cloud OAuth app: **Google Cloud Console → APIs & Services → Credentials → Create credentials → OAuth client ID** (Web application). Add authorized redirect URI `https://YOUR_DOMAIN/api/auth/callback/google` (and `http://127.0.0.1:3000/api/auth/callback/google` for local). Copy the client ID and secret into `.env.local`. These values cannot be generated here.

Environment placeholders (see `.env.local.example`):

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DATABASE_URL=
```

Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`. After a successful sign-in the site opens `/interface` and the header shows an initial avatar with **Sign out**.

`/signup` creates a credentials account when Postgres is attached. `/forgot-password` is honest: this idea demo does not send reset mail. Use `demo` / `demo`.

`/backend` and `/tasks` still require a signed-in session.

Translated now: marketing chrome (nav, footer), all public pages, the AGRON 1 HUD (jump rail, library, crisis protocol, Pilot chrome, connections map labels), the LIVE banner, `/backend`, and `/tasks`. The watch picture itself stays `dir="ltr"` so Arabic and Hebrew do not mirror radar and instruments. Arabic and Hebrew also load Noto Sans for body and headings.

Still English: instrument skins on the radar/sonar/spectrum drawings (HF SONAR, CORE, range rings), product names (StarWall, AGRON 1, Support Center, Pilot, tier codes LIGHT / ADVANCED / INTELLIGENCE / CUSTOM), and Pilot replies (those follow the spoken/typed language when an API key is set). Sign-in, sign-up, and forgot-password now follow the site language. The demonstration sign-in stays `demo` / `demo`.

## Deploy on Vercel

This is a standard Next.js 14 App Router app. Do **not** set `output: "standalone"`. Connect the GitHub repo, leave the Framework Preset as Next.js, and deploy. The first production URL (including `*.vercel.app`) should load without extra env vars:

- Marketing pages work immediately.
- `/login` accepts `demo` / `demo` even before Postgres is attached. Sessions are JWTs.
- `/interface` is a public AGRON 1 demo. It does not require a session, so a missing `NEXTAUTH_SECRET` never renders NextAuth’s “Server error” page. `NEXTAUTH_URL` is taken from the request host; a leftover `http://127.0.0.1:3000` value is ignored on Vercel.
- Google sign-in stays hidden until both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.
- `ANTHROPIC_API_KEY` — richer Pilot answers. Without it Pilot still replies from the product briefing.
- Male neural speech for Pilot needs no key (Edge online voices). Optional: `AZURE_SPEECH_KEY` + `AZURE_SPEECH_REGION`, `OPENAI_API_KEY` (voice `onyx`), or `ELEVENLABS_API_KEY`.

Optional, after the first green deploy:

- `DATABASE_URL` — Neon / Vercel Postgres (add `?sslmode=require` if it is missing). The build runs `prisma migrate deploy` only for a hosted URL, using a direct (non-pooler) connection. Seed accounts are written on first backend request.
- `NEXT_PUBLIC_SITE_URL` / `NEXTAUTH_URL` — custom production origin, if it is not the `*.vercel.app` host.
- `NEXTAUTH_SECRET` — `openssl rand -base64 32`. This idea demo falls back to a labeled local secret if the variable is empty so sessions still verify. Do not reuse that fallback on a real install.

`vercel.json` pins the framework, `npm run build`, and region `iad1`. Prisma generates an Amazon Linux (`rhel-openssl-3.0.x`) engine so serverless functions can query Postgres.

## Postgres on Vercel (required)

SQLite (`file:./dev.db`) is not used. Serverless hosts cannot keep a local file, so accounts, audit rows, and cloud copies of AGRON 1 records need a hosted Postgres database.

**Use Neon via Vercel Storage.** That is the recommended production database for this project (Vercel’s current Postgres offering is Neon). A self-hosted Postgres or a generic “bring your own server” setup is more work than this site needs. Supabase works if you already have a project there, but Neon is the shorter path on Vercel.

Do this in the Vercel dashboard (you have to click these — the agent cannot provision the database for you):

1. Open the StarWall project in [Vercel](https://vercel.com).
2. Go to **Storage → Create Database → Postgres** (Neon). Create it in the same region as the app (`iad1` if you keep the default).
3. Open the new database → **.env** or **Connect**. Copy the connection string into `DATABASE_URL` (the direct URI is safer for `prisma migrate deploy`; pooled also works at runtime).
4. If the URI is missing `sslmode=require`, append `?sslmode=require` (or `&sslmode=require` if the query string already exists).
5. Go to **Settings → Environment Variables** and set `DATABASE_URL` for **Production** and **Preview**.
6. Redeploy. When `DATABASE_URL` is a hosted Postgres URL, the build runs `npx prisma migrate deploy` and creates `User`, `Session`, `Event`, `Conversation`, `BlackBoxRecord`, `Equipment`, `NotificationRoute`, `AuditLog`, and `Integration`.
7. After the first successful deploy, sign in with a demo account from `/login` or create one on `/signup`. Seed accounts are created on first backend request when the database is empty.

Local development:

```bash
# Example local server (user/password/db all "starwall")
# DATABASE_URL in .env.local:
# postgresql://starwall:starwall@127.0.0.1:5432/starwall

npx prisma generate
npx prisma migrate deploy
npm run dev
```

## Persistent storage

Two layers, local first:

- **IndexedDB** (via `idb`) in the browser — `events`, `conversations`, `sessionReports`, plus a local Black Box index. A refresh during a DEMO session restores the Event Log, Pilot history, and Black Box list. Switching to **LIVE** wipes those four stores so DEMO records cannot come back. The signed-in NextAuth session is left alone. Switching back to DEMO starts a fresh idle watch (seed Event Log lines only — not the previous scenario history) and an empty Black Box.
- **Prisma / Postgres** — accounts, RBAC, equipment checks, notification routes, integrations, the audit log, and the optional cloud copy of AGRON 1 records. A AGRON 1 record is written locally first (`Local`), then the badge becomes `Local + Cloud` only after `/api/blackbox` confirms the write.

Schema: `prisma/schema.prisma` (`User`, `Session`, `Event`, `Conversation`, `BlackBoxRecord`, `Equipment`, `NotificationRoute`, `AuditLog`, `Integration`).

```bash
npx prisma generate
npx prisma migrate deploy
```

`/backend` is a working pre-pilot admin: Super Admin only on `/backend/users`; Admin and above can run diagnostics and save notification routing; Operators can view and use the AGRON 1; Viewers see reports and the Black Box only. Equipment is checked every 30 seconds while `/backend` is open (simulated heartbeat until hardware is connected). DEMO/LIVE switches, role changes, diagnostics, and notify saves write real audit rows.

Production checks locally before a deploy:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start
```

`/pricing` is a public product page: LIGHT, ADVANCED, INTELLIGENCE, and CUSTOM, a comparison matrix, environments, optional hardware, and how a configuration is priced. There are no dollar figures. The request form posts to `/api/contact`. Plan CTAs can still open `/contact?plan=ADVANCED` from older links.

`/pricing` is the public Plans page and never shows dollar figures. After sign-in, Super Admin, Admin, and people with an assigned commercial role (`admin`, `sales`, `engineering`) open the commercial desk from **Plans** at `/pricing/desk`: a pipeline board, catalog shelf, quote tickets, and a branded PDF proposal (`/api/admin/starwall/pricing/quotes/[id]/pdf`) on AGRON Inc. letterhead with the StarWall mark. Older `/admin/starwall/pricing` URLs redirect there. Seeded desk accounts: `sales@starwall.demo` and `engineering@starwall.demo`. License list prices are seeded (LIGHT $6,000, ADVANCED $18,000, INTELLIGENCE $42,000, CUSTOM starting $75,000). Every other catalog row is PRICE REQUIRED until AGRON enters real costs. Public APIs never return this book. The customer PDF never includes cost or margin.

`/api/contact` acknowledges briefing requests and returns `delivered: false`. This idea demo has no inbox. `/backend` writes through `/api/equipment`, `/api/notifications`, `/api/audit`, `/api/integrations`, and `/api/users`. Unauthorized writes return 403.
