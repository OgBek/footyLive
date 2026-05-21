'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MatchCountdown({ timestamp, status }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    let refreshed = false;
    function update() {
      const diff = timestamp - Date.now();
      if (diff <= 0) {
        setTimeLeft({ label: 'Starting soon', isSoon: true });
        if (!refreshed) {
          refreshed = true;
          router.refresh();
        }
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds, isSoon: false });
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timestamp, router]);

  if (!timeLeft || status === 'live') return null;

  if (timeLeft.isSoon) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 px-5 py-4 shadow-md dark:shadow-xl text-center">
        <span className="text-sm font-bold text-violet-650 dark:text-violet-400 animate-pulse">📢 Match Kickoff: Starting Soon</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/80 backdrop-blur-md px-5 py-4 shadow-md dark:shadow-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <Clock className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Match Kickoff Countdown</span>
        </div>

        <div className="flex items-center gap-2">
          {timeLeft.days > 0 && (
            <div className="flex items-center">
              <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-800 dark:text-white font-mono tabular-nums shadow-inner">
                {timeLeft.days}
              </div>
              <span className="text-[10px] text-zinc-550 dark:text-zinc-500 font-extrabold uppercase ml-1 mr-2">d</span>
            </div>
          )}
          
          <div className="flex items-center">
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-800 dark:text-white font-mono tabular-nums shadow-inner">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span className="text-[10px] text-zinc-550 dark:text-zinc-500 font-extrabold uppercase ml-1 mr-2">h</span>
          </div>

          <div className="flex items-center">
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-800 dark:text-white font-mono tabular-nums shadow-inner">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="text-[10px] text-zinc-550 dark:text-zinc-500 font-extrabold uppercase ml-1 mr-2">m</span>
          </div>

          <div className="flex items-center">
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg text-sm font-bold text-violet-650 dark:text-violet-400 font-mono tabular-nums shadow-inner ring-1 ring-violet-500/20">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <span className="text-[10px] text-zinc-550 dark:text-zinc-500 font-extrabold uppercase ml-1">s</span>
          </div>
        </div>

      </div>
    </div>
  );
}
