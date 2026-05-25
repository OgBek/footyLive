# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Existing guidance sources
- No pre-existing `AGENTS.md`, `WARP.md`, `CLAUDE.md`, Cursor rules, or Copilot instructions were found.
- Primary project guidance source is `README.md`.

## Setup and environment
- Node.js requirement from README: `>=18.17.0`.
- Install dependencies:
  - `npm install`
- Local env file expected:
  - `.env.local`
  - Required/important keys:
    - `STREAM_SECRET` (used to sign `/api/stream-redirect` URLs)
    - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (optional; without them, cache falls back to in-memory)
    - `NEXT_PUBLIC_API_BASE` (optional, defaults to `https://api.watchfooty.st`)

## Common commands
- Development server:
  - `npm run dev`
- Production build:
  - `npm run build`
- Production start:
  - `npm run start`
- Lint:
  - `npm run lint`
- Test suite:
  - `npm run test`

### Running a single test
- Run one test file:
  - `npx vitest run lib/utils/matching.test.ts`
  - (or via script passthrough) `npm run test -- lib/utils/matching.test.ts`
- Run tests matching a test name:
  - `npx vitest run -t "Teams Matching Algorithm"`
  - (or) `npm run test -- -t "Teams Matching Algorithm"`

## Architecture: big picture

### 1) Core runtime model (Next.js App Router)
- UI routes live under `app/`:
  - `app/page.js`: home fixture grid; merges `getMatches()` + `getLiveMatches()` and sorts/filters before rendering.
  - `app/watch/[matchId]/page.js`: match detail + player page; fetches match details/stats and resolves stream servers.
  - `app/multistream/page.js`: fully client-side 4-slot multi-view experience, each slot resolving `/api/streams/[matchId]`.
- API routes under `app/api/*` provide all data used by client/server components.

### 2) Stream/data orchestration is centralized in `lib/streamEngine.ts`
- `getMatches()` returns cached aggregated match listings (currently sourced from `WatchFootyProvider` for top-level listings).
- `resolveAllStreams(...)` is the core stream resolver:
  - Calls all providers in parallel (`watchfooty`, `cdnlive`, `streamed`) to gather channels.
  - Flattens, quality-sorts, de-duplicates by URL, and assigns normalized server names.
  - Produces both raw URL and signed proxy URL (`proxiedUrl`) via `getStreamRedirectUrl`.
- `getStreamRedirectUrl` signs redirects with HMAC SHA-256 using `STREAM_SECRET`.

### 3) Provider strategy and match/channel normalization
- Provider interface: `lib/providers/types.ts` (`fetchMatches`, `resolveStreams`).
- Implementations:
  - `watchFooty.ts`: primary source for match list + details/stats; normalizes raw API payloads into internal `Match` shape.
  - `cdnLive.ts` and `streamedPk.ts`: mainly fallback channel resolvers matched by fuzzy team-title logic.
- Matching logic in `lib/utils/matching.ts` is important for cross-provider reconciliation:
  - team name normalization, similarity scoring, and league/country heuristics.
  - Existing tests cover this logic in `lib/utils/matching.test.ts`.

### 4) Caching strategy (critical for performance and provider stability)
- `lib/cache/cacheManager.ts` exposes a SWR-style cache abstraction.
- Runtime selection:
  - Redis cache when Upstash creds are present.
  - In-memory fallback otherwise.
- Typical TTLs in current code:
  - match lists: ~15s
  - stream resolution: ~30s
  - logo/poster proxy routes: 24h

### 5) API surface and responsibilities
- `GET /api/matches`: sorted fixture list for home + multistream selector.
- `GET /api/match/[matchId]`: live scoreboard/stat payload for polling UI components.
- `GET /api/streams/[matchId]`: resolved channel list + default proxied URL.
- `GET /api/stream-redirect`: validates signature and expiry, then 302 redirects to upstream URL.
- `GET /api/v1/{league-logo|team-logo|poster}/[id]`: image proxy endpoints with 24h caching headers.

### 6) Player behavior split: direct media vs iframe streams
- `components/StreamPlayer.jsx` and `app/multistream/page.js` both:
  - detect direct stream formats (`.m3u8`, `.mpd`, `.mp4`, `/hls/`) and use `hls.js` + `<video>` path;
  - otherwise render provider URLs in iframes.
- Sandboxed iframe mode (`sandboxShield`) is a key compatibility/security toggle when dealing with third-party embeds.

### 7) UI update pattern
- App uses frequent polling/refresh for live context:
  - home grid refreshes periodically (`router.refresh()`),
  - scoreboard and match cards poll `/api/match/[matchId]`,
  - multistream page polls `/api/matches`.
- Revalidation is also set on relevant routes (`revalidate` exports), so both Next cache and client polling contribute to freshness.

## Practical implementation notes for future agents
- If changing stream URL behavior, update both:
  - server-side signing/redirect flow (`lib/streamEngine.ts`, `app/api/stream-redirect/route.ts`), and
  - client consumers that assume `proxiedUrl` exists (`StreamPlayer`, multistream slot logic).
- If adding/changing provider matching behavior, run `lib/utils/matching.test.ts` to validate fuzzy matching regressions.
- If modifying cache keys/TTLs, verify behavior in both Redis and in-memory modes (`getCacheManager()` fallback path).