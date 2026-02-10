import { NextResponse } from 'next/server';
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

export async function GET() {
  try {
    const demoUserId = "00000000-0000-0000-0000-000000000001";
    
    // Check if demo user exists
    const [user] = await sql`
      SELECT id, email, name FROM users 
      WHERE id = ${demoUserId}
    `;
    
    if (!user) {
      // Create demo user if it doesn't exist
      await sql`
        INSERT INTO users (id, email, name, role)
        VALUES (${demoUserId}, 'demo@simplicity.finance', 'Demo User', 'user')
      `;
      return NextResponse.json({ 
        message: "Demo user created", 
        userId: demoUserId 
      });
    }
    
    return NextResponse.json({ 
      message: "Demo user exists", 
      user: user 
    });
  } catch (error) {
    console.error('Error checking demo user:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
