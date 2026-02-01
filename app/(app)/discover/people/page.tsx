import { Card } from "../../../components/ui/Card.js";
import { Chip } from "../../../components/ui/Chip.js";

interface Person {
  id: string;
  name: string;
  avatar: string;
  shows: string[];
  episodeCount: number;
}

// TODO: Replace with real DB table when people data model is ready
const demoPeople: Person[] = [
  {
    id: "1",
    name: "Josh Brown",
    avatar: "👨‍💼",
    shows: ["The Compound", "Animal Spirits"],
    episodeCount: 42,
  },
  {
    id: "2",
    name: "Tracy Alloway",
    avatar: "👩‍💼",
    shows: ["Odd Lots"],
    episodeCount: 38,
  },
  {
    id: "3",
    name: "Chamath Palihapitiya",
    avatar: "👨",
    shows: ["All-In Podcast"],
    episodeCount: 25,
  },
  {
    id: "4",
    name: "Barry Ritholtz",
    avatar: "👨‍🦳",
    shows: ["Masters in Business"],
    episodeCount: 31,
  },
  {
    id: "5",
    name: "Patrick O'Shaughnessy",
    avatar: "👨‍💻",
    shows: ["Invest Like the Best"],
    episodeCount: 28,
  },
];

export default function DiscoverPeoplePage() {
  return (
    <>
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-100">
        <a
          href="/discover/shows"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Shows
        </a>
        <a
          href="/discover/people"
          className="px-4 py-2 text-sm font-medium text-foreground border-b-2 border-primary transition-colors"
        >
          People
        </a>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            People ({demoPeople.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoPeople.map((person) => (
            <a
              key={person.id}
              href={`/discover/people/${person.id}`}
              className="block"
            >
              <Card className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                    {person.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {person.name}
                    </h3>
                    <Chip>{person.episodeCount} episodes</Chip>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Shows: </span>
                  {person.shows.join(", ")}
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
