import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card } from "../../../components/ui/Card.js";
import { Chip } from "../../../components/ui/Chip.js";

// Demo people data (matches discover page)
const demoPeople = [
  {
    id: "1",
    name: "Josh Brown",
    avatar: "👨‍💼",
    shows: ["The Compound", "Animal Spirits"],
    episodeCount: 42,
    bio: "Financial advisor, author, and co-host of The Compound and Friends podcast. Known for practical investment advice and market commentary.",
  },
  {
    id: "2",
    name: "Tracy Alloway",
    avatar: "👩‍💼",
    shows: ["Odd Lots"],
    episodeCount: 38,
    bio: "Co-host of Bloomberg's Odd Lots podcast. Covers markets, finance, and economics with deep dives into complex topics.",
  },
  {
    id: "3",
    name: "Chamath Palihapitiya",
    avatar: "👨",
    shows: ["All-In Podcast"],
    episodeCount: 25,
    bio: "Venture capitalist and tech entrepreneur. Co-host of the All-In Podcast discussing tech, markets, and current events.",
  },
  {
    id: "4",
    name: "Barry Ritholtz",
    avatar: "👨‍🦳",
    shows: ["Masters in Business"],
    episodeCount: 31,
    bio: "Founder of Ritholtz Wealth Management and host of Masters in Business. Interviews leading figures in finance and investing.",
  },
  {
    id: "5",
    name: "Patrick O'Shaughnessy",
    avatar: "👨‍💻",
    shows: ["Invest Like the Best"],
    episodeCount: 28,
    bio: "CEO of Positive Sum and host of Invest Like the Best. Explores business, investing, and decision-making.",
  },
];

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const person = demoPeople.find((p) => p.id === id);

  if (!person) {
    notFound();
  }

  return (
    <>
      {/* Back Navigation */}
      <div className="mb-4">
        <a
          href="/discover?tab=people"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to People
        </a>
      </div>

      {/* Person Header */}
      <Card className="mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-5xl flex-shrink-0">
            {person.avatar}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {person.name}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">{person.bio}</p>
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {person.shows.map((show, idx) => (
                  <Chip key={idx}>{show}</Chip>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                • {person.episodeCount} episodes
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Episodes List (Placeholder) */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Recent Episodes
        </h2>
      </div>

      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg mb-2">
          Episode list coming soon
        </p>
        <p className="text-muted-foreground/70 text-sm">
          We're working on linking episodes to specific hosts and guests
        </p>
      </Card>
    </>
  );
}
