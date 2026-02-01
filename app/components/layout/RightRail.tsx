import { getCurrentUser } from '../../lib/auth.js';
import { RightRailClient } from './RightRailClient.js';

const upNextItems = [
  {
    id: 1,
    title: 'Market Analysis: Fed Policy and Tech Earnings',
    show: 'All-In Podcast',
    host: 'Chamath',
    date: '01-15-2026',
    thumbnail: '🎙️',
  },
  {
    id: 2,
    title: 'Quarterly Economic Outlook - January 14, 2026',
    show: 'Quarterly Report',
    summaries: 142,
    date: '01-14-2026',
    thumbnail: '📊',
  },
  {
    id: 3,
    title: "Understanding the Federal Reserve's Balance Sheet",
    show: 'Odd Lots',
    host: 'Tracy Alloway',
    date: '01-13-2026',
    thumbnail: '🎵',
  },
];

const suggestions = [
  { name: 'Planet Money', avatar: '💰' },
  { name: 'Josh Brown', avatar: '👨' },
  { name: 'Masters in Business', avatar: '👩' },
  { name: 'Chamath Palihapitiya', avatar: '👨‍💼' },
];

const quickActions = [
  { label: 'NEWS', icon: '📰' },
  { label: 'CALENDAR', icon: '📅' },
  { label: 'EARNINGS', icon: '💼' },
  { label: 'TWEETS', icon: '🐦' },
  { label: 'PREDICTIONS', icon: '📈' },
  { label: 'MARKETS', icon: '📊' },
];

export async function RightRail() {
  const user = await getCurrentUser();
  
  return (
    <RightRailClient
      upNextItems={upNextItems}
      suggestions={suggestions}
      quickActions={quickActions}
      userRole={user?.role || null}
    />
  );
}
