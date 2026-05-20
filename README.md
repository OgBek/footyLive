# ⚽ FootyLive — Premium Live Sports Streaming Aggregator

FootyLive is a high-performance, ad-free live football streaming aggregator built on Next.js 14. It aggregates live scoreboard metrics, team logistics, and dynamic multi-server stream networks into a premium, glassmorphic client interface. 

Designed for low latency and high quality, FootyLive resolves streaming server links on the fly, provides direct `.m3u8` video player fallbacks with client-side HLS rendering, integrates ad-blocker sandboxes, and implements a dashboard to stream multiple matches simultaneously.

---

## 🌟 Key Features

* 📺 **Interactive Stream Player**: Auto-detects direct stream formats (HLS/m3u8/mp4) and uses `hls.js` for native low-latency playback, alongside regular streaming iframe nodes equipped with togglable **sandbox shields** to block intrusive pop-ups and ads.
* ⚡ **Multistream Arena**: Stream up to 4 matches at the same time in a responsive drag-to-resize viewport grid with isolated volume controls and reload capabilities.
* 📅 **Match Lifecycle Management**: Split layout for **Live Now** (auto-refreshing score lists) and **Upcoming** fixtures (with real-time kickoff countdowns).
* 🔍 **Smart Tournament Filters**: A horizontal, swipeable tournament shelf with team logos, custom click-to-scroll navigation chevrons, and dynamic league-hiding (only showing leagues that have active matches in the current tab).
* ⭐ **Favorite Teams Tracking**: Star your favorite teams to pin their fixtures at the top of your dashboard automatically.
* 🌓 **Premium Dark Mode**: Seamless theme switching using custom glassmorphic elements, rich visual glows, and harmonized color systems (no plain primaries).

---

## 🏗️ Architecture Design & Directory Structure

FootyLive is organized around Next.js App Router patterns, utilizing server-rendered layouts, dynamic client components, and lightweight local caching layers.
<<<<<<< HEAD

```
football-stream-app/
├── app/                      # Next.js App Router
│   ├── api/                  # API endpoints for match data and stream redirection
│   │   ├── match/[matchId]   # Live scoreboard endpoints
│   │   ├── matches           # Master fixtures aggregator
│   │   └── streams/[matchId] # Server-side link decoders & quality parameters (HD/SD)
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
│   └── utils/                # Helper files (favorites tracker, timestamp formats)
├── public/                   # Static icons and logos
├── tailwind.config.js        # Color palette variables
└── app/globals.css           # Custom scrollbars, glassmorphism templates, animations
```
=======
football-stream-app/ ├── app/ # Next.js App Router │ ├── api/ # API endpoints for match data and stream redirection │ │ ├── match/[matchId] # Live scoreboard endpoints │ │ ├── matches # Master fixtures aggregator │ │ └── streams/[matchId] # Server-side link decoders & quality parameters (HD/SD) │ ├── watch/[matchId]/ # Individual match details and live player view │ ├── multistream/ # Multistream arena grid layout │ ├── layout.js # Sticky header, footer, global centered main layout │ └── page.js # Homepage loading aggregated matches ├── components/ # Reusable React components │ ├── StreamPlayer.jsx # Video controller, sandbox toggle, and HLS injector │ ├── LiveScoreboard.jsx # Real-time score ticker with live-minute calculation │ ├── MatchGrid.jsx # Fixture listings, multi-select search filters, scroll chevrons │ ├── MatchCard.jsx # Card template with quality badges (HD/SD) and star toggle │ └── ThemeToggle.jsx # Global Dark/Light mode theme switch ├── lib/ # Utilities & Core Logic │ ├── config.js # Global configuration parameters │ └── utils/ # Helper files (favorites tracker, timestamp formats) ├── public/ # Static icons and logos ├── tailwind.config.js # Color palette variables └── app/globals.css # Custom scrollbars, glassmorphism templates, animations
>>>>>>> e29306615305e120c5a48352a0190fa645d2490c

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
<<<<<<< HEAD
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
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
npm run start
```

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
=======

2. Configure Environment Variables
Create a .env.local file in the root directory:

env


# Optional Redis caching (Upstash) - defaults to in-memory caching if omitted
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

3. Running in Development Mode
Start the development server with hot reloading:

bash


npm run dev
Open http://localhost:3000 in your web browser.

4. Build and Production Run
Compile optimized client bundles and start the production server:

bash


npm run build
npm run start
🤝 Open Source Community Guidelines
We welcome contributions from developers, football enthusiasts, and UI/UX designers! Help us make FootyLive the best web sports hub.

How to Contribute
Fork the repository and create your feature branch: git checkout -b feature/amazing-feature.
Commit your changes following clean git conventions: git commit -m 'Add support for custom video players'.
Push to the branch: git push origin feature/amazing-feature.
Open a Pull Request explaining your changes.
Coding Standards
Aesthetic Focus: Maintain premium UI glassmorphism and HSL-based palettes. Avoid standard generic colors.
Responsive Design: Ensure every component works seamlessly on mobile screens, tablets, and ultrawide desktops.
Sandbox Integrity: Always test media players to ensure third-party ads and redirection triggers remain isolated.

⚖️ License & Disclaimer
FootyLive is an open-source stream aggregator. It parses public third-party link networks for research and educational purposes. FootyLive does not host, upload, or own any media streams, video channels, or sports network content.

>>>>>>> e29306615305e120c5a48352a0190fa645d2490c
