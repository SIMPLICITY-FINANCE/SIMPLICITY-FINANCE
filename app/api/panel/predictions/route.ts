import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Gamma API - returns active markets sorted by volume
    const res = await fetch(
      'https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=25&order=volume24hr&ascending=false',
      {
        next: { revalidate: 300 },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        }
      }
    );

    if (!res.ok) throw new Error(`Polymarket Gamma API error: ${res.status}`);

    const markets = await res.json();

    const processed = (Array.isArray(markets) ? markets : [])
      .filter((m: any) => m.active && !m.closed && m.question)
      .slice(0, 15)
      .map((m: any) => {
        // outcomePrices is a JSON string like "[\"0.85\", \"0.15\"]"
        let yesProb = null;
        let noProb = null;
        try {
          const prices = typeof m.outcomePrices === 'string'
            ? JSON.parse(m.outcomePrices)
            : m.outcomePrices;
          if (Array.isArray(prices) && prices.length >= 2) {
            yesProb = Math.round(parseFloat(prices[0]) * 100);
            noProb = Math.round(parseFloat(prices[1]) * 100);
          }
        } catch {}

        return {
          id: m.id ?? m.conditionId,
          question: m.question,
          yesProb,
          noProb,
          volume: parseFloat(m.volume ?? m.volumeNum ?? '0'),
          volume24h: parseFloat(m.volume24hr ?? '0'),
          endDate: m.endDate ?? m.endDateIso ?? null,
          url: m.url ? `https://polymarket.com${m.url}` : 'https://polymarket.com',
        };
      })
      .filter((m: any) => m.yesProb !== null);

    return NextResponse.json({ markets: processed });
  } catch (error: any) {
    console.error('[Predictions] Error:', error.message);
    return NextResponse.json({ error: error.message, markets: [] }, { status: 500 });
  }
}
