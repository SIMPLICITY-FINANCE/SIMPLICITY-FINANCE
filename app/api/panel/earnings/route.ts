import { NextResponse } from 'next/server';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

const PRIORITY_TICKERS = new Set([
  'AAPL', 'TSLA', 'NVDA', 'META', 'AMZN', 'MSFT', 'GOOGL', 'NFLX',
  'JPM', 'GS', 'BAC', 'MS', 'V', 'MA', 'AMD', 'INTC', 'ORCL', 'CRM',
  'UBER', 'LYFT', 'ABNB', 'COIN', 'HOOD', 'PLTR', 'ARM', 'SMCI'
]);

const COMPANY_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.', TSLA: 'Tesla', NVDA: 'Nvidia', META: 'Meta',
  AMZN: 'Amazon', MSFT: 'Microsoft', GOOGL: 'Alphabet', NFLX: 'Netflix',
  JPM: 'JPMorgan Chase', GS: 'Goldman Sachs', BAC: 'Bank of America',
  MS: 'Morgan Stanley', V: 'Visa', MA: 'Mastercard', AMD: 'AMD',
  INTC: 'Intel', ORCL: 'Oracle', CRM: 'Salesforce', UBER: 'Uber',
  COIN: 'Coinbase', HOOD: 'Robinhood', PLTR: 'Palantir', ARM: 'ARM',
};

export async function GET() {
  if (!FINNHUB_KEY) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY not set', earnings: [], grouped: {} }, { status: 500 });
  }

  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const futureStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    const url = `https://finnhub.io/api/v1/calendar/earnings?from=${todayStr}&to=${futureStr}&token=${FINNHUB_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Finnhub ${res.status}`);

    const data = await res.json();
    const allEarnings = data.earningsCalendar ?? [];

    console.log('[Earnings] Raw count:', allEarnings.length);

    // Group by date
    const grouped: Record<string, any[]> = {};

    allEarnings
      .filter((e: any) => e.symbol && e.date)
      .forEach((e: any) => {
        const date = e.date;
        if (!grouped[date]) grouped[date] = [];

        const surprise = (e.epsActual !== null && e.epsEstimate !== null && e.epsEstimate !== 0)
          ? parseFloat((((e.epsActual - e.epsEstimate) / Math.abs(e.epsEstimate)) * 100).toFixed(1))
          : null;

        grouped[date].push({
          symbol: e.symbol,
          name: COMPANY_NAMES[e.symbol] ?? e.symbol,
          date: e.date,
          hour: e.hour ?? '',
          epsEstimate: e.epsEstimate ?? null,
          epsActual: e.epsActual ?? null,
          surprise,
          isPriority: PRIORITY_TICKERS.has(e.symbol),
          quarter: e.quarter,
          year: e.year,
        });
      });

    // Sort each day: priority tickers first
    Object.keys(grouped).forEach(date => {
      const items = grouped[date];
      if (items) {
        items.sort((a, b) => {
          if (a.isPriority && !b.isPriority) return -1;
          if (!a.isPriority && b.isPriority) return 1;
          return 0;
        });
      }
    });

    // Flat list for panel (priority only, next 14 days)
    const earnings = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 14)
      .flatMap(([, items]) => items)
      .filter(e => e.isPriority)
      .slice(0, 20);

    return NextResponse.json({ earnings, grouped });
  } catch (error: any) {
    console.error('[Earnings]', error.message);
    return NextResponse.json({ error: error.message, earnings: [], grouped: {} }, { status: 500 });
  }
}
