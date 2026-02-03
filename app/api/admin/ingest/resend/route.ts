import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";
import { inngest } from "../../../../../inngest/client.js";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { error: "requestId is required" },
        { status: 400 }
      );
    }

    // Fetch the ingest request
    const [ingestRequest] = await sql<
      Array<{
        id: string;
        url: string;
        status: string;
      }>
    >`
      SELECT id, url, status
      FROM ingest_requests
      WHERE id = ${requestId}
    `;

    if (!ingestRequest) {
      return NextResponse.json(
        { error: "Ingest request not found" },
        { status: 404 }
      );
    }

    // Send event to Inngest
    const { ids } = await inngest.send({
      name: "episode/submitted",
      data: {
        requestId: ingestRequest.id,
        url: ingestRequest.url,
      },
    });

    const newEventId = ids[0] || null;

    // Update the request with new event ID and reset timestamps
    await sql`
      UPDATE ingest_requests
      SET 
        status = 'queued',
        stage = NULL,
        inngest_event_id = ${newEventId ?? null},
        started_at = NULL,
        completed_at = NULL,
        error_message = NULL,
        error_details = NULL,
        updated_at = NOW()
      WHERE id = ${requestId}
    `;

    console.log(`[resend] Request ${requestId} resent with event ID ${newEventId}`);

    return NextResponse.json({
      success: true,
      eventId: newEventId,
      requestId,
    });
  } catch (error: any) {
    console.error("Failed to resend ingest request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to resend request" },
      { status: 500 }
    );
  }
}
