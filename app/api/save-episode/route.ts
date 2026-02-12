import { NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";
import { sql } from "../../lib/db.js";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function POST(request: Request) {
  try {
    const { episodeId } = await request.json();
    
    console.log('[SAVE] Request received for episode:', episodeId);
    console.log('[SAVE] User ID:', DEMO_USER_ID);
    
    // Check if already saved
    const [existing] = await sql`
      SELECT id FROM saved_items 
      WHERE user_id = ${DEMO_USER_ID} 
        AND episode_id = ${episodeId}
        AND item_type = 'episode'
    `;

    if (existing) {
      console.log('[SAVE] Episode already saved, ID:', existing.id);
      return NextResponse.json({ success: true, message: 'Already saved', alreadyExists: true });
    }

    // Insert new saved item
    const inserted = await sql`
      INSERT INTO saved_items (user_id, item_type, episode_id)
      VALUES (${DEMO_USER_ID}, 'episode', ${episodeId})
      RETURNING id, created_at
    `;

    if (!inserted[0]) {
      throw new Error('Failed to insert saved item');
    }

    console.log('[SAVE] ✅ Successfully saved episode');
    console.log('[SAVE] Saved item ID:', inserted[0].id);
    console.log('[SAVE] Created at:', inserted[0].created_at);
    
    // Verify it was saved
    const verify = await sql`
      SELECT COUNT(*) as count FROM saved_items 
      WHERE user_id = ${DEMO_USER_ID} AND item_type = 'episode'
    `;
    console.log('[SAVE] Total saved episodes for user:', verify[0]?.count || 0);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Episode saved',
      savedItemId: inserted[0].id 
    });
  } catch (error) {
    console.error('[SAVE] ❌ Error saving episode:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
