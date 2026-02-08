import { NextResponse } from 'next/server';
import { getAuthEnv } from '../../../lib/auth-env.js';

export async function GET() {
  const env = getAuthEnv();

  const envPresence = {
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[auth-health] envPresence', {
      NEXTAUTH_URL: envPresence.NEXTAUTH_URL ? 'SET' : 'NOT SET',
      NEXTAUTH_SECRET: envPresence.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      GOOGLE_CLIENT_ID: envPresence.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
      GOOGLE_CLIENT_SECRET: envPresence.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
    });
  }

  return NextResponse.json({
    ok: env.ok,
    missing: env.missing,
    envPresence,
    nodeEnv: process.env.NODE_ENV,
  });
}
