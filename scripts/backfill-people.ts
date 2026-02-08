/**
 * Backfill people from existing episodes.
 * 
 * For each episode with a transcript, uses GPT-4o-mini to extract hosts/guests
 * from the title, description, and first ~2000 words of transcript.
 * 
 * Creates people records and episode_people junction records.
 * 
 * Usage: npx tsx scripts/backfill-people.ts
 */

import postgres from "postgres";
import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Deterministic emoji from name
function emojiForName(name: string): string {
  const emojis = ["👨‍💼", "👩‍💼", "👨", "👩", "🧑‍💻", "👨‍🦱", "👩‍🦰", "🧔", "👨‍💻", "👩‍🦳"];
  const hash = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return emojis[hash % emojis.length];
}

interface ExtractedPerson {
  name: string;
  role: "host" | "guest" | "mentioned";
  title?: string;
}

async function extractPeopleFromEpisode(
  title: string,
  channelTitle: string,
  description: string,
  transcriptExcerpt: string
): Promise<ExtractedPerson[]> {
  const prompt = `You are analyzing a podcast/YouTube episode to extract the names of real people who appear as hosts or guests.

Episode title: ${title}
Channel/Show: ${channelTitle}
Description: ${description.substring(0, 1000)}

Transcript excerpt (first ~2000 words):
${transcriptExcerpt}

Instructions:
- Extract REAL people who are hosts or guests on this episode
- The channel owner is typically the host
- Look for introductions like "I'm joined by...", "my guest today is...", "welcome back..."
- Look for names mentioned in the title or description
- Do NOT include fictional characters, company names, or politicians just being discussed (unless they are actually on the show)
- Only include people who are ACTUALLY PARTICIPATING in the conversation or are the channel host
- For the channel host, use their real name (not channel name) if you can determine it
- If you cannot determine any specific person names, return an empty array

Return JSON only:
{
  "people": [
    { "name": "Full Name", "role": "host|guest", "title": "Brief title/role if known" }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    return (parsed.people || []) as ExtractedPerson[];
  } catch (err) {
    console.error("  GPT extraction failed:", err);
    return [];
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🔄 BACKFILL PEOPLE FROM EPISODES");
  console.log("═══════════════════════════════════════════════════════════════\n");

  // Get all episodes
  const episodes = await sql<Array<{
    id: string;
    youtube_title: string;
    youtube_channel_title: string;
    youtube_description: string;
    seg_count: number;
  }>>`
    SELECT 
      e.id,
      e.youtube_title,
      e.youtube_channel_title,
      COALESCE(e.youtube_description, '') as youtube_description,
      (SELECT COUNT(*) FROM transcript_segments_raw t WHERE t.episode_id = e.id)::int as seg_count
    FROM episodes e
    ORDER BY e.created_at DESC
  `;

  console.log(`Found ${episodes.length} episodes\n`);

  // Track all people we find (name -> person data)
  const peopleMap = new Map<string, {
    name: string;
    slug: string;
    emoji: string;
    title: string | null;
    episodes: Array<{ episodeId: string; role: "host" | "guest" | "mentioned" }>;
  }>();

  for (const ep of episodes) {
    console.log(`\n📺 ${ep.youtube_channel_title} | ${ep.youtube_title}`);
    console.log(`   Segments: ${ep.seg_count}`);

    // Get transcript excerpt (first ~2000 words)
    let transcriptExcerpt = "";
    if (ep.seg_count > 0) {
      const segments = await sql<Array<{ text: string }>>`
        SELECT text FROM transcript_segments_raw
        WHERE episode_id = ${ep.id}
        ORDER BY start_ms ASC
        LIMIT 200
      `;
      transcriptExcerpt = segments.map((s) => s.text).join(" ");
      // Trim to ~2000 words
      const words = transcriptExcerpt.split(/\s+/);
      if (words.length > 2000) {
        transcriptExcerpt = words.slice(0, 2000).join(" ");
      }
    }

    // Extract people via GPT
    const extracted = await extractPeopleFromEpisode(
      ep.youtube_title,
      ep.youtube_channel_title,
      ep.youtube_description,
      transcriptExcerpt
    );

    if (extracted.length === 0) {
      console.log("   ⚠️  No people extracted");
      continue;
    }

    for (const person of extracted) {
      const slug = slugify(person.name);
      console.log(`   ✅ ${person.name} (${person.role})${person.title ? ` — ${person.title}` : ""}`);

      if (!peopleMap.has(slug)) {
        peopleMap.set(slug, {
          name: person.name,
          slug,
          emoji: emojiForName(person.name),
          title: person.title || null,
          episodes: [],
        });
      }

      const existing = peopleMap.get(slug)!;
      // Update title if we got a better one
      if (person.title && !existing.title) {
        existing.title = person.title;
      }
      existing.episodes.push({ episodeId: ep.id, role: person.role });
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log(`📊 Found ${peopleMap.size} unique people across ${episodes.length} episodes`);
  console.log("═══════════════════════════════════════════════════════════════\n");

  // Clear existing data
  console.log("🗑️  Clearing existing people data...");
  await sql`DELETE FROM episode_people`;
  await sql`DELETE FROM people`;

  // Insert people
  console.log("💾 Inserting people...\n");
  for (const [slug, person] of peopleMap) {
    const [inserted] = await sql<Array<{ id: string }>>`
      INSERT INTO people (name, slug, emoji, title)
      VALUES (${person.name}, ${person.slug}, ${person.emoji}, ${person.title})
      RETURNING id
    `;

    console.log(`  👤 ${person.name} (${person.episodes.length} episodes) → ${inserted.id}`);

    // Insert episode_people junctions
    for (const ep of person.episodes) {
      await sql`
        INSERT INTO episode_people (episode_id, person_id, role)
        VALUES (${ep.episodeId}, ${inserted.id}, ${ep.role})
        ON CONFLICT DO NOTHING
      `;
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("✅ BACKFILL COMPLETE");
  console.log("═══════════════════════════════════════════════════════════════\n");

  // Summary
  const totalPeople = await sql`SELECT COUNT(*) as c FROM people`;
  const totalLinks = await sql`SELECT COUNT(*) as c FROM episode_people`;
  console.log(`People: ${totalPeople[0].c}`);
  console.log(`Episode-People links: ${totalLinks[0].c}`);

  await sql.end();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
