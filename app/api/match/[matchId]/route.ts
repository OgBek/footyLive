import { NextRequest, NextResponse } from 'next/server';
import { getMatchDetails } from '@/lib/streamEngine';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  try {
    const match = await getMatchDetails(matchId);
    if (!match) {
      return NextResponse.json({ match: null }, { status: 404 });
    }

    const dateStr = new Date(match.timestamp).toLocaleDateString([], {
      weekday: 'short', month: 'short', day: 'numeric',
    });
    const timeStr = new Date(match.timestamp).toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit',
    });

    return NextResponse.json({
      match: {
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
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Unable to load match data. Please try again.' }, { status: 500 });
  }
}
