import { NextResponse } from 'next/server';

const POLYGON_KEY = process.env.POLYGON_API_KEY;

type Category = 'metals' | 'equities' | 'crypto' | 'currencies' | 'bonds' | 'commodities';

// Only use tickers confirmed on Polygon free tier
const POLYGON_INSTRUMENTS: {
  ticker: string;
  label: string;
  category: Exclude<Category, 'currencies' | 'crypto'>;
}[] = [
  // EQUITIES - all major, confirmed on free tier
  { ticker: 'SPY',  label: 'S&P 500',        category: 'equities'    },
  { ticker: 'QQQ',  label: 'Nasdaq 100',      category: 'equities'    },
  { ticker: 'DIA',  label: 'Dow Jones',       category: 'equities'    },
  { ticker: 'IWM',  label: 'Russell 2000',    category: 'equities'    },
  { ticker: 'EFA',  label: 'Intl Stocks',     category: 'equities'    },
  { ticker: 'VWO',  label: 'Emerging Mkts',   category: 'equities'    },
  // METALS
  { ticker: 'GLD',  label: 'Gold',            category: 'metals'      },
  { ticker: 'SLV',  label: 'Silver',          category: 'metals'      },
  { ticker: 'GDX',  label: 'Gold Miners',     category: 'metals'      },
  { ticker: 'GDXJ', label: 'Jr Miners',       category: 'metals'      },
  // BONDS
  { ticker: 'TLT',  label: '20Y Treasury',    category: 'bonds'       },
  { ticker: 'IEF',  label: '10Y Treasury',    category: 'bonds'       },
  { ticker: 'SHY',  label: '2Y Treasury',     category: 'bonds'       },
  { ticker: 'HYG',  label: 'High Yield',      category: 'bonds'       },
  { ticker: 'LQD',  label: 'Corp Bonds',      category: 'bonds'       },
  // COMMODITIES
  { ticker: 'USO',  label: 'Oil (WTI)',       category: 'commodities' },
  { ticker: 'UNG',  label: 'Natural Gas',     category: 'commodities' },
  { ticker: 'DBA',  label: 'Agriculture',     category: 'commodities' },
  { ticker: 'GSG',  label: 'Commodities',     category: 'commodities' },
];

// Crypto instruments - Polygon snapshot works for these
const CRYPTO_INSTRUMENTS = [
  { ticker: 'BTC',  polyTicker: 'X:BTCUSD',  label: 'Bitcoin'   },
  { ticker: 'ETH',  polyTicker: 'X:ETHUSD',  label: 'Ethereum'  },
  { ticker: 'SOL',  polyTicker: 'X:SOLUSD',  label: 'Solana'    },
  { ticker: 'BNB',  polyTicker: 'X:BNBUSD',  label: 'BNB'       },
  { ticker: 'XRP',  polyTicker: 'X:XRPUSD',  label: 'XRP'       },
  { ticker: 'DOGE', polyTicker: 'X:DOGEUSD', label: 'Dogecoin'  },
];

// Currency pairs - use frankfurter.app (free, no key needed)
const CURRENCY_PAIRS = [
  { ticker: 'EUR/USD', base: 'EUR', quote: 'USD', label: 'Euro'         },
  { ticker: 'GBP/USD', base: 'GBP', quote: 'USD', label: 'Brit Pound'  },
  { ticker: 'JPY/USD', base: 'JPY', quote: 'USD', label: 'Japanese Yen'},
  { ticker: 'CHF/USD', base: 'CHF', quote: 'USD', label: 'Swiss Franc' },
  { ticker: 'AUD/USD', base: 'AUD', quote: 'USD', label: 'Aus Dollar'  },
  { ticker: 'CAD/USD', base: 'CAD', quote: 'USD', label: 'Can Dollar'  },
];

// Fetch stock/ETF last trading day (works on weekends)
async function fetchStockLastClose(ticker: string) {
  try {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 7);
    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromStr}/${toStr}?adjusted=true&sort=desc&limit=2&apiKey=${POLYGON_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data?.results;
    if (!results?.length) return null;

    const latest = results[0];
    const previous = results[1];
    if (!latest?.c) return null;

    return {
      c: latest.c,
      o: previous?.c ?? latest.o,
    };
  } catch {
    return null;
  }
}

