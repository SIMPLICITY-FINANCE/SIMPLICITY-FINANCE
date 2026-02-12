import { NextResponse } from "next/server";
import { sql } from "../../lib/db.js";

export async function GET() {
  try {
    const feedEpisodes = await sql`
      SELECT 
        e.id as episode_id,
        COALESCE(e.youtube_title, 'Untitled Episode') as title,
        e.published_at,
        e.created_at,
        e.video_id,
        e.qc_score,
        e.qc_status,
        e.youtube_channel_title,
        e.youtube_description,
        e.youtube_thumbnail_url,
        s.id as summary_id,
        (
          SELECT json_build_object(
            'version', s.version,
            'videoId', s.video_id,
            'title', s.title,
            'publishedAt', s.published_at,
            'sections', (
              SELECT json_agg(
                json_build_object(
                  'name', sb.section_name,
                  'bullets', (
                    SELECT json_agg(
                      json_build_object(
                        'text', sb2.bullet_text,
                        'confidence', sb2.confidence
                      ) ORDER BY sb2.created_at
                    )
                    FROM summary_bullets sb2
                    WHERE sb2.summary_id = s.id AND sb2.section_name = sb.section_name
                  )
                )
              )
              FROM (
                SELECT DISTINCT section_name
                FROM summary_bullets
                WHERE summary_id = s.id
                ORDER BY section_name
              ) sb
            ),
            'keyQuotes', (
              SELECT json_agg(
                json_build_object(
                  'text', bullet_text,
                  'speaker', 'Unknown'
                )
              )
              FROM summary_bullets
              WHERE summary_id = s.id AND section_name = 'KEY QUOTES'
              LIMIT 10
            )
          )
          FROM episode_summary s
          WHERE s.episode_id = e.id
          LIMIT 1
        ) as summary_json
      FROM episodes e
      LEFT JOIN episode_summary s ON s.episode_id = e.id
      WHERE e.is_published = true
        AND s.id IS NOT NULL
      ORDER BY COALESCE(e.published_at, e.created_at) DESC
      LIMIT 50
    `;

    return NextResponse.json(feedEpisodes);
  } catch (error) {
    console.error("Failed to fetch feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
