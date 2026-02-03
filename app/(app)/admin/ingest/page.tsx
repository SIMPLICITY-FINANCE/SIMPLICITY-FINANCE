import postgres from "postgres";
import { AdminIngestTable } from "./AdminIngestTable.js";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface IngestRequest {
  id: string;
  user_id: string;
  url: string;
  source: string;
  status: string;
  stage: string | null;
  created_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
  error_message: string | null;
  error_details: any;
  episode_id: string | null;
  inngest_event_id: string | null;
  updated_at: Date;
}

export default async function AdminIngestPage() {
  // Fetch all ingest requests (not filtered by user)
  const requests = await sql<IngestRequest[]>`
    SELECT 
      id,
      user_id,
      url,
      source,
      status,
      stage,
      created_at,
      started_at,
      completed_at,
      error_message,
      error_details,
      episode_id,
      inngest_event_id,
      updated_at
    FROM ingest_requests
    ORDER BY created_at DESC
    LIMIT 50
  `;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Ingest Management
        </h1>
        <p className="text-muted-foreground text-sm">
          Monitor and manage all content ingest requests across the platform.
        </p>
      </div>

      <AdminIngestTable initialRequests={requests} />
    </div>
  );
}
