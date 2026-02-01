"use server";

import { inngest } from "../../../inngest/client.js";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

interface RetryResult {
  success: boolean;
  error?: string;
}

export async function retryIngestRequest(requestId: string): Promise<RetryResult> {
  try {
    // Get the original request
    const [request] = await sql<Array<{ id: string; url: string; status: string }>>`
      SELECT id, url, status
      FROM ingest_requests
      WHERE id = ${requestId}
      LIMIT 1
    `;

    if (!request) {
      return {
        success: false,
        error: "Request not found",
      };
    }

    // Reset status to queued
    await sql`
      UPDATE ingest_requests
      SET status = 'queued',
          error_message = NULL,
          error_details = NULL,
          started_at = NULL,
          completed_at = NULL,
          updated_at = NOW()
      WHERE id = ${requestId}
    `;

    // Re-trigger Inngest workflow
    const { ids } = await inngest.send({
      name: "episode/submitted",
      data: { 
        url: request.url,
        requestId: request.id,
      },
    });

    const inngestEventId = ids?.[0];

    // Update with new Inngest event ID
    if (inngestEventId) {
      await sql`
        UPDATE ingest_requests
        SET inngest_event_id = ${inngestEventId},
            updated_at = NOW()
        WHERE id = ${requestId}
      `;
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Retry ingest request error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retry request",
    };
  }
}

export async function deleteIngestRequest(requestId: string): Promise<RetryResult> {
  try {
    await sql`
      DELETE FROM ingest_requests
      WHERE id = ${requestId}
    `;

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete ingest request error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete request",
    };
  }
}
