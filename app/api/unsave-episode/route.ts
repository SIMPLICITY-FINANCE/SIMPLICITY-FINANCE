import { NextResponse } from 'next/server';
import { sql } from "../../lib/db.js";

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function POST(request: Request) {
  try {
    const { episodeId } = await request.json();
    
    console.log('[UNSAVE] Request received for episode:', episodeId);
    console.log('[UNSAVE] User ID:', DEMO_USER_ID);
    
    // Delete the saved item
    const deleted = await sql`
      DELETE FROM saved_items 
      WHERE user_id = ${DEMO_USER_ID} 
        AND episode_id = ${episodeId}
        AND item_type = 'episode'
      RETURNING id
    `;

    if (deleted.length === 0) {
      console.log('[UNSAVE] ⚠️  No saved item found to delete');
      return NextResponse.json({ 
        success: true, 
        message: 'Episode was not saved',
        wasNotSaved: true 
      });
    }

    console.log('[UNSAVE] ✅ Successfully unsaved episode');
    console.log('[UNSAVE] Deleted saved item ID:', deleted[0]?.id);
    
    // Verify deletion
    const verify = await sql`
      SELECT COUNT(*) as count FROM saved_items 
      WHERE user_id = ${DEMO_USER_ID} AND item_type = 'episode'
    `;
    console.log('[UNSAVE] Total saved episodes remaining:', verify[0]?.count || 0);
    
    return NextResponse.json({ success: true, message: 'Episode unsaved' });
  } catch (error) {
    console.error('[UNSAVE] ❌ Error unsaving episode:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
