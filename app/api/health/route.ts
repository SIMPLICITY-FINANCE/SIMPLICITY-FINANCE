import { NextResponse } from 'next/server';
import { sql } from "../../lib/db.js";

export async function GET() {
  const timestamp = new Date().toISOString();
  
  try {
    // Simple query to verify connection
    await sql`SELECT 1 as health_check`;

    return NextResponse.json(
      {
        status: 'ok',
        timestamp,
        database: 'connected',
        version: '1.0.0',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp,
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
