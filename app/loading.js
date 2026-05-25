export default function Loading() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-6 py-8 space-y-3">
        <div className="h-6 w-40 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        <div className="h-8 w-72 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
      </div>

      {/* Controls skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-xl">
        <div className="flex rounded-lg bg-zinc-200/60 dark:bg-zinc-900 p-1 gap-1">
          <div className="h-9 w-32 rounded-md bg-zinc-300 dark:bg-zinc-800 animate-pulse" />
          <div className="h-9 w-32 rounded-md bg-zinc-200 dark:bg-zinc-900 animate-pulse" />
        </div>
        <div className="h-9 w-56 rounded-lg bg-zinc-200 dark:bg-zinc-900 animate-pulse" />
      </div>

      {/* Cards skeleton grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="rounded-xl glass-panel p-4 space-y-4 shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="h-5 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            </div>
            {/* Team rows */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              </div>
            </div>
            {/* Footer */}
            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
