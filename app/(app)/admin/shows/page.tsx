import { requireAdmin } from "../../../lib/auth.js";
import Link from "next/link.js";
import { ArrowLeft } from "lucide-react";
import { AddShowDialog } from "./AddShowDialog.js";
import { ShowRow } from "./ShowRow.js";
import { sql } from "../../../lib/db.js";

interface ShowData {
  id: string;
  name: string;
  channel_id: string;
  channel_handle: string | null;
  channel_url: string;
  channel_thumbnail: string | null;
  subscriber_count: number | null;
  source_type: string;
  status: string;
  last_videos_to_ingest: number | null;
  last_ingested_at: string | null;
  last_checked_at: string | null;
  total_episodes_ingested: number | null;
  created_at: string;
  episode_count: number;
  host_name: string | null;
  host_slug: string | null;
  host_image_url: string | null;
}

export default async function AdminShowsPage() {
  await requireAdmin();

  const shows = await sql<ShowData[]>`
    SELECT 
      s.id,
      s.name,
      s.channel_id,
      s.channel_handle,
      s.channel_url,
      s.channel_thumbnail,
      s.subscriber_count,
      s.source_type,
      s.status,
      s.last_videos_to_ingest,
      s.last_ingested_at,
      s.last_checked_at,
      s.total_episodes_ingested,
      s.created_at,
      s.host_name,
      s.host_slug,
      s.host_image_url,
      COALESCE((
        SELECT COUNT(*)::int FROM episodes e WHERE e.youtube_channel_id = s.channel_id
      ), 0) as episode_count
    FROM shows s
    ORDER BY s.created_at DESC
  `;

  const enabledCount = shows.filter(s => s.status === "enabled").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Shows Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {shows.length} show{shows.length !== 1 ? "s" : ""} • {enabledCount} enabled
              </p>
            </div>
            <AddShowDialog />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>

        {shows.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">📺</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No shows yet</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Add your first YouTube channel to start automatic episode ingestion.
              We'll fetch channel info and latest videos automatically.
            </p>
            <AddShowDialog />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_100px_80px_120px_100px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div>Show</div>
              <div>Status</div>
              <div>Episodes</div>
              <div>Last Ingested</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {shows.map((show) => (
                <ShowRow key={show.id} show={show} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
