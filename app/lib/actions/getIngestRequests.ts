"use server";

import { sql } from "../db.js";

// Mock user ID for demo (in production, get from auth session)
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export interface IngestRequest {
  id: string;
  url: string;
  source: string;
  status: string;
  created_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
  error_message: string | null;
  error_details: any;
  episode_id: string | null;
  inngest_event_id: string | null;
}

export async function getIngestRequests(): Promise<IngestRequest[]> {
  const requests = await sql<IngestRequest[]>`
    SELECT 
      id,
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
    WHERE user_id = ${DEMO_USER_ID}
    ORDER BY created_at DESC
    LIMIT 10
  `;

  return requests;
}
