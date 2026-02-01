import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

export async function GET() {
  try {
    const requests = await sql`
      SELECT 
        id,
        user_id,
        url,
        source,
        status,
        created_at,
        started_at,
        completed_at,
        error_message,
        error_details,
        episode_id,
        inngest_event_id
      FROM ingest_requests
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Failed to fetch ingest requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
