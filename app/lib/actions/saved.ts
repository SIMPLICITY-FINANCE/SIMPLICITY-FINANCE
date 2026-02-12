"use server";

import { revalidatePath } from "next/cache";
import { sql } from "../db.js";

// For now, we'll use a hardcoded user ID since we don't have real auth yet
// In production, this would come from the session
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function saveEpisode(episodeId: string) {
  try {
    // Check if already saved
    const [existing] = await sql`
      SELECT id FROM saved_items 
      WHERE user_id = ${DEMO_USER_ID} 
        AND episode_id = ${episodeId}
        AND item_type = 'episode'
    `;

    if (existing) {
      return { success: true, message: "Already saved" };
    }

    await sql`
      INSERT INTO saved_items (user_id, item_type, episode_id)
      VALUES (${DEMO_USER_ID}, 'episode', ${episodeId})
    `;

    revalidatePath("/saved");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Episode saved" };
  } catch (error) {
    console.error("Error saving episode:", error);
    return { success: false, message: "Failed to save episode" };
  }
}

export async function unsaveEpisode(episodeId: string, formData: FormData): Promise<void> {
  "use server";
  
  try {
    await sql`
      DELETE FROM saved_items 
      WHERE user_id = ${DEMO_USER_ID} 
        AND episode_id = ${episodeId}
        AND item_type = 'episode'
    `;

    revalidatePath("/saved");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error unsaving episode:", error);
    throw error;
  }
}

export async function saveBulletToNotebook(bulletId: string) {
  try {
    // Check if already saved
    const [existing] = await sql`
      SELECT id FROM notebook_items 
      WHERE user_id = ${DEMO_USER_ID} 
        AND bullet_id = ${bulletId}
    `;

    if (existing) {
      return { success: true, message: "Already in notebook" };
    }

    await sql`
      INSERT INTO notebook_items (user_id, bullet_id)
      VALUES (${DEMO_USER_ID}, ${bulletId})
    `;

    revalidatePath("/notebook");
    
    return { success: true, message: "Added to notebook" };
  } catch (error) {
    console.error("Error saving bullet:", error);
    return { success: false, message: "Failed to save bullet" };
  }
}

export async function removeBulletFromNotebook(bulletId: string) {
  try {
    await sql`
      DELETE FROM notebook_items 
      WHERE user_id = ${DEMO_USER_ID} 
        AND bullet_id = ${bulletId}
    `;

    revalidatePath("/notebook");
    
    return { success: true, message: "Removed from notebook" };
  } catch (error) {
    console.error("Error removing bullet:", error);
    return { success: false, message: "Failed to remove bullet" };
  }
}

export async function getSavedEpisodeIds(): Promise<string[]> {
  try {
    const results = await sql<{ episode_id: string }[]>`
      SELECT episode_id 
      FROM saved_items 
      WHERE user_id = ${DEMO_USER_ID} 
        AND item_type = 'episode'
        AND episode_id IS NOT NULL
    `;
    
    return results.map(r => r.episode_id);
  } catch (error) {
    console.error("Error fetching saved episode IDs:", error);
    return [];
  }
}
