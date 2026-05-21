import { Match, Channel } from '../types';
import { StreamProvider } from './types';
import { fetchWithTimeout } from './baseProvider';
import { getLeaguePriority, getCountryForLeague } from '../utils/matching';
import logger from '../logger';

const WATCHFOOTY_API = process.env.NEXT_PUBLIC_API_BASE || 'https://api.watchfooty.st';
const TIMEOUT_MS = 4000;
const SHORT_TIMEOUT = 2500;

export class WatchFootyProvider implements StreamProvider {
  id = 'watchfooty';
  name = 'WatchFooty';

  private wfMatchesCache: any[] = [];
  private wfMatchFetchInFlight: Promise<any[]> | null = null;

  private async fetchRawMatches(): Promise<any[]> {
    if (this.wfMatchFetchInFlight) return this.wfMatchFetchInFlight;
    this.wfMatchFetchInFlight = (async () => {
      try {
        const data = await fetchWithTimeout(`${WATCHFOOTY_API}/api/v1/matches/football`, TIMEOUT_MS);
        this.wfMatchesCache = Array.isArray(data) ? data : [];
        return this.wfMatchesCache;
      } catch (err: any) {
        logger.error('WatchFooty API request failed', err, { api: WATCHFOOTY_API });
        this.wfMatchesCache = [];
        return this.wfMatchesCache;
      } finally {
        this.wfMatchFetchInFlight = null;
      }
    })();
    return this.wfMatchFetchInFlight;
  }

  async fetchMatches(): Promise<Match[]> {
    const raw = await this.fetchRawMatches();
    return raw.map(normalizeWatchFootyMatch);
  }

  async resolveStreams(
    matchTitle: string,
    homeTeam: string,
    awayTeam: string,
    matchId: string,
    preFetchedMatch?: Match | null
  ): Promise<Channel[]> {
    const match = preFetchedMatch || await getMatchDetails(matchId);
    if (!match || !match.sources) return [];
    
    return match.sources.map((s, idx) => ({
      name: `Server ${idx + 1}`,
      url: s.url,
      provider: this.id,
      quality: s.quality ? String(s.quality).toUpperCase() : 'SD',
    }));
  }
}

