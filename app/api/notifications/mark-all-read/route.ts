import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

export async function POST() {
  try {
    await sql`
      UPDATE notifications
      SET is_read = true,
          read_at = NOW()
      WHERE user_id = 'default'
        AND is_read = false
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark all as read" },
      { status: 500 }
    );
  }
}