// Fetch crypto via snapshot
async function fetchCryptoSnapshot(polyTicker: string) {
  try {
    const url = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers/${polyTicker}?apiKey=${POLYGON_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    const t = data?.ticker;
    if (!t) return null;
    const c = t.day?.c ?? t.prevDay?.c;
    const o = t.day?.o ?? t.prevDay?.o;
    if (!c || !o) return null;
    return { c, o };
  } catch {
    return null;
  }
}

// Fetch forex via frankfurter.app - FREE, no key needed
async function fetchForexRates() {
  try {
    // Get today's rates - returns all major pairs vs EUR base
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY,CHF,AUD,CAD',
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = await res.json();

    // Also get yesterday's rates for % change
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 3); // go back 3 days to handle weekends
    const yStr = yesterday.toISOString().split('T')[0];

    const prevRes = await fetch(
      `https://api.frankfurter.app/${yStr}?from=USD&to=EUR,GBP,JPY,CHF,AUD,CAD`,
      { cache: 'no-store' }
    );
    const prevData = prevRes.ok ? await prevRes.json() : null;

    return { current: data.rates, previous: prevData?.rates };
  } catch {
    return null;
  }
}

export async function GET() {
  if (!POLYGON_KEY) {
    return NextResponse.json({ error: 'POLYGON_API_KEY not set', markets: [] }, { status: 500 });
  }

  try {
    // Fetch all in parallel
    const [stockResults, cryptoResults, forexData] = await Promise.all([
      Promise.allSettled(POLYGON_INSTRUMENTS.map(inst => fetchStockLastClose(inst.ticker))),
      Promise.allSettled(CRYPTO_INSTRUMENTS.map(inst => fetchCryptoSnapshot(inst.polyTicker))),
      fetchForexRates(),
    ]);

    // Process stocks/ETFs
    const stockMarkets = stockResults
      .map((result, i) => {
        if (result.status === 'rejected' || !result.value) return null;
        const inst = POLYGON_INSTRUMENTS[i];
        if (!inst) return null;
        const { c, o } = result.value;
        if (!c || !o || o === 0) return null;
        const changePct = ((c - o) / o) * 100;
        return {
          ticker: inst.ticker,
          label: inst.label,
          category: inst.category as string,
          close: c,
          change: parseFloat((c - o).toFixed(2)),
          changePct: parseFloat(changePct.toFixed(2)),
          up: c >= o,
        };
      })
      .filter(Boolean);

    // Process crypto
    const cryptoMarkets = cryptoResults
      .map((result, i) => {
        if (result.status === 'rejected' || !result.value) return null;
        const inst = CRYPTO_INSTRUMENTS[i];
        if (!inst) return null;
        const { c, o } = result.value;
        if (!c || !o || o === 0) return null;
        const changePct = ((c - o) / o) * 100;
        return {
          ticker: inst.ticker,
          label: inst.label,
          category: 'crypto',
          close: c,
          change: parseFloat((c - o).toFixed(2)),
          changePct: parseFloat(changePct.toFixed(2)),
          up: c >= o,
        };
      })
      .filter(Boolean);

    // Process forex - frankfurter returns how many foreign units per USD
    // Invert to get USD per foreign unit
    const forexMarkets = forexData
      ? CURRENCY_PAIRS.map(pair => {
          const currCode = pair.base; // EUR, GBP, etc.
          const currentRate = forexData.current?.[currCode];
          const previousRate = forexData.previous?.[currCode];

          if (!currentRate) return null;

          // frankfurter returns: 1 USD = X foreign
          // Invert: 1 foreign = 1/X USD
          const close = 1 / currentRate;
          const prev = previousRate ? 1 / previousRate : close;
          const changePct = ((close - prev) / prev) * 100;

          return {
            ticker: pair.ticker,
            label: pair.label,
            category: 'currencies',
            close: parseFloat(close.toFixed(4)),
            change: parseFloat((close - prev).toFixed(4)),
            changePct: parseFloat(changePct.toFixed(2)),
            up: close >= prev,
          };
        }).filter(Boolean)
      : [];

    const markets = [...stockMarkets, ...cryptoMarkets, ...forexMarkets];
    console.log(`[Markets] ${markets.length} instruments loaded`);

    return NextResponse.json({ markets });
  } catch (error: any) {
    console.error('[Markets]', error.message);
    return NextResponse.json({ error: error.message, markets: [] }, { status: 500 });
  }
}
