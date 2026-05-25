import { getMatches, getLiveMatches } from '@/lib/streamEngine';
import MatchGrid from '@/components/MatchGrid';

export const revalidate = 10;

export default async function Home({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams?.tab || 'live';

  const [allMatches, liveMatches] = await Promise.all([
    getMatches(),
    getLiveMatches()
  ]);

  const matchMap = new Map();
  for (const m of allMatches) matchMap.set(m.id, m);
  for (const m of liveMatches) matchMap.set(m.id, m);
  let mergedMatches = Array.from(matchMap.values());

  const now = Date.now();
  const thirtyMin = 30 * 60 * 1000;
  mergedMatches = mergedMatches.filter(m => {
    if (m.status === 'live') return true;
    if (m.status === 'upcoming' && m.timestamp < now - thirtyMin) return false;
    return true;
  });

  mergedMatches.sort((a, b) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (b.status === 'live' && a.status !== 'live') return 1;
    if (a.status === 'live' && b.status === 'live') {
      const aHas = (a.sources?.length || 0) > 0 ? 0 : 1;
      const bHas = (b.sources?.length || 0) > 0 ? 0 : 1;
      if (aHas !== bHas) return aHas - bHas;
    }
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.timestamp - b.timestamp;
  });

  return (
    <div className="space-y-5">
      <MatchGrid matches={mergedMatches} defaultTab={tab} />
    </div>
  );
}
