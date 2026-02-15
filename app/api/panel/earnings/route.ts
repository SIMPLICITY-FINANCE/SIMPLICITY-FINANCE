import { NextResponse } from 'next/server';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY ?? 'demo';

const PRIORITY_TICKERS = new Set([
  'AAPL', 'TSLA', 'NVDA', 'META', 'AMZN', 'MSFT', 'GOOGL', 'NFLX',
  'JPM', 'GS', 'BAC', 'MS', 'V', 'MA', 'AMD', 'INTC', 'ORCL', 'CRM',
  'UBER', 'COIN', 'PLTR', 'ARM', 'SMCI', 'SHOP', 'SNOW', 'NET', 'PANW',
]);

const COMPANY_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.', TSLA: 'Tesla', NVDA: 'Nvidia', META: 'Meta',
  AMZN: 'Amazon', MSFT: 'Microsoft', GOOGL: 'Alphabet', NFLX: 'Netflix',
  JPM: 'JPMorgan Chase', GS: 'Goldman Sachs', BAC: 'Bank of America',
  MS: 'Morgan Stanley', V: 'Visa', MA: 'Mastercard', AMD: 'AMD',
  INTC: 'Intel', ORCL: 'Oracle', CRM: 'Salesforce', UBER: 'Uber',
  COIN: 'Coinbase', PLTR: 'Palantir', ARM: 'ARM Holdings',
  SHOP: 'Shopify', SNOW: 'Snowflake', NET: 'Cloudflare', PANW: 'Palo Alto',
};

async function fetchFromAlphaVantage() {
  // Alpha Vantage earnings calendar - returns CSV, works on free tier
  // horizon=3month returns next 3 months of earnings
  const url = `https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&horizon=3month&apikey=${ALPHA_VANTAGE_KEY}`;
  
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Alpha Vantage error: ${res.status}`);
  
  const csv = await res.text();
  if (csv.includes('Invalid API') || csv.includes('premium')) {
    throw new Error('Alpha Vantage API key invalid or premium required');
  }
  
  // Parse CSV: symbol,name,reportDate,fiscalDateEnding,estimate,currency
  const lines = csv.trim().split('\n');
  if (lines.length < 2) throw new Error('Alpha Vantage returned empty CSV');
  
  const earnings: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length < 4) continue;
    
    const symbol = parts[0]?.trim();
    const name = parts[1]?.trim();
    const reportDate = parts[2]?.trim();
    const estimateStr = parts[4]?.trim();
    const estimate = estimateStr ? parseFloat(estimateStr) || null : null;
    
    if (!symbol || !reportDate) continue;
    
    earnings.push({
      symbol,
      name: COMPANY_NAMES[symbol] ?? name ?? symbol,
      date: reportDate,
      hour: '', // AV doesn't provide this
      epsEstimate: estimate,
      epsActual: null,
      surprise: null,
      isPriority: PRIORITY_TICKERS.has(symbol),
      quarter: null,
      year: new Date(reportDate).getFullYear(),
    });
  }
  
  return earnings;
}

async function fetchFromFinnhub() {
  if (!FINNHUB_KEY) throw new Error('No Finnhub key');
  
  const today = new Date().toISOString().split('T')[0];
  const future = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const res = await fetch(
    `https://finnhub.io/api/v1/calendar/earnings?from=${today}&to=${future}&token=${FINNHUB_KEY}`,
    { cache: 'no-store' }
  );
  
  if (!res.ok) throw new Error(`Finnhub error: ${res.status}`);
  const data = await res.json();
  
  if (!data.earningsCalendar?.length) throw new Error('Finnhub returned empty earnings');
  
  return data.earningsCalendar.map((e: any) => ({
    symbol: e.symbol,
    name: COMPANY_NAMES[e.symbol] ?? e.symbol,
    date: e.date,
    hour: e.hour ?? '',
    epsEstimate: e.epsEstimate ?? null,
    epsActual: e.epsActual ?? null,
    surprise: null,
    isPriority: PRIORITY_TICKERS.has(e.symbol),
    quarter: e.quarter ?? null,
    year: e.year ?? new Date(e.date).getFullYear(),
  }));
}

export async function GET() {
  try {
    let allEarnings: any[] = [];
    
    // Try Finnhub first, fall back to Alpha Vantage
    try {
      allEarnings = await fetchFromFinnhub();
      console.log('[Earnings] Using Finnhub, count:', allEarnings.length);
    } catch (finnhubErr) {
      console.log('[Earnings] Finnhub failed, trying Alpha Vantage:', (finnhubErr as Error).message);
      try {
        allEarnings = await fetchFromAlphaVantage();
        console.log('[Earnings] Using Alpha Vantage, count:', allEarnings.length);
      } catch (avErr) {
        console.log('[Earnings] Alpha Vantage failed:', (avErr as Error).message);
      }
    }

    if (allEarnings.length === 0) {
      return NextResponse.json({ earnings: [], grouped: {}, source: 'none' });
    }

    // Sort and group by date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureEarnings = allEarnings
      .filter(e => e.date && new Date(e.date + 'T12:00:00') >= today)
      .sort((a, b) => a.date.localeCompare(b.date));

    // Group by date
    const grouped: Record<string, any[]> = {};
    futureEarnings.forEach(e => {
      if (!grouped[e.date]) grouped[e.date] = [];
      const dateArray = grouped[e.date];
      if (dateArray) {
        dateArray.push(e);
      }
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

    // Panel flat list - all priority tickers upcoming
    const earnings = futureEarnings
      .filter(e => e.isPriority)
      .slice(0, 20);

    return NextResponse.json({ earnings, grouped });
  } catch (error: any) {
    console.error('[Earnings]', error.message);
    return NextResponse.json({ error: error.message, earnings: [], grouped: {} }, { status: 500 });
  }
}
