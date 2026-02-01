import postgres from "postgres";
import { Card } from "../../components/ui/Card.js";
import { Chip } from "../../components/ui/Chip.js";
import { Input } from "../../components/ui/Input.js";
import { Button } from "../../components/ui/Button.js";
import { Search as SearchIcon } from "lucide-react";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

interface SearchResult {
  id: string;
  episode_id: string;
  title: string;
  published_at: string;
  video_id: string;
  result_type: string;
  match_text: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  let results: SearchResult[] = [];

  if (query.length >= 2) {
    // Search in episode titles and summary bullets
    results = await sql<SearchResult[]>`
      SELECT 
        s.id,
        s.episode_id,
        s.title,
        s.published_at,
        s.video_id,
        'episode' as result_type,
        s.title as match_text
      FROM episode_summary s
      WHERE s.approval_status = 'approved'
        AND s.title ILIKE ${`%${query}%`}
      
      UNION ALL
      
      SELECT 
        sb.id,
        s.episode_id,
        s.title,
        s.published_at,
        s.video_id,
        'bullet' as result_type,
        sb.bullet_text as match_text
      FROM summary_bullets sb
      JOIN episode_summary s ON sb.summary_id = s.id
      WHERE s.approval_status = 'approved'
        AND sb.bullet_text ILIKE ${`%${query}%`}
      
      LIMIT 50
    `;
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Search Results</h2>
        
        <form method="GET" action="/search" className="mb-4">
          <div className="flex gap-2">
            <Input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search episodes and key points..."
              icon={<SearchIcon size={20} />}
              autoFocus
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </div>
        </form>

        {query && (
          <p className="text-sm text-muted-foreground">
            {results.length} results for "{query}"
          </p>
        )}
      </div>

      {!query ? (
        <Card className="p-12 text-center">
          <SearchIcon size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-2">Search episodes and insights</p>
          <p className="text-muted-foreground/70 text-sm">
            Enter a keyword to search across episode titles and key points
          </p>
        </Card>
      ) : results.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg mb-2">No results found</p>
          <p className="text-muted-foreground/70 text-sm">
            Try different keywords or check your spelling
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <Card key={`${result.result_type}-${result.id}`} className="p-6">
              <div className="flex items-start gap-3">
                <Chip>
                  {result.result_type === 'episode' ? 'Episode' : 'Key Point'}
                </Chip>
                <div className="flex-1 min-w-0">
                  <a 
                    href={`/episode/${result.episode_id}`}
                    className="text-base font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {result.title}
                  </a>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {result.match_text}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <span>
                      {new Date(result.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span>•</span>
                    <a
                      href={`/episode/${result.episode_id}`}
                      className="text-primary hover:underline"
                    >
                      View Episode →
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
