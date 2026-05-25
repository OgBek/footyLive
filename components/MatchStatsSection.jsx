'use client';

import { useState } from 'react';
import { BarChart3, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function MatchStatsSection({ teamStats, commentary, homeTeam, awayTeam }) {
  const [showStats, setShowStats] = useState(true);
  const [showCommentary, setShowCommentary] = useState(false);

  if (!teamStats.length && !commentary.length) return null;

  return (
    <div className="space-y-5">
      {/* Match Statistics panel */}
      {teamStats.length > 0 && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 overflow-hidden shadow-xl">
          <button
            onClick={() => setShowStats(!showStats)}
            className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-zinc-400 hover:text-white transition-colors border-b border-zinc-900 cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20">
                <BarChart3 className="h-4 w-4 text-violet-400" />
              </div>
              <span>Match Statistics</span>
            </span>
            {showStats ? (
              <ChevronUp className="h-4 w-4 text-zinc-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            )}
          </button>
          
          {showStats && (
            <div className="px-6 py-6 space-y-5">
              {/* Teams Header row */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-2.5">
                  {homeTeam?.badge && (
                    <img src={homeTeam.badge} alt="" className="h-6 w-6 rounded-full object-contain bg-zinc-900 ring-1 ring-zinc-800" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">{homeTeam?.name || 'Home'}</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-600">Comparison</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">{awayTeam?.name || 'Away'}</span>
                  {awayTeam?.badge && (
                    <img src={awayTeam.badge} alt="" className="h-6 w-6 rounded-full object-contain bg-zinc-900 ring-1 ring-zinc-800" />
                  )}
                </div>
              </div>

              {/* Stats Rows */}
              {teamStats[0]?.statistics?.map((stat, idx) => {
                const homeVal = teamStats[0]?.statistics?.[idx]?.displayValue || '-';
                const awayVal = teamStats[1]?.statistics?.[idx]?.displayValue || '-';
                const homePct = teamStats[0]?.statistics?.[idx]?.percentage || 50;
                const awayPct = teamStats[1]?.statistics?.[idx]?.percentage || 50;
                
                // Determine which side leads for visual emphasis
                const homeNum = parseFloat(homeVal) || 0;
                const awayNum = parseFloat(awayVal) || 0;
                const homeLeads = homeNum > awayNum;
                const awayLeads = awayNum > homeNum;

                return (
                  <div key={`${stat.name || 'stat'}-${idx}`} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold tabular-nums min-w-[3ch] text-left ${homeLeads ? 'text-violet-400' : 'text-zinc-300'}`}>
                        {homeVal}
                      </span>
                      <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">
                        {stat.label || stat.name}
                      </span>
                      <span className={`font-bold tabular-nums min-w-[3ch] text-right ${awayLeads ? 'text-emerald-400' : 'text-zinc-300'}`}>
                        {awayVal}
                      </span>
                    </div>
                    {/* Visual bar split */}
                    <div className="flex h-2 rounded-full overflow-hidden bg-zinc-900/80 border border-zinc-800 gap-0.5">
                      <div
                        className={`rounded-l-full transition-all duration-700 ease-out ${
                          homeLeads 
                            ? 'bg-gradient-to-r from-violet-600 to-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.3)]' 
                            : 'bg-gradient-to-r from-violet-600/50 to-violet-500/40'
                        }`}
                        style={{ width: `${homePct}%` }}
                      />
                      <div
                        className={`rounded-r-full transition-all duration-700 ease-out ml-auto ${
                          awayLeads 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                            : 'bg-gradient-to-r from-emerald-500/40 to-emerald-400/30'
                        }`}
                        style={{ width: `${awayPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-3 border-t border-zinc-900">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-violet-600 to-violet-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{homeTeam?.name || 'Home'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{awayTeam?.name || 'Away'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Commentary log panel */}
      {commentary.length > 0 && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 overflow-hidden shadow-xl">
          <button
            onClick={() => setShowCommentary(!showCommentary)}
            className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-zinc-400 hover:text-white transition-colors border-b border-zinc-900 cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
              </div>
              <span>Live Play-by-Play Logs</span>
              <span className="text-[10px] font-bold text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                {commentary.length}
              </span>
            </span>
            {showCommentary ? (
              <ChevronUp className="h-4 w-4 text-zinc-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            )}
          </button>
          
          {showCommentary && (
            <div className="px-5 py-4 space-y-0 max-h-80 overflow-y-auto divide-y divide-zinc-900/80">
              {commentary.slice(0, 30).map((item, idx) => {
                // Color-code by event type
                const eventType = (item.type || '').toLowerCase();
                const isGoal = eventType.includes('goal');
                const isCard = eventType.includes('card') || eventType.includes('yellow') || eventType.includes('red');
                const isSub = eventType.includes('sub');

                let timeBg = 'bg-violet-950/40 border-violet-900/60 text-violet-400';
                if (isGoal) timeBg = 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400';
                else if (isCard) timeBg = 'bg-amber-950/40 border-amber-900/60 text-amber-400';
                else if (isSub) timeBg = 'bg-sky-950/40 border-sky-900/60 text-sky-400';

                return (
                  <div key={idx} className="flex gap-4 text-xs py-3.5 items-start">
                    {/* Time badge */}
                    <span className={`shrink-0 font-mono font-bold w-14 text-center border px-2 py-0.5 rounded-md text-[11px] ${timeBg}`}>
                      {item.time?.displayValue || 'KO'}
                    </span>
                    
                    {/* Log description */}
                    <div className="space-y-1 flex-1">
                      <p className={`font-medium leading-relaxed ${isGoal ? 'text-emerald-300 font-bold' : 'text-zinc-300'}`}>
                        {isGoal && '⚽ '}{isCard && '🟨 '}{isSub && '🔄 '}{item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
