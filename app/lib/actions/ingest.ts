"use server";

import { inngest } from "../../../inngest/client.js";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

// Mock user ID for demo (in production, get from auth session)
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

interface IngestResult {
  success: boolean;
  error?: string;
  requestId?: string;
  isExisting?: boolean;
}

export async function submitIngestRequest(url: string): Promise<IngestResult> {
  try {
    // Validate URL format
    const urlObj = new URL(url);
    
    // Determine source type
    let source: "youtube" | "audio";
    const videoId = extractYouTubeVideoId(url);
    
    if (videoId) {
      source = "youtube";
    } else if (isAudioUrl(url)) {
      source = "audio";
    } else {
      return {
        success: false,
        error: "Unsupported URL type. Please provide a YouTube URL or direct audio file URL.",
      };
    }

    // Check if URL already submitted (idempotent)
    const existing = await sql<Array<{ id: string; status: string }>>`
      SELECT id, status
      FROM ingest_requests
      WHERE url = ${url}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return {
        success: true,
        requestId: existing[0]!.id,
        isExisting: true,
      };
    }

    // Create ingest request record
    const [request] = await sql<Array<{ id: string }>>`
      INSERT INTO ingest_requests (user_id, url, source, status)
      VALUES (${DEMO_USER_ID}, ${url}, ${source}, 'queued')
      RETURNING id
    `;

    if (!request?.id) {
      return {
        success: false,
        error: "Failed to create ingest request",
      };
    }

    // Trigger Inngest workflow
    const { ids } = await inngest.send({
      name: "episode/submitted",
      data: { 
        url,
        requestId: request.id,
      },
    });

    const inngestEventId = ids?.[0];

    // Update request with Inngest event ID
    if (inngestEventId) {
      await sql`
        UPDATE ingest_requests
        SET inngest_event_id = ${inngestEventId},
            updated_at = NOW()
        WHERE id = ${request.id}
      `;
    }

    return {
      success: true,
      requestId: request.id,
    };
  } catch (error) {
    console.error("Submit ingest request error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit ingest request",
    };
  }
}

function extractYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle youtu.be/VIDEO_ID
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }
    
    // Handle youtube.com/watch?v=VIDEO_ID
    if (urlObj.hostname.includes("youtube.com")) {
      const v = urlObj.searchParams.get("v");
      if (v) return v;
      
      // Handle youtube.com/embed/VIDEO_ID
      const parts = urlObj.pathname.split("/").filter(Boolean);
      const embedIndex = parts.indexOf("embed");
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        return parts[embedIndex + 1] ?? null;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

function isAudioUrl(url: string): boolean {
  const audioExtensions = [".mp3", ".m4a", ".wav", ".ogg", ".flac", ".aac"];
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    return audioExtensions.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}
