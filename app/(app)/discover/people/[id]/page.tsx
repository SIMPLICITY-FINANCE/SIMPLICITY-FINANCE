import { Card } from "../../../../components/ui/Card.js";
import { Chip } from "../../../../components/ui/Chip.js";
import { Button } from "../../../../components/ui/Button.js";
import { ArrowLeft, Bookmark } from "lucide-react";
import { notFound } from "next/navigation";

interface Person {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  shows: Array<{ name: string; role: string }>;
  episodeCount: number;
}

// TODO: Replace with real DB table when people data model is ready
const demoPeople: Record<string, Person> = {
  "1": {
    id: "1",
    name: "Josh Brown",
    avatar: "👨‍💼",
    bio: "CEO of Ritholtz Wealth Management and co-host of The Compound. Known for his insights on markets, investing, and financial planning.",
    shows: [
      { name: "The Compound", role: "Co-host" },
      { name: "Animal Spirits", role: "Co-host" },
    ],
    episodeCount: 42,
  },
  "2": {
    id: "2",
    name: "Tracy Alloway",
    avatar: "👩‍💼",
    bio: "Bloomberg reporter and co-host of Odd Lots. Covers markets, economics, and finance with deep dives into complex topics.",
    shows: [
      { name: "Odd Lots", role: "Co-host" },
    ],
    episodeCount: 38,
  },
  "3": {
    id: "3",
    name: "Chamath Palihapitiya",
    avatar: "👨",
    bio: "Founder and CEO of Social Capital. Former Facebook executive and venture capitalist focused on technology and markets.",
    shows: [
      { name: "All-In Podcast", role: "Co-host" },
    ],
    episodeCount: 25,
  },
  "4": {
    id: "4",
    name: "Barry Ritholtz",
    avatar: "👨‍🦳",
    bio: "Chairman and CIO of Ritholtz Wealth Management. Host of Masters in Business, interviewing leaders in finance and business.",
    shows: [
      { name: "Masters in Business", role: "Host" },
    ],
    episodeCount: 31,
  },
  "5": {
    id: "5",
    name: "Patrick O'Shaughnessy",
    avatar: "👨‍💻",
    bio: "CEO of Positive Sum and host of Invest Like the Best. Explores investing, business, and decision-making with top investors.",
    shows: [
      { name: "Invest Like the Best", role: "Host" },
    ],
    episodeCount: 28,
  },
};

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = demoPeople[id];

  if (!person) {
    notFound();
  }

  return (
    <>
      {/* Back Button */}
      <div className="mb-6">
        <a
          href="/discover/people"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to People
        </a>
      </div>

      {/* Person Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-6xl flex-shrink-0">
            {person.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground mb-3">
              {person.name}
            </h1>
            
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {person.bio}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4">
              <Chip>{person.episodeCount} episodes</Chip>
              <Chip>{person.shows.length} shows</Chip>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm">
                <Bookmark size={16} className="mr-2" />
                Follow
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Shows Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Shows
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {person.shows.map((show, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {show.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {show.role}
                  </p>
                </div>
                <Chip>Active</Chip>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Mentions Placeholder */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Recent Episodes
        </h2>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg mb-2">
            Episode mentions coming soon
          </p>
          <p className="text-muted-foreground/70 text-sm">
            We're working on linking people to specific episode appearances and mentions
          </p>
        </Card>
      </div>
    </>
  );
}
