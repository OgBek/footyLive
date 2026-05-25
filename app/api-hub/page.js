'use client';

import { useState } from 'react';
import { 
  Database, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowLeft, 
  Shield, 
  Zap, 
  Cpu, 
  Code, 
  Clock, 
  Layers, 
  Share2 
} from 'lucide-react';

export default function ApiHubPage() {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const origin = 'https://footylive.vercel.app';

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const localEndpoints = [
    {
      id: 'matches',
      name: 'Fetch Aggregated Matches',
      path: '/api/matches',
      method: 'GET',
      description: 'Retrieves all active and scheduled football matches aggregated from all scraping providers, sorted dynamically: active live matches first, followed by league priority and kickoff timestamps.',
      sampleResponse: `{
  "matches": [
    {
      "id": "4703546",
      "title": "Arsenal vs Chelsea",
      "status": "live",
      "timestamp": 1779321600000,
      "tournament": "Premier League",
      "homeTeam": { 
        "name": "Arsenal", 
        "badge": "/api/v1/team-logo/456" 
      },
      "awayTeam": { 
        "name": "Chelsea", 
        "badge": "/api/v1/team-logo/789" 
      },
      "leagueLogo": "/api/v1/league-logo/123",
      "homeScore": 2,
      "awayScore": 1,
      "currentMinute": "74'"
    }
  ]
}`
    },
    {
      id: 'match-details',
      name: 'Get Match Details',
      path: '/api/match/[matchId]',
      method: 'GET',
      description: 'Fetches granular match statistics, venue data, referee metrics, lineups, team formations, and real-time live commentary event streams for a given match ID.',
      sampleResponse: `{
  "id": "4703546",
  "title": "Arsenal vs Chelsea",
  "venue": "Emirates Stadium",
  "referee": "Michael Oliver",
  "status": "live",
  "homeScore": 2,
  "awayScore": 1,
  "boxscore": {
    "possession": { "home": "54%", "away": "46%" },
    "shots": { "home": 12, "away": 9 },
    "fouls": { "home": 8, "away": 11 }
  },
  "commentary": [
    {
      "minute": "74'",
      "type": "goal",
      "text": "GOAL! Arsenal 2, Chelsea 1. Bukayo Saka converts with a brilliant strike."
    }
  ]
}`
    },
    {
      id: 'resolve-streams',
      name: 'Resolve Match Streams',
      path: '/api/streams/[matchId]',
      method: 'GET',
      description: 'Retrieves the list of active streaming channels (embeds or direct HLS m3u8 playlists) resolving signed redirect routing proxies for security.',
      sampleResponse: `{
  "matchTitle": "Arsenal vs Chelsea",
  "matchStatus": "live",
  "streams": [
    {
      "name": "Server 1 HD (English)",
      "url": "/api/stream-redirect?u=aHR0cHM6Ly9zdHJlYW0ucGsvbGl2ZS8x&expires=1779325200000&sig=f1a2b3...",
      "quality": "HD",
      "isDirect": false
    }
  ],
  "defaultUrl": "/api/stream-redirect?u=aHR0cHM6Ly9zdHJlYW0ucGsvbGl2ZS8x&expires=1779325200000&sig=f1a2b3...",
  "isDirectHls": false
}`
    },
    {
      id: 'logo-proxies',
      name: 'Binary Logo Proxy Routes',
      path: '/api/v1/[type]/[id]',
      method: 'GET',
      description: 'Proxies binary image data for leagues, teams, and posters, resolving CORS limitations. Includes local 24-hour server-side caching. Valid types are: "league-logo", "team-logo", "poster".',
      sampleResponse: `[Binary Image Stream (image/png or image/jpeg)
Cache-Control: public, max-age=86400, s-maxage=86400]`
    }
  ];

  const upstreamApis = [
    {
      name: 'Streamed.pk API Docs',
      url: 'https://streamed.pk/docs/streams',
      badge: 'Upstream Feed',
      description: 'Public API documentation for Streamed.pk stream networks, which details endpoints for querying live stream playlists and direct streaming channels.',
    },
    {
      name: 'CDNLive TV Engine',
      url: 'https://cdnlivetv.ru/',
      badge: 'Live Channels',
      description: 'Comprehensive network for live sports broadcast streams, feeds, and streaming channel registries across multiple networks and regions.',
    },
    {
      name: 'WatchFooty API Hub',
      url: 'https://watchfooty.st/en/docs',
      badge: 'Core Matches',
      description: 'Developer integration documentation for watchfooty.st. Provides core match configurations, live score commentary, and league standings statistics.',
    }
  ];

  return (
    <div className="min-h-screen py-6 animate-fade-in text-zinc-950 dark:text-zinc-50">
      
      {/* Decorative Orbs */}
      <div className="glow-orb glow-orb-purple w-[300px] h-[300px] top-10 left-10"></div>
      <div className="glow-orb glow-orb-emerald w-[280px] h-[280px] top-60 right-10"></div>

      <div className="relative z-10 space-y-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4">
          <div>
            <a 
              href="/" 
              id="back-home-btn"
              className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 active:scale-95 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Fixtures</span>
            </a>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-indigo-650 to-emerald-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-emerald-400">
              API Developer Hub
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
              Welcome to the FootyLive developer dashboard. Here you can explore our system endpoints, copy code signatures, view data structures, and access upstream streaming metadata providers.
            </p>
          </div>
        </div>

        {/* Section 1: Developer Playbook / Instructions */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
            <Terminal className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-bold">Developer Playbook & Instructions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h3 className="font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-violet-500" />
                  1. HMAC Signed Redirect Routing
                </h3>
                <p>
                  To protect streaming servers from third-party hotlinking and scrape abuses, all resolved stream URLs are passed through a local proxy resolver: <code className="px-1 py-0.5 rounded bg-zinc-150 dark:bg-zinc-900 font-mono text-[10px] text-violet-600 dark:text-violet-400">/api/stream-redirect</code>.
                </p>
                <p>
                  This router enforces a cryptographic signature signature verification protocol. The stream URL is base64url encoded, appended with an expiration timestamp, and signed using an HMAC-SHA256 signature generated with the server's secret key (<code className="font-mono">STREAM_SECRET</code>). Requests with expired timestamps or incorrect signatures are instantly blocked (returns 403 Forbidden).
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-violet-500" />
                  2. Cache Revalidation Limits
                </h3>
                <p>
                  We employ an aggressive client/server caching layer to ensure lightning-fast page loading and protect upstream services:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Match Fixtures</strong>: Revalidates every 10 seconds to keep live scores, elapsed match minutes, and game statuses accurately synchronized.</li>
                  <li><strong>Server Streams</strong>: Revalidates every 15 seconds, ensuring link rotation is fast while preventing heavy concurrent query loads.</li>
                  <li><strong>Image Binaries</strong>: Team logos, tournament badges, and match posters are cached for 24 hours (86,400 seconds) on client browsers and local server instances.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <h3 className="font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-violet-500" />
                  3. Team Matching & Fuzzy Alignment
                </h3>
                <p>
                  Matches are aggregated from multiple scraping channels (WatchFooty, CDNLive, etc.) in real-time. Since names differ across networks (e.g., "Manchester United" vs "Man Utd"), the backend leverages a strategy pattern orchestrator:
                </p>
                <p>
                  The engine applies fuzzy Jaro-Winkler string similarity calculations (<code className="px-1 py-0.5 rounded bg-zinc-150 dark:bg-zinc-900 font-mono text-[10px] text-violet-600 dark:text-violet-400">lib/utils/matching.ts</code>). If the similarity score is greater than 0.85, the teams are aligned, and the duplicate match entries are collapsed, creating a single unified match console.
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-violet-500" />
                  4. Environment Configuration
                </h3>
                <p>
                  To configure or customize the API Hub backend, developers must declare the following environment variables in their root <code className="font-mono">.env.local</code>:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><code className="font-mono">STREAM_SECRET</code>: Encryption key string to sign client media playlists.</li>
                  <li><code className="font-mono">REDIS_URL</code> & <code className="font-mono">REDIS_TOKEN</code>: Optional Upstash credentials to replicate cache variables.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Local Application Endpoints */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Code className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-bold">Local Endpoint Directory</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {localEndpoints.map((endpoint, index) => {
              const fullUrl = `${origin}${endpoint.path}`;
              const isExpanded = expandedIndex === index;

              return (
                <div 
                  key={endpoint.id}
                  className="glass-panel rounded-xl p-5 md:p-6 space-y-4 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                        {endpoint.method}
                      </span>
                      <h3 className="font-bold text-sm text-zinc-850 dark:text-zinc-150">
                        {endpoint.name}
                      </h3>
                    </div>
                    <code className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                      {endpoint.path}
                    </code>
                  </div>

                  <p className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">
                    {endpoint.description}
                  </p>

                  {/* Copy URL Row */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-100/50 dark:bg-zinc-950/80 border border-zinc-200/50 dark:border-zinc-900/60">
                    <span className="text-[10px] font-mono text-zinc-400 select-none">URL:</span>
                    <input 
                      type="text" 
                      readOnly 
                      value={fullUrl} 
                      className="flex-1 bg-transparent outline-none font-mono text-[10px] text-zinc-700 dark:text-zinc-300 overflow-x-auto" 
                    />
                    <button
                      onClick={() => copyToClipboard(fullUrl, index)}
                      className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 active:scale-90 transition-all"
                      title="Copy absolute URL"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Response Payload Block */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center gap-1 transition-colors"
                    >
                      <span>{isExpanded ? 'Hide' : 'Show'} Sample Response Payload</span>
                      <ChevronToggle isExpanded={isExpanded} />
                    </button>

                    {isExpanded && (
                      <div className="relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800/80">
                        <div className="absolute right-2 top-2 z-20">
                          <button
                            onClick={() => copyToClipboard(endpoint.sampleResponse, `payload-${index}`)}
                            className="p-1.5 rounded bg-zinc-200/40 hover:bg-zinc-200/80 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/80 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                            title="Copy payload"
                          >
                            {copiedIndex === `payload-${index}` ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <pre className="p-4 bg-zinc-950 text-zinc-200 font-mono text-[10px] overflow-x-auto max-h-[250px] leading-relaxed">
                          {endpoint.sampleResponse}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: More APIs - Upstream External Links */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Share2 className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-bold">Third-Party Upstream Stream APIs</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upstreamApis.map((api, idx) => (
              <a 
                key={api.name}
                href={api.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel glass-panel-hover rounded-xl p-5 block space-y-3 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {api.badge}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-violet-500 transition-colors" />
                </div>
                
                <h3 className="font-bold text-sm text-zinc-850 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {api.name}
                </h3>
                
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {api.description}
                </p>
                
                <div className="text-[10px] font-mono text-violet-600 dark:text-violet-400 group-hover:underline flex items-center gap-1">
                  <span>Visit Documentation</span>
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function ChevronToggle({ isExpanded }) {
  return (
    <svg 
      className={`h-3 w-3 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ArrowUpRight({ className }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
