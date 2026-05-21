# ⚽ FootyLive — Premium Live Sports Streaming Aggregator

FootyLive is a high-performance, ad-free live football streaming aggregator built on Next.js 14. It aggregates live scoreboard metrics, team logistics, and dynamic multi-server stream networks into a premium, glassmorphic client interface. 

Designed for low latency and high quality, FootyLive resolves streaming server links on the fly, provides direct `.m3u8` video player fallbacks with client-side HLS rendering, integrates ad-blocker sandboxes, and implements a dashboard to stream multiple matches simultaneously.
<img width="1920" height="976" alt="Screenshot 2026-05-21 103906" src="https://github.com/user-attachments/assets/d304e7f0-2c1e-4520-8935-f281a5183ccf" />
<img width="1920" height="985" alt="Screenshot 2026-05-21 095834" src="https://github.com/user-attachments/assets/9b15e3d3-f79e-46d5-aca9-57d31b84df9a" />
<img width="1920" height="982" alt="Screenshot 2026-05-21 095746" src="https://github.com/user-attachments/assets/83a27d6e-6a56-4116-be1f-dcee389cd451" />
<img width="1920" height="947" alt="Screenshot 2026-05-21 095627" src="https://github.com/user-attachments/assets/22e7b003-d569-4945-9035-8f8addaf0987" />
<img width="1920" height="979" alt="Screenshot 2026-05-21 095323" src="https://github.com/user-attachments/assets/b8af197b-bfb9-4e5b-b410-8b60592e1eac" />
<img width="1920" height="1080" alt="Screenshot 2026-05-21 104637" src="https://github.com/user-attachments/assets/b645c61c-34a5-4465-8a2a-ca759cfc4ed0" />
<img width="1920" height="977" alt="Screenshot 2026-05-21 104530" src="https://github.com/user-attachments/assets/a8189e37-cb7e-4471-a00b-22d0b20fb198" />

---

live demo https://footylive.vercel.app/

## 🌟 Key Features

* 📺 **Interactive Stream Player**: Auto-detects direct stream formats (HLS/m3u8/mp4) and uses `hls.js` for native low-latency playback, alongside regular streaming iframe nodes equipped with togglable **sandbox shields** to block intrusive pop-ups and ads.
* ⚡ **Multistream Arena**: Stream up to 4 matches at the same time in a responsive drag-to-resize viewport grid with isolated volume controls and reload capabilities.
* 🕒 **Fast Live Kickoff Promotion**: Dynamic client-side match state elevation that promotes upcoming games to "Live Now" at their exact kickoff time, simulating realistic game timers, starting real-time score polling, and automatically swapping countdown panels with dynamic stream player modules without requiring a page reload.
* 📅 **Match Lifecycle Management**: Split layout for **Live Now** (auto-refreshing score lists) and **Upcoming** fixtures (with real-time kickoff countdowns).
* 🔍 **Smart Tournament Filters**: A horizontal, swipeable tournament shelf with team logos, custom click-to-scroll navigation chevrons, and dynamic league-hiding (only showing leagues that have active matches in the current tab).
* 🛠️ **Developer API Hub**: A dedicated visual developer playground (`/api-hub`) documenting local REST endpoints, proxy cache architectures, Jaro-Winkler similarity matching systems, HMAC link signing modules, and third-party upstream API databases (Streamed.pk, CDNLive, WatchFooty).
* ⭐ **Favorite Teams Tracking**: Star your favorite teams to pin their fixtures at the top of your dashboard automatically.
* 🌓 **Premium Dark Mode**: Seamless theme switching using custom glassmorphic elements, rich visual glows, and harmonized color systems (no plain primaries).

---

## 🏗️ Architecture Design & Directory Structure

FootyLive is organized around Next.js App Router patterns, utilizing server-rendered layouts, dynamic client components, and lightweight local caching layers.

