import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';
import { Database } from 'lucide-react';

export const metadata = {
  title: 'FootyLive — Live Football Streams',
  description: 'Watch live football matches free on FootyLive. Real-time scores and premium ad-free streams.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#8b5cf6" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('theme');
                if (saved === 'light' || (!saved && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('SW registered:', reg.scope);
                  }).catch(function(err) {
                    console.log('SW reg failed:', err);
                  });
                });
              }
            `
          }}
        />
      </head>
      <body className="antialiased min-h-screen relative bg-zinc-50 text-zinc-900 dark:bg-[#040405] dark:text-zinc-100 flex flex-col transition-colors duration-300">
        {/* Glow Effects */}
        <div className="glow-orb glow-orb-purple w-[600px] h-[600px] -top-[200px] -left-[150px] opacity-5 dark:opacity-15 transition-opacity duration-300" />
        <div className="glow-orb glow-orb-emerald w-[500px] h-[500px] top-[40%] -right-[150px] opacity-5 dark:opacity-15 transition-opacity duration-300" />
        <div className="glow-orb glow-orb-purple w-[600px] h-[600px] -bottom-[200px] left-[10%] opacity-5 dark:opacity-15 transition-opacity duration-300" />

        {/* Sticky Glassmorphic Header */}
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/70 dark:border-zinc-900/60 dark:bg-[#050508]/60 backdrop-blur-md transition-colors duration-300 flex justify-center w-full">
          <div className="flex h-16 w-full max-w-6xl items-center justify-between px-4">
            <a href="/" className="flex items-center gap-3 group transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-[0_0_12px_rgba(124,58,237,0.25)] group-hover:shadow-[0_0_18px_rgba(124,58,237,0.5)] group-hover:scale-105 transition-all">
                <svg className="h-5 w-5 text-white animate-pulse-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(0 12 12)" />
                  <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
                  <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">FootyLive</span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-500 font-medium -mt-1 tracking-wider uppercase">Premium streams</span>
              </div>
            </a>
            
            <div className="flex items-center gap-3.5">
              <a 
                href="/multistream" 
                className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-500 hover:to-indigo-550 text-white shadow-[0_0_12px_rgba(124,58,237,0.2)] hover:shadow-[0_0_18px_rgba(124,58,237,0.45)] hover:scale-105 active:scale-95 transition-all"
              >
                Multi-View
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content wrapper */}
        <main className="relative z-10 w-full flex flex-col items-center py-8 px-4 flex-1">
          <div className="w-full max-w-6xl flex flex-col items-stretch">
            {children}
          </div>
        </main>

        {/* Beautiful Simple Footer */}
        <footer className="relative z-10 border-t border-zinc-200 dark:border-zinc-900/60 py-8 px-4 bg-white/60 dark:bg-[#040405]/90 transition-all duration-300 flex justify-center w-full">
          <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-zinc-500 dark:text-zinc-600 px-4">
            <p>© {new Date().getFullYear()} FootyLive. All streaming sources are aggregated from third-party networks for validation purposes.</p>
            <div className="flex items-center gap-4 shrink-0">
              <a 
                href="/api-hub" 
                className="font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-600 dark:text-zinc-400 hover:text-violet-650 dark:hover:text-violet-400 hover:border-violet-500/30 dark:hover:border-violet-500/30 hover:bg-violet-500/5 dark:hover:bg-violet-500/5 active:scale-95 transition-all"
              >
                <Database className="h-3.5 w-3.5" />
                <span>API Developer Hub</span>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
