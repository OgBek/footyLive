'use client';

import Link from 'next/link';
import { Play, Clock, ShieldAlert, Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { isTeamFavorited, toggleFavoriteTeam } from '@/lib/utils/favorites';

function TeamBadge({ team, size = 'h-9 w-9' }) {
  const [imgError, setImgError] = useState(false);
  const hasBadge = team.badge && !imgError;
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name)}&background=f4f4f5&color=71717a&size=128&bold=true&format=png`;

  if (hasBadge) {
    return (
      <img
        src={team.badge}
        alt={team.name}
        className={`${size} rounded-full object-contain bg-white dark:bg-zinc-950 p-0.5 ring-1 ring-zinc-200 dark:ring-zinc-800 group-hover:ring-violet-500/50 group-hover:scale-110 transition-all duration-300 shadow-sm`}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <img
      src={fallbackUrl}
      alt={team.name}
      className={`${size} rounded-full object-contain group-hover:scale-110 transition-all duration-300`}
      loading="lazy"
    />
  );
}

export default function MatchCard({ match, tab }) {
  const { id, status, timestamp, homeTeam, awayTeam, sources, tournament, homeScore, awayScore, leagueLogo, currentMinuteNumber } = match;

  const [liveData, setLiveData] = useState(null);
  const [homeFav, setHomeFav] = useState(false);
  const [awayFav, setAwayFav] = useState(false);
  const polling = useRef(null);

  useEffect(() => {
    const checkFavs = () => {
      setHomeFav(isTeamFavorited(homeTeam?.name));
      setAwayFav(isTeamFavorited(awayTeam?.name));
    };
    checkFavs();
    window.addEventListener('favorites-updated', checkFavs);
    return () => {
      window.removeEventListener('favorites-updated', checkFavs);
    };
  }, [homeTeam?.name, awayTeam?.name]);

  useEffect(() => {
    if (status !== 'live') { setLiveData(null); return; }
    const poll = async () => {
      try {
        const res = await fetch(`/api/match/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.match) setLiveData(data.match);
      } catch {}
    };
    poll();
    polling.current = setInterval(poll, 30000);
    return () => { if (polling.current) clearInterval(polling.current); polling.current = null; };
  }, [id, status]);

  const liveMinute = liveData?.currentMinute || match.currentMinute;
  const liveMinuteNumber = liveData?.currentMinuteNumber ?? match.currentMinuteNumber;
  const displayHomeScore = liveData?.homeScore ?? homeScore;
  const displayAwayScore = liveData?.awayScore ?? awayScore;

  const currentMinute = liveMinute || (liveMinuteNumber ? `${liveMinuteNumber}'` : '');
  const timeStr = status === 'live'
    ? (currentMinute ? `${currentMinute}` : 'LIVE')
    : new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const timeLeft = status === 'upcoming' ? getTimeLeft(timestamp) : '';
  const isMatchFavorited = homeFav || awayFav;

  return (
    <Link
      href={`/watch/${id}?tab=${tab || 'live'}`}
      className={`group relative flex flex-col rounded-xl glass-panel glass-panel-hover p-4 shadow-md hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(124,58,237,0.15)] transition-all duration-500 ${
        isMatchFavorited 
          ? 'border-violet-300 bg-gradient-to-br from-violet-50/40 via-white/80 to-violet-50/20 ring-1 ring-violet-200/50 shadow-[0_10px_30px_rgba(139,92,246,0.08)] dark:border-violet-500/35 dark:bg-gradient-to-br dark:from-violet-950/15 dark:via-[#0e0c15]/65 dark:to-[#050508]/85 dark:ring-1 dark:ring-violet-500/20 dark:shadow-[0_0_30px_rgba(139,92,246,0.18)]' 
          : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {status === 'live' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2.5 py-0.5 text-[11px] font-extrabold text-red-600 dark:text-red-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
              {currentMinute || 'LIVE'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200/50 border border-zinc-300/40 dark:bg-zinc-900 dark:border-zinc-800 px-2.5 py-0.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 shadow-sm">
              <Clock className="h-3 w-3" />
              {timeStr}
            </span>
          )}

          {isMatchFavorited && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 tracking-wider uppercase animate-pulse">
              <Star className="h-2.5 w-2.5 fill-amber-400" />
              Starred
            </span>
          )}
        </div>
        {tournament && (
          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 truncate max-w-[130px] flex items-center gap-1.5 bg-zinc-200/50 border border-zinc-300/40 dark:bg-zinc-950/60 dark:border-zinc-900 px-2.5 py-0.5 rounded-full shadow-sm" title={tournament}>
            {leagueLogo ? (
              <img src={leagueLogo} alt="" className="h-3.5 w-3.5 rounded-full object-contain bg-zinc-50 dark:bg-zinc-950 inline-block shrink-0" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-700 inline-block shrink-0" />
            )}
            <span className="truncate">{tournament}</span>
          </span>
        )}
      </div>

      {/* Main scoreboard block */}
      <div className="space-y-3.5 py-1">
        {/* Home Team */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <TeamBadge team={homeTeam} />
            <span className="text-[14px] font-bold truncate text-zinc-800 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-white transition-colors">{homeTeam.name}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavoriteTeam(homeTeam.name);
              }}
              className="p-1 rounded-md hover:bg-zinc-200/60 dark:hover:bg-zinc-900/90 text-zinc-400 hover:text-amber-500 dark:text-zinc-500 dark:hover:text-amber-400 active:scale-75 transition-all shrink-0 ml-1 opacity-65 group-hover:opacity-100 cursor-pointer"
              title={homeFav ? "Unfavorite Team" : "Favorite Team"}
            >
              <Star className={`h-3.5 w-3.5 transition-all ${homeFav ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]' : 'text-zinc-400 dark:text-zinc-500'}`} />
            </button>
          </div>
          {status === 'live' && displayHomeScore !== undefined && (
            <span className="text-[18px] font-black text-zinc-800 dark:text-white tabular-nums shrink-0 bg-zinc-100/85 dark:bg-zinc-950 px-2.5 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800/80 shadow-sm">{displayHomeScore}</span>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <TeamBadge team={awayTeam} />
            <span className="text-[14px] font-bold truncate text-zinc-800 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-white transition-colors">{awayTeam.name}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavoriteTeam(awayTeam.name);
              }}
              className="p-1 rounded-md hover:bg-zinc-200/60 dark:hover:bg-zinc-900/90 text-zinc-400 hover:text-amber-500 dark:text-zinc-500 dark:hover:text-amber-400 active:scale-75 transition-all shrink-0 ml-1 opacity-65 group-hover:opacity-100 cursor-pointer"
              title={awayFav ? "Unfavorite Team" : "Favorite Team"}
            >
              <Star className={`h-3.5 w-3.5 transition-all ${awayFav ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]' : 'text-zinc-400 dark:text-zinc-500'}`} />
            </button>
          </div>
          {status === 'live' && displayAwayScore !== undefined && (
            <span className="text-[18px] font-black text-zinc-800 dark:text-white tabular-nums shrink-0 bg-zinc-100/85 dark:bg-zinc-950 px-2.5 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800/80 shadow-sm">{displayAwayScore}</span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-800/80 to-transparent my-3.5" />

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-[11px] text-zinc-500 dark:text-zinc-500 font-bold tracking-wide">
          {sources.length === 0 ? 'Verification only' : `${sources.length} stream server${sources.length !== 1 ? 's' : ''}`}
        </span>

        {sources.length > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 group-hover:text-violet-500 dark:group-hover:text-violet-300 transition-colors">
            <Play className="h-3 w-3 fill-violet-500/20 dark:fill-violet-400/20 group-hover:scale-110 transition-transform" />
            Watch Stream
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500">
            <ShieldAlert className="h-3.5 w-3.5" />
            Pending Link
          </span>
        )}
      </div>

      {status === 'upcoming' && timeLeft && (
        <div className="mt-3 rounded-lg bg-zinc-100/80 border border-zinc-200 dark:bg-zinc-950/70 dark:border-zinc-800 px-3 py-2 text-center text-xs font-bold text-zinc-700 dark:text-zinc-300 shadow-inner">
          {timeLeft.toLowerCase().trim().includes('starting soon') ? (
            <span className="text-violet-600 dark:text-violet-400 font-black animate-pulse">Starting soon</span>
          ) : (
            <>
              Kickoff in <span className="text-violet-600 dark:text-violet-400 font-black font-mono">{timeLeft}</span>
            </>
          )}
        </div>
      )}
    </Link>
  );
}

function getTimeLeft(timestamp) {
  const diff = timestamp - Date.now();
  if (diff <= 0) return 'Starting soon';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
