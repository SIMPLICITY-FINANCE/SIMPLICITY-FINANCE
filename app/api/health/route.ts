import { NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  try {
    // Test database connection
    const sql = postgres(process.env.DATABASE_URL!, {
      max: 1,
      idle_timeout: 5,
      connect_timeout: 5,
    });

    // Simple query to verify connection
    await sql`SELECT 1 as health_check`;
    
    // Close connection
    await sql.end();

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
