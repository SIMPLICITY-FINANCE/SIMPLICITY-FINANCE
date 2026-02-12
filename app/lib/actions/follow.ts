"use server";

import { sql } from "../db.js";

// Mock user ID for demo (in production, get from auth session)
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function followShow(channelId: string, channelTitle: string) {
  try {
    await sql`
      INSERT INTO followed_shows (user_id, youtube_channel_id, youtube_channel_title)
      VALUES (${DEMO_USER_ID}, ${channelId}, ${channelTitle})
      ON CONFLICT (user_id, youtube_channel_id) DO NOTHING
    `;
    return { success: true };
  } catch (error) {
    console.error("Error following show:", error);
    return { success: false, error: "Failed to follow show" };
  }
}

export async function unfollowShow(channelId: string) {
  try {
    await sql`
      DELETE FROM followed_shows
      WHERE user_id = ${DEMO_USER_ID}
        AND youtube_channel_id = ${channelId}
    `;
    return { success: true };
  } catch (error) {
    console.error("Error unfollowing show:", error);
    return { success: false, error: "Failed to unfollow show" };
  }
}

export async function isFollowingShow(channelId: string): Promise<boolean> {
  try {
    const result = await sql<Array<{ count: number }>>`
      SELECT COUNT(*) as count
      FROM followed_shows
      WHERE user_id = ${DEMO_USER_ID}
        AND youtube_channel_id = ${channelId}
    `;
    return (result[0]?.count ?? 0) > 0;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

export async function followPerson(personId: string, personName: string) {
  try {
    await sql`
      INSERT INTO followed_people (user_id, person_id, person_name)
      VALUES (${DEMO_USER_ID}, ${personId}, ${personName})
      ON CONFLICT (user_id, person_id) DO NOTHING
    `;
    return { success: true };
  } catch (error) {
    console.error("Error following person:", error);
    return { success: false, error: "Failed to follow person" };
  }
}

export async function unfollowPerson(personId: string) {
  try {
    await sql`
      DELETE FROM followed_people
      WHERE user_id = ${DEMO_USER_ID}
        AND person_id = ${personId}
    `;
    return { success: true };
  } catch (error) {
    console.error("Error unfollowing person:", error);
    return { success: false, error: "Failed to unfollow person" };
  }
}

export async function isFollowingPerson(personId: string): Promise<boolean> {
  try {
    const result = await sql<Array<{ count: number }>>`
      SELECT COUNT(*) as count
      FROM followed_people
      WHERE user_id = ${DEMO_USER_ID}
        AND person_id = ${personId}
    `;
    return (result[0]?.count ?? 0) > 0;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}
