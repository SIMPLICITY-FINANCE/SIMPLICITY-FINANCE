import { Users } from "lucide-react";

interface Person {
  id: string;
  name: string;
  avatar: string;
  title: string;
  shows: string[];
  episodeCount: number;
}

// Demo people data — will be replaced with DB table when people data model is ready
const demoPeople: Person[] = [
  {
    id: "1",
    name: "Ray Dalio",
    avatar: "👨‍💼",
    title: "Founder of Bridgewater Associates",
    shows: ["The Compound and Friends", "All-In Podcast"],
    episodeCount: 3,
  },
  {
    id: "2",
    name: "Cathie Wood",
    avatar: "👩‍💼",
    title: "CEO of ARK Invest",
    shows: ["Coin Bureau", "All-In Podcast"],
    episodeCount: 2,
  },
  {
    id: "3",
    name: "Michael Burry",
    avatar: "👨",
    title: "Founder of Scion Asset Management",
    shows: ["Eurodollar University"],
    episodeCount: 1,
  },
  {
    id: "4",
    name: "Janet Yellen",
    avatar: "👩‍🦳",
    title: "U.S. Secretary of the Treasury",
    shows: ["All-In Podcast", "Eurodollar University"],
    episodeCount: 2,
  },
  {
    id: "5",
    name: "Josh Brown",
    avatar: "�‍�",
    title: "CEO of Ritholtz Wealth Management",
    shows: ["The Compound and Friends"],
    episodeCount: 4,
  },
  {
    id: "6",
    name: "Chamath Palihapitiya",
    avatar: "👨",
    title: "CEO of Social Capital",
    shows: ["All-In Podcast"],
    episodeCount: 3,
  },
  {
    id: "7",
    name: "Tracy Alloway",
    avatar: "�‍💼",
    title: "Bloomberg Reporter",
    shows: ["Odd Lots"],
    episodeCount: 5,
  },
  {
    id: "8",
    name: "Patrick O'Shaughnessy",
    avatar: "👨‍💻",
    title: "CEO of Positive Sum",
    shows: ["Invest Like the Best"],
    episodeCount: 2,
  },
];

export default function DiscoverPeoplePage() {
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
        People ({demoPeople.length})
      </h2>

      {demoPeople.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-muted-foreground text-lg mb-1">No people found</p>
          <p className="text-muted-foreground/70 text-sm">
            People will appear here as episodes are processed
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {demoPeople.map((person) => (
            <a
              key={person.id}
              href={`/discover/people/${person.id}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-200">
                {/* Person header */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-xl flex-shrink-0">
                    {person.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors truncate">
                      {person.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {person.episodeCount} episodes
                    </p>
                  </div>
                </div>

                {/* Shows */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {person.shows.join(", ")}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
