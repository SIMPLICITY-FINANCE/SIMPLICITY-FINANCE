import Link from "next/link.js";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "../../../../../lib/auth.js";
import { ShowForm } from "../../ShowForm.js";
import { notFound } from "next/navigation.js";
import { sql } from "../../../../../lib/db.js";

export default async function EditShowPage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const result = await sql`
    SELECT 
      id,
      name,
      description,
      ingest_enabled,
      ingest_source,
      youtube_channel_id,
      youtube_playlist_id,
      rss_feed_url,
      ingest_frequency
    FROM shows
    WHERE id = ${params.id}
  `;

  const show = result[0] as {
    id: string;
    name: string;
    description: string | null;
    ingest_enabled: boolean;
    ingest_source: string | null;
    youtube_channel_id: string | null;
    youtube_playlist_id: string | null;
    rss_feed_url: string | null;
    ingest_frequency: string | null;
  } | undefined;

  if (!show) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Show</h1>
              <p className="text-sm text-gray-600 mt-1">
                Update show configuration and ingestion settings
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin/shows"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shows
        </Link>

        <ShowForm show={show} />
      </main>
    </div>
  );
}
