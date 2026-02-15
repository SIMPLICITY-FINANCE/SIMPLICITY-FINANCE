import { NextResponse } from 'next/server';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

export async function GET() {
  if (!FINNHUB_KEY) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY not set', news: [] }, { status: 500 });
  }

  try {
    // Fetch general finance news
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=general&minId=0&token=${FINNHUB_KEY}`,
      { next: { revalidate: 180 } } // cache 3 mins
    );

    if (!res.ok) throw new Error(`Finnhub error: ${res.status}`);

    const data = await res.json();
    const now = Math.floor(Date.now() / 1000);
    const twoHoursAgo = now - 7200;
    const oneDayAgo = now - 86400;

    const news = data.slice(0, 30).map((item: any, index: number) => {
      const age = now - item.datetime;
      const isBreaking = item.datetime >= twoHoursAgo;
      const isToday = item.datetime >= oneDayAgo;

      // Determine importance/alert level
      // Higher position in Finnhub feed = more relevant
      const alertLevel = index < 3 ? 'high'      // top 3 = high importance
                       : index < 8 ? 'medium'    // next 5 = medium
                       : 'low';                  // rest = low

      // Classify topic for icon
      const headline = item.headline?.toLowerCase() ?? '';
      const topicIcon =
        headline.match(/fed|rate|inflation|cpi|fomc|treasury/) ? 'economy' :
        headline.match(/oil|gold|commodit|energy/)             ? 'commodities' :
        headline.match(/crypto|bitcoin|ethereum|btc|eth/)      ? 'crypto' :
        headline.match(/stock|market|s&p|nasdaq|equity|ipo/)   ? 'markets' :
        headline.match(/tech|ai|apple|google|microsoft|chip/)  ? 'tech' :
        'general';

      return {
        id: item.id,
        headline: item.headline,
        source: item.source,
        url: item.url,
        datetime: item.datetime,
        isBreaking,
        isToday,
        alertLevel,
        topicIcon,
        summary: item.summary?.substring(0, 100) || '',
      };
    });

    return NextResponse.json({ news });
  } catch (error: any) {
    console.error('[News]', error.message);
    return NextResponse.json({ error: error.message, news: [] }, { status: 500 });
  }
}
