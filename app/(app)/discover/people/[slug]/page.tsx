import Link from "next/link";
import { ArrowLeft, Mic2 } from "lucide-react";
import { sql } from "../../../../lib/db.js";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  
  // Find the show where host_slug matches
  const [show] = await sql`
    SELECT 
      id,
      name,
      channel_id,
      host_name,
      host_slug,
      host_image_url,
      channel_thumbnail
    FROM shows
    WHERE host_slug = ${slug}
      AND host_name IS NOT NULL
    LIMIT 1
  `;

  if (!show || !show.host_name) {
    notFound();
  }

  // Use host_image_url if set, otherwise fall back to show thumbnail
  const displayImage = show.host_image_url || show.channel_thumbnail;
  const initial = show.host_name[0].toUpperCase();

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      {/* Back button */}
      <Link
        href="/discover"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Discover
      </Link>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center text-center">
        {/* Photo */}
        <div className="w-32 h-32 rounded-full overflow-hidden bg-muted ring-4 ring-border mb-5 flex-shrink-0">
          {displayImage ? (
            <img
              src={displayImage}
              alt={show.host_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              {initial}
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="text-2xl font-bold text-foreground mb-1">
          {show.host_name}
        </h1>

        {/* Role */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Mic2 className="w-3.5 h-3.5" />
          <span>
            Host of{" "}
            <Link
              href={`/discover/shows/${show.channel_id}`}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {show.name}
            </Link>
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 pt-4 border-t border-border w-full justify-center">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Show</p>
            <p className="text-sm font-semibold text-foreground truncate max-w-32">{show.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
