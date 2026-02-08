import { NextResponse } from 'next/server';
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function GET() {
  try {
    console.log('[SAVED/IDS] Fetching saved episode IDs for user:', DEMO_USER_ID);
    
    const results = await sql`
      SELECT episode_id 
      FROM saved_items 
      WHERE user_id = ${DEMO_USER_ID} 
        AND item_type = 'episode'
        AND episode_id IS NOT NULL
    `;
    
    const ids = results.map(r => r.episode_id);
    
    console.log('[SAVED/IDS] ✅ Found', ids.length, 'saved episode IDs');
    if (ids.length > 0) {
      console.log('[SAVED/IDS] First 10 IDs:', ids.slice(0, 10));
    }

    return NextResponse.json({ ids });
  } catch (error) {
    console.error('[SAVED/IDS] ❌ Error fetching saved IDs:', error);
    return NextResponse.json(
      { ids: [], error: 'Failed to fetch saved IDs' },
      { status: 500 }
    );
  }
}
