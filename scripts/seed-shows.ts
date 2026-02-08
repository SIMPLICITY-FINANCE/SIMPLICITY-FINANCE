import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";
import { resolveYouTubeUrl } from "../app/lib/youtube/api.js";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

const CHANNELS = [
  "https://www.youtube.com/@intothecryptoverse",
  "https://www.youtube.com/@eurodollaruniversity",
  "https://www.youtube.com/watch?v=yUGrZGM2WIY&list=WL&index=7",
  "https://www.youtube.com/@DarrenMooreJr",
  "https://www.youtube.com/@MyFinancialFriend",
  "https://www.youtube.com/channel/UCqK_GSMbpiV8spgD3ZGloSw",
  "https://www.youtube.com/@LiberalHivemind/featured",
  "https://www.youtube.com/@allin/videos",
  "https://www.youtube.com/@foftytrader",
];

async function seedShows() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Seed Shows - Adding YouTube Channels");
  console.log("═══════════════════════════════════════════════════════════\n");

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const url of CHANNELS) {
    const shortUrl = url.length > 60 ? url.substring(0, 57) + "..." : url;
    process.stdout.write(`  📡 ${shortUrl} ... `);

    try {
      // Resolve URL to channel metadata
      const channel = await resolveYouTubeUrl(url);

      // Check if already exists
      const existing = await sql`
        SELECT id, name FROM shows WHERE channel_id = ${channel.id}
      `;

      if (existing.length > 0) {
        console.log(`⏭️  Already exists as "${existing[0]?.name}"`);
        skipped++;
        continue;
      }

      // Insert
      await sql`
        INSERT INTO shows (
          name, description, channel_id, channel_handle, channel_url,
          channel_description, channel_thumbnail, subscriber_count,
          source_type, status, ingestion_frequency, last_videos_to_ingest,
          total_episodes_ingested, updated_at
        ) VALUES (
          ${channel.name},
          ${channel.description},
          ${channel.id},
          ${channel.handle || null},
          ${channel.url},
          ${channel.description},
          ${channel.thumbnail},
          ${channel.subscriberCount},
          'youtube',
          'disabled',
          'every_6_hours',
          2,
          0,
          NOW()
        )
      `;

      console.log(`✅ ${channel.name} (${channel.handle || channel.id})`);
      added++;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.log(`❌ ${msg}`);
      failed++;
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════");
  console.log(`  Done! Added: ${added}, Skipped: ${skipped}, Failed: ${failed}`);
  console.log("═══════════════════════════════════════════════════════════\n");

  // List all shows
  const allShows = await sql`
    SELECT name, channel_handle, channel_id, status, subscriber_count
    FROM shows ORDER BY created_at
  `;

  console.log("All shows:");
  for (const s of allShows) {
    const subs = s.subscriber_count
      ? `${(s.subscriber_count / 1000).toFixed(0)}K subs`
      : "no sub data";
    console.log(`  ${s.status === "enabled" ? "🟢" : "⚪"} ${s.name} (${s.channel_handle || s.channel_id}) — ${subs}`);
  }

  console.log(`\nAdmin page: http://localhost:3000/admin/shows`);

  await sql.end();
}

seedShows().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
