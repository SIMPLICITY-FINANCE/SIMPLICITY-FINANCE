import { NextResponse } from 'next/server';
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

export async function GET() {
  try {
    // Test database connection
    const result = await sql`SELECT NOW() as current_time`;
    
    // Test users table
    const users = await sql`SELECT COUNT(*) as user_count FROM users`;
    
    return NextResponse.json({ 
      success: true, 
      time: result[0].current_time,
      userCount: users[0].user_count
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
