import { NextResponse } from 'next/server';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

export async function GET() {
  if (!FINNHUB_KEY) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY not set' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=general&minId=0&token=${FINNHUB_KEY}`,
      { next: { revalidate: 300 } } // cache 5 mins server-side
    );

    if (!res.ok) throw new Error(`Finnhub error: ${res.status}`);

    const data = await res.json();

    // Return top 10, cleaned up
    const news = data.slice(0, 10).map((item: any) => ({
      id: item.id,
      headline: item.headline,
      source: item.source,
      url: item.url,
      image: item.image || null,
      datetime: item.datetime, // unix timestamp
      summary: item.summary?.substring(0, 120) || '',
    }));

    return NextResponse.json({ news });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, news: [] }, { status: 500 });
  }
}
