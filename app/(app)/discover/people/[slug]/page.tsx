import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      slug,
      host_name,
      host_slug,
      host_image_url
    FROM shows
    WHERE host_slug = ${slug}
      AND host_name IS NOT NULL
    LIMIT 1
  `;

  if (!show || !show.host_name) {
    notFound();
  }

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
        <div className="w-32 h-32 rounded-full overflow-hidden bg-muted ring-4 ring-border mb-5">
          {show.host_image_url ? (
            <img
              src={show.host_image_url}
              alt={show.host_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-muted-foreground bg-gradient-to-br from-blue-500/20 to-blue-700/20">
              {show.host_name[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="text-2xl font-bold text-foreground mb-1">
          {show.host_name}
        </h1>

        {/* Show name */}
        <p className="text-sm text-muted-foreground mb-6">
          Host of{" "}
          <Link
            href={`/discover/shows/${show.slug}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {show.name}
          </Link>
        </p>
      </div>
    </div>
  );
}
