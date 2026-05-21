import { getMatchDetails, getMatchStats, resolveAllStreams } from '@/lib/streamEngine';
import StreamPlayer from '@/components/StreamPlayer';
import MatchCountdown from '@/components/MatchCountdown';
import MatchStatsSection from '@/components/MatchStatsSection';
import LiveScoreboard from '@/components/LiveScoreboard';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export const revalidate = 10;

export default async function WatchPage({ params, searchParams }) {
  const { matchId } = params;
  const backTab = searchParams?.tab || 'live';

  let match = null;
  let streamUrl = null;
  let channels = [];
  let errorMsg = null;
  let stats = null;

  const userFacingErrors = {
    'No streams available from any provider': 'No streams are available for this match right now.',
    'Match not found': 'This match could not be found. It may have been removed.',
  };

  try {
    match = await getMatchDetails(matchId);
    if (!match) throw new Error('Match not found');

    const [resolved, statsResult] = await Promise.all([
      resolveAllStreams(match.title, matchId, match.homeTeam?.name || '', match.awayTeam?.name || '', match),
      getMatchStats(matchId),
    ]);
    streamUrl = resolved.proxiedUrl || resolved.url;
    channels = resolved.channels || [];
    stats = statsResult;
  } catch (err) {
    errorMsg = userFacingErrors[err.message] || 'Unable to load this match. Please try again.';
    match = await getMatchDetails(matchId);
  }

  if (!match) {
    match = {
      id: matchId,
      title: 'Match Not Found',
      tournament: '',
      timestamp: Date.now(),
      homeTeam: { name: 'Home', badge: '' },
      awayTeam: { name: 'Away', badge: '' },
      sources: [],
      fallbackChannels: [],
      leagueLogo: '',
      poster: '',
      venue: '',
      note: '',
    };
  }

  const dateStr = new Date(match.timestamp).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timeStr = new Date(match.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const boxscore = stats?.boxscore;
  const teamStats = boxscore?.teams || [];
  const commentary = stats?.commentary || [];

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto">
      {/* Back navigation */}
      <div>
        <Link
          href={`/?tab=${backTab}`}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-950/70 border border-zinc-850 px-3.5 py-1.5 text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-700 hover:shadow-md transition-all group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Fixtures
        </Link>
      </div>

      {/* Scoreboard block */}
      {match.status === 'live' && match.homeScore !== undefined ? (
        <LiveScoreboard matchId={matchId} initial={{
          status: match.status,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          currentMinute: match.currentMinute,
          currentMinuteNumber: match.currentMinuteNumber,
          homeName: match.homeTeam?.name,
          awayName: match.awayTeam?.name,
          homeBadge: match.homeTeam?.badge,
          awayBadge: match.awayTeam?.badge,
          tournament: match.tournament,
          leagueLogo: match.leagueLogo,
          venue: match.venue,
          dateStr,
          timeStr,
        }} />
      ) : (
        <MatchCountdown timestamp={match.timestamp} status={match.status} />
      )}

      {/* Special notifications banners */}
      {match.status === 'live' && match.homeScore !== undefined && match.currentMinuteNumber >= 90 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-center shadow-md">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">⚠️ Full Time Completed</p>
          <p className="mt-0.5 text-xs text-zinc-500">The fixture has finished. Streams may terminate soon.</p>
        </div>
      )}

      {match.status === 'live' && match.homeScore !== undefined && match.currentMinuteNumber === 45 && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-center shadow-md">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">⚽ Halftime Interval</p>
          <p className="mt-0.5 text-xs text-zinc-500">Teams are in the locker room. The live stream will return shortly.</p>
        </div>
      )}

      {/* Player window block */}
      {streamUrl && !errorMsg ? (
        <StreamPlayer streamUrl={streamUrl} channels={channels} matchTitle={match.title} matchStatus={match.status} />
      ) : channels.length > 0 ? (
        <StreamPlayer streamUrl={streamUrl} channels={channels} matchTitle={match.title} matchStatus={match.status} />
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-2xl border border-zinc-800 bg-[#060609] p-6 shadow-2xl">
          <div className="text-center space-y-3 max-w-xs">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800">
              <RefreshCw className="h-5 w-5 text-zinc-500 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Stream is Offline</p>
              {errorMsg ? (
                <p className="mt-1 text-xs text-zinc-500">{errorMsg}</p>
              ) : (
                <p className="mt-1 text-xs text-zinc-500">The aggregation engine is resolving stream routes.</p>
              )}
            </div>
            <p className="text-[10px] text-zinc-650">Please reload the page or check back near kick-off.</p>
          </div>
        </div>
      )}

      {/* Stats & commentary details block */}
      <MatchStatsSection teamStats={teamStats} commentary={commentary} homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
    </div>
  );
}
