import Link from "next/link.js";
import { ArrowLeft } from "lucide-react";
import { AdminIngestTable } from "./AdminIngestTable.js";
import { sql } from "../../../lib/db.js";

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
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin
      </Link>

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
