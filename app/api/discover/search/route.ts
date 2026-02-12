import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../../lib/db.js";

interface ShowResult {
  id: string;
  name: string;
  channel_id: string;
  channel_thumbnail: string | null;
  episode_count: number;
}

interface EpisodeResult {
  id: string;
  youtube_title: string;
  youtube_thumbnail_url: string | null;
  published_at: string | null;
  show_name: string | null;
  channel_id: string | null;
}

interface PersonResult {
  id: string;
  name: string;
  slug: string;
  avatar_url: string | null;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ shows: [], episodes: [], people: [] });
  }

  const searchTerm = `%${query}%`;

  try {
    const [showResults, episodeResults, peopleResults] = await Promise.all([
      // Search shows by name
      sql<ShowResult[]>`
        SELECT * FROM (
          SELECT DISTINCT ON (s.channel_id)
            s.channel_id as id,
            s.name,
            s.channel_id,
            s.channel_thumbnail,
            (
              SELECT COUNT(*)::int FROM episodes e
              WHERE e.youtube_channel_id = s.channel_id AND e.is_published = true
            ) as episode_count
          FROM shows s
          WHERE s.name ILIKE ${searchTerm}
          ORDER BY s.channel_id
        ) sub
        ORDER BY sub.episode_count DESC
        LIMIT 4
      `,

      // Search episodes by title and summary bullet text
      sql<EpisodeResult[]>`
        SELECT DISTINCT ON (e.id)
          e.id,
          e.youtube_title,
          e.youtube_thumbnail_url,
          e.published_at::text as published_at,
          sh.name as show_name,
          sh.channel_id
        FROM episodes e
        LEFT JOIN shows sh ON e.youtube_channel_id = sh.channel_id
        LEFT JOIN episode_summary es ON es.episode_id = e.id
        LEFT JOIN summary_bullets sb ON sb.summary_id = es.id
        WHERE e.is_published = true
          AND (
            e.youtube_title ILIKE ${searchTerm}
            OR sb.bullet_text ILIKE ${searchTerm}
          )
        ORDER BY e.id, e.published_at DESC
        LIMIT 5
      `,

      // Search people by name
      sql<PersonResult[]>`
        SELECT id, name, slug, avatar_url
        FROM people
        WHERE name ILIKE ${searchTerm}
        LIMIT 3
      `,
    ]);

    return NextResponse.json({
      shows: showResults,
      episodes: episodeResults,
      people: peopleResults,
      query,
    });
  } catch (error) {
    console.error("[SEARCH] Error:", error);
    return NextResponse.json(
      { error: "Search failed", shows: [], episodes: [], people: [] },
      { status: 500 }
    );
  }
}