```
football-stream-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API endpoints for match data and stream redirection
│   │   ├── match/[matchId]   # Live scoreboard endpoints
│   │   ├── matches           # Master fixtures aggregator
│   │   ├── streams/[matchId] # Server-side link decoders & quality parameters (HD/SD)
│   │   ├── stream-redirect   # Cryptographically signed HMAC proxy validator
│   │   └── v1/               # High-speed cached binary image proxy endpoints
│   │       ├── league-logo   # 24h cached tournament logo proxy
│   │       ├── team-logo     # 24h cached club badge proxy
│   │       └── poster        # 24h cached match poster proxy
│   ├── api-hub/              # Developer hub page documenting REST and upstream APIs
│   ├── watch/[matchId]/      # Individual match details and live player view
│   ├── multistream/          # Multistream arena grid layout
│   ├── layout.js             # Sticky header, footer, global centered main layout
│   └── page.js               # Homepage loading aggregated matches
├── components/               # Reusable React components
│   ├── StreamPlayer.jsx      # Video controller, sandbox toggle, and HLS injector
│   ├── LiveScoreboard.jsx    # Real-time score ticker with live-minute calculation
│   ├── MatchGrid.jsx         # Fixture listings, multi-select search filters, scroll chevrons
│   ├── MatchCard.jsx         # Card template with quality badges (HD/SD) and star toggle
│   └── ThemeToggle.jsx       # Global Dark/Light mode theme switch
├── lib/                      # Utilities & Core Logic
│   ├── config.js             # Global configuration parameters
│   ├── streamEngine.ts       # Registry aggregator & stream resolver orchestrator
│   ├── cache/                # Cache manager supporting in-memory SWR & Upstash Redis
│   ├── providers/            # Strategic Scraping strategies (WatchFooty, CdnLive, StreamedPk)
│   └── utils/                # Helper files (favorites tracker, Jaro-Winkler team matching)
├── public/                   # Static icons, manifest, offline fallbacks
├── tailwind.config.js        # Color palette variables
└── app/globals.css           # Custom scrollbars, glassmorphism templates, animations
```

---

## 🚀 How to Run Locally

### Prerequisites
* **Node.js** v18.17.0 or higher
* **npm** or **yarn**

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/your-username/football-stream-app.git
cd football-stream-app
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Cryptographic Stream Key (Signs and validates player streams via HMAC)
STREAM_SECRET="default_stream_hmac_secret_key_123_abc"

# Optional Redis caching (Upstash) - defaults to in-memory caching if omitted
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

### 3. Running in Development Mode
Start the development server with hot reloading:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build and Production Run
Compile optimized client bundles and start the production server:
```bash
npm run build
```
Once built, run:
```bash
npm run start
```

---

## 🛠️ Developer REST API Directory

FootyLive is equipped with public REST API endpoints designed to help external developers integrate fixtures and streams into custom sports apps:

* **Aggregated Fixtures Directory**: `GET /api/matches`
  * Retrieves all currently scheduled and live fixtures across sports scraper provider strategic networks.
* **Match Boxscore Details**: `GET /api/match/[matchId]`
  * Fetches real-time lineups, live scores, match commentary timelines, and team boxscore stats.
* **Aggregated Stream Channels**: `GET /api/streams/[matchId]`
  * Decodes, consolidates, and ranks dynamic HLS streams and iframe servers according to broadcast qualities.
* **Cached Binary Asset Proxies**: `/api/v1/[league-logo|team-logo|poster]/[id]`
  * Fully resolves, aggregates, and proxy caches images locally with a 24-hour TTL, preventing CORS locks on custom dashboards.

---

## 🤝 Open Source Community Guidelines

We welcome contributions from developers, football enthusiasts, and UI/UX designers! Help us make FootyLive the best web sports hub.

### How to Contribute
1. **Fork** the repository and create your feature branch: `git checkout -b feature/amazing-feature`.
2. Commit your changes following clean git conventions: `git commit -m 'Add support for custom video players'`.
3. Push to the branch: `git push origin feature/amazing-feature`.
4. Open a **Pull Request** explaining your changes.

### Coding Standards
* **Aesthetic Focus**: Maintain premium UI glassmorphism and HSL-based palettes. Avoid standard generic colors.
* **Responsive Design**: Ensure every component works seamlessly on mobile screens, tablets, and ultrawide desktops.
* **Sandbox Integrity**: Always test media players to ensure third-party ads and redirection triggers remain isolated.

---

## ⚖️ License & Disclaimer

FootyLive is an open-source stream aggregator. It parses public third-party link networks for research and educational purposes. FootyLive does not host, upload, or own any media streams, video channels, or sports network content.