export function normalizeWatchFootyMatch(match: any): Match {
  const streams = match.streams || [];
  const homeLogo = match.teams?.home?.logoUrl ? match.teams.home.logoUrl : '';
  const awayLogo = match.teams?.away?.logoUrl ? match.teams.away.logoUrl : '';
  const leagueLogo = match.leagueLogo ? match.leagueLogo : '';
  const poster = match.poster ? match.poster : '';
  
  const kickoffTime = match.timestamp ? new Date(match.timestamp).getTime() : 0;
  const now = Date.now();
  const diffMinutes = kickoffTime ? Math.floor((now - kickoffTime) / 60000) : -1;
  // A match is dynamically live if the kickoff time has arrived/passed, and it's less than 125 minutes since kickoff
  const isTimeLive = kickoffTime && diffMinutes >= 0 && diffMinutes < 125;

  const isExplicitlyLive = match.status === 'in' || match.status === 'live';
  const hasLiveScores = (match.scores?.home >= 0 || match.scores?.away >= 0) && 
                         match.currentMinuteNumber > 0 && match.currentMinuteNumber < 90;

  let status: 'live' | 'upcoming';
  if (match.status === 'post' || match.status === 'postponed' || match.status === 'cancelled') {
    status = 'upcoming';
  } else if (isExplicitlyLive) {
    status = 'live';
  } else if (match.status === 'pre' && (hasLiveScores || isTimeLive)) {
    status = 'live';
  } else {
    status = 'upcoming';
  }

  let currentMinuteNumber = match.currentMinuteNumber || 0;
  let currentMinute = match.currentMinute || '';

  if (status === 'live' && !currentMinuteNumber) {
    if (diffMinutes >= 0 && diffMinutes < 125) {
      if (diffMinutes < 45) {
        currentMinuteNumber = diffMinutes;
        currentMinute = `${diffMinutes}'`;
      } else if (diffMinutes >= 45 && diffMinutes < 60) {
        currentMinuteNumber = 45;
        currentMinute = 'HT';
      } else if (diffMinutes >= 60 && diffMinutes < 105) {
        currentMinuteNumber = diffMinutes - 15;
        currentMinute = `${diffMinutes - 15}'`;
      } else {
        currentMinuteNumber = 90;
        currentMinute = '90+';
      }
    }
  }

  const country = getCountryForLeague(match.league || '');

  return {
    id: String(match.matchId || ''),
    title: match.title || '',
    sport: 'football',
    status,
    timestamp: kickoffTime || Date.now(),
    tournament: match.league || '',
    country: country,
    priority: getLeaguePriority(match.league || ''),
    homeTeam: { name: match.teams?.home?.name || 'Home', badge: homeLogo },
    awayTeam: { name: match.teams?.away?.name || 'Away', badge: awayLogo },
    leagueLogo: leagueLogo,
    poster: poster,
    venue: match.venue || '',
    note: match.note || '',
    sources: streams.map((s: any, idx: number) => ({ 
      source: `wf-${s.source || 'stream'}-${idx + 1}`,
      id: String(s.id),
      url: s.url,
      label: `Server ${idx + 1}`,
      quality: s.quality ? String(s.quality).toUpperCase() : 'SD'
    })),
    fallbackChannels: streams.map((s: any, idx: number) => ({
      name: `Server ${idx + 1} (WatchFooty)`,
      url: s.url,
    })),
    currentMinute,
    currentMinuteNumber,
    homeScore: Math.max(0, match.scores?.home ?? match.homeScore ?? 0),
    awayScore: Math.max(0, match.scores?.away ?? match.awayScore ?? 0),
  };

}

export async function getLeagues(): Promise<string[]> {
  try {
    const data = await fetchWithTimeout(`${WATCHFOOTY_API}/api/v1/top-leagues/football`, TIMEOUT_MS);
    return Array.isArray(data) ? data.filter(l => typeof l === 'string').sort() : [];
  } catch (err: any) {
    logger.error('WatchFooty Leagues API request failed', err);
    return [];
  }
}

export async function getMatchDetails(matchId: string): Promise<Match | null> {
  try {
    const data = await fetchWithTimeout(`${WATCHFOOTY_API}/api/v1/match/${matchId}`, TIMEOUT_MS);
    if (!data || (Array.isArray(data) && data.length === 0)) return null;
    const match = Array.isArray(data) ? data[0] : data;
    return normalizeWatchFootyMatch(match);
  } catch (err: any) {
    logger.error('WatchFooty Match Details API request failed', err, { matchId });
    return null;
  }
}

export interface MatchStats {
  venue: string;
  leagueLogo: string;
  poster: string;
  boxscore: any;
  rosters: any;
  commentary: any;
}

export async function getMatchStats(matchId: string): Promise<MatchStats | null> {
  try {
    const data = await fetchWithTimeout(`${WATCHFOOTY_API}/api/v1/match/${matchId}/stats`, SHORT_TIMEOUT);
    if (!data || !data.statistics) return null;
    return {
      venue: data.venue || '',
      leagueLogo: data.leagueLogo ? data.leagueLogo : '',
      poster: data.poster ? data.poster : '',
      boxscore: data.statistics?.boxscore || null,
      rosters: data.statistics?.rosters || null,
      commentary: data.statistics?.commentary || null,
    };
  } catch (err) {
    return null;
  }
}

export async function getTopTeams(): Promise<string[]> {
  try {
    const data = await fetchWithTimeout(`${WATCHFOOTY_API}/api/v1/top-teams/football`, TIMEOUT_MS);
    return Array.isArray(data) ? data.filter(t => typeof t === 'string') : [];
  } catch (err: any) {
    logger.error('WatchFooty Top Teams API request failed', err);
    return [];
  }
}
