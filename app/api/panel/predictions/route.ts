import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://clob.polymarket.com/markets?active=true&closed=false&_limit=50&_order=volume24hr&_sort=desc',
      {
        next: { revalidate: 300 },
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!res.ok) throw new Error(`Polymarket error: ${res.status}`);

    const data = await res.json();
    const markets = (data.data ?? data ?? [])
      .slice(0, 15)
      .map((m: any) => {
        const tokens = m.tokens ?? [];
        const yesToken = tokens.find((t: any) =>
          t.outcome?.toLowerCase() === 'yes'
        );
        const probability = yesToken?.price
          ? Math.round(parseFloat(yesToken.price) * 100)
          : null;

        return {
          id: m.condition_id ?? m.id,
          question: m.question,
          probability,
          volume: m.volumeNum ?? m.volume ?? 0,
          endDate: m.end_date_iso ?? m.endDate,
          active: m.active,
        };
      })
      .filter((m: any) => m.question && m.probability !== null);

    return NextResponse.json({ markets });
  } catch (error: any) {
    console.error('[Predictions] Polymarket fetch error:', error);
    return NextResponse.json({ error: error.message, markets: [] }, { status: 500 });
  }
}
