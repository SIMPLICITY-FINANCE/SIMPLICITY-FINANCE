import { Users } from "lucide-react";
import { sql } from "../../../lib/db.js";

interface PersonRow {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  show_name: string;
}

export default async function DiscoverPeoplePage() {
  const peopleData = await sql<PersonRow[]>`
    SELECT
      s.id,
      s.host_name as name,
      s.host_slug as slug,
      s.host_image_url as image_url,
      s.name as show_name
    FROM shows s
    WHERE s.host_name IS NOT NULL
      AND s.host_slug IS NOT NULL
    ORDER BY s.name ASC
  `;

  // Deduplicate by host_slug in case same person hosts multiple shows
  const people = Array.from(
    new Map(peopleData.map(p => [p.slug, p])).values()
  );

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6">
        <a
          href="/discover/shows"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Shows
        </a>
        <a
          href="/discover/people"
          className="px-4 py-2 text-sm font-semibold text-foreground border-b-2 border-foreground"
        >
          People
        </a>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-foreground mb-6">
        People ({people.length})
      </h2>

      {people.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Users size={40} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-foreground text-lg mb-1">No hosts set yet</p>
          <p className="text-muted-foreground text-sm">
            Hosts are configured in the admin panel for each show
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {people.map((person) => {
            const displayImage = person.image_url;
            const hue = ((person.name?.charCodeAt(0) ?? 65) * 5) % 360;
            return (
              <a
                key={person.slug}
                href={`/discover/people/${person.slug}`}
                className="group block"
              >
                <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-200">
                  {/* Person header */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-border flex-shrink-0">
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center text-xl font-bold text-white"
                          style={{ background: `hsl(${hue}, 65%, 45%)` }}
                        >
                          {person.name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors truncate">
                        {person.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {person.show_name}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}
