import { NextResponse } from "next/server";
import { sql } from "../../lib/db.js";

export async function GET() {
  try {
    const allNotifications = await sql`
      SELECT id, user_id, type, title, message, link, icon_type, metadata,
             is_read, created_at, read_at
      FROM notifications
      WHERE user_id = 'default'
      ORDER BY created_at DESC
      LIMIT 50
    `;

    const unreadCount = allNotifications.filter((n) => !n.is_read).length;

    return NextResponse.json({
      notifications: allNotifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
