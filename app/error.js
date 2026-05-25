'use client';

import { RefreshCw } from 'lucide-react';

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 shadow-lg">
        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6m0-6 6 6" />
        </svg>
      </div>
      <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200">Connection Error</h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        Failed to load content. This may be caused by a slow or unstable internet connection. Check your network and try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition-all active:scale-95 cursor-pointer"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
