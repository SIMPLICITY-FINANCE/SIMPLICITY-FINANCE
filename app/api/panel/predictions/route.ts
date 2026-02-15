import { NextResponse } from 'next/server';

type Category = 'geo-politics' | 'economy' | 'technology' | 'markets' | 'trending' | 'breaking';

function classifyMarket(question: string): Category {
  const q = question.toLowerCase();

  // Geo-politics
  if (q.match(/war|nato|ukraine|russia|china|taiwan|iran|israel|gaza|election|president|minister|government|congress|senate|vote|treaty|sanction|military|troops/)) {
    return 'geo-politics';
  }

  // Economy
  if (q.match(/fed|federal reserve|interest rate|inflation|cpi|gdp|unemployment|recession|rate cut|rate hike|bps|basis point|economy|fiscal|debt|deficit|treasury|fomc/)) {
    return 'economy';
  }

  // Technology
  if (q.match(/ai|gpt|openai|apple|google|microsoft|meta|amazon|tesla|crypto|bitcoin|ethereum|blockchain|token|nft|tech|software|chip|semiconductor/)) {
    return 'technology';
  }

  // Markets
  if (q.match(/stock|market|s&p|nasdaq|dow|sp500|ipo|merger|acquisition|earnings|revenue|profit|shares|etf|bond|gold|oil|commodity/)) {
    return 'markets';
  }

  // Default to trending
  return 'trending';
}

export async function GET() {
  try {
    const res = await fetch(
      'https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=50&order=volume24hr&ascending=false',
      {
        next: { revalidate: 300 },
        headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
      }
    );

    if (!res.ok) throw new Error(`Polymarket error: ${res.status}`);

    const markets = await res.json();
    const arr = Array.isArray(markets) ? markets : [];

    // Find max 24h volume to determine "breaking" threshold
    const maxVol24h = Math.max(...arr.map((m: any) => parseFloat(m.volume24hr ?? '0')));
    const breakingThreshold = maxVol24h * 0.6; // top 40% by 24h volume = breaking

    const processed = arr
      .filter((m: any) => m.active && !m.closed && m.question)
      .slice(0, 40)
      .map((m: any) => {
        let yesProb = 50;
        let noProb = 50;
        try {
          const prices = typeof m.outcomePrices === 'string'
            ? JSON.parse(m.outcomePrices)
            : m.outcomePrices;
          if (Array.isArray(prices) && prices.length >= 2) {
            yesProb = Math.round(parseFloat(prices[0]) * 100);
            noProb = Math.round(parseFloat(prices[1]) * 100);
          }
        } catch {}

        const vol24h = parseFloat(m.volume24hr ?? '0');
        const baseCategory = classifyMarket(m.question);
        // Override to 'breaking' if very high recent volume
        const category: Category = vol24h >= breakingThreshold ? 'breaking' : baseCategory;

        return {
          id: m.id ?? m.conditionId,
          question: m.question,
          yesProb,
          noProb,
          volume: parseFloat(m.volume ?? '0'),
          volume24h: vol24h,
          endDate: m.endDate ?? null,
          url: m.url ? `https://polymarket.com${m.url}` : 'https://polymarket.com',
          category,
        };
      })
      .filter((m: any) => m.yesProb !== null);

    return NextResponse.json({ markets: processed });
  } catch (error: any) {
    console.error('[Predictions] Error:', error.message);
    return NextResponse.json({ error: error.message, markets: [] }, { status: 500 });
  }
}
