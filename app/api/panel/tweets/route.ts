import { NextResponse } from 'next/server';

const RSS_FEEDS = [
  {
    name: 'Reuters',
    handle: '@Reuters',
    avatar: 'R',
    color: '#ff8000',
    url: 'https://feeds.reuters.com/reuters/businessNews',
  },
  {
    name: 'Bloomberg',
    handle: '@Bloomberg',
    avatar: 'B',
    color: '#1a1a1a',
    url: 'https://feeds.bloomberg.com/markets/news.rss',
  },
  {
    name: 'FT Markets',
    handle: '@FT',
    avatar: 'FT',
    color: '#fff1e5',
    textColor: '#990f3d',
    url: 'https://www.ft.com/markets?format=rss',
  },
  {
    name: 'CNBC',
    handle: '@CNBC',
    avatar: 'C',
    color: '#005594',
    url: 'https://www.cnbc.com/id/20910258/device/rss/rss.html',
  },
  {
    name: 'WSJ Markets',
    handle: '@WSJ',
    avatar: 'W',
    color: '#0274B6',
    url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
  },
];

async function parseRSS(feed: typeof RSS_FEEDS[0]) {
  try {
    const res = await fetch(feed.url, {
      next: { revalidate: 300 },
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: any[] = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const match of itemMatches) {
      const itemXml = match[1];
      if (!itemXml) continue;
      
      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
        ?? itemXml.match(/<title>(.*?)<\/title>/)?.[1]
        ?? '';
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1]
        ?? itemXml.match(/<guid>(.*?)<\/guid>/)?.[1]
        ?? '';
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? '';

      if (title) {
        items.push({
          id: `${feed.handle}-${items.length}`,
          text: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim(),
          link: link.trim(),
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          source: feed.name,
          handle: feed.handle,
          avatar: feed.avatar,
          color: feed.color,
          textColor: feed.textColor ?? '#ffffff',
        });
      }
      if (items.length >= 3) break;
    }

    return items;
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const results = await Promise.allSettled(RSS_FEEDS.map(parseRSS));

    const allItems = results
      .flatMap(r => r.status === 'fulfilled' ? r.value : [])
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 20);

    return NextResponse.json({ items: allItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, items: [] }, { status: 500 });
  }
}
