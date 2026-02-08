/**
 * Generate AI headshots for all people in the database using Fal.ai FLUX Schnell.
 *
 * Prerequisites:
 *   - FAL_KEY in .env.local (get from https://fal.ai/dashboard/keys)
 *
 * Usage: npm run generate:headshots
 *
 * Cost: ~$0.003 per image × 17 people ≈ $0.05 total
 */

import postgres from "postgres";
import * as dotenv from "dotenv";
import { configureFal, generateHeadshot } from "../app/lib/people/generate-headshot";

dotenv.config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function main() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🎨 GENERATE AI HEADSHOTS FOR PEOPLE");
  console.log("═══════════════════════════════════════════════════════════════\n");

  if (!process.env.FAL_KEY) {
    console.error("❌ FAL_KEY not found in .env.local");
    console.error("   Get one at https://fal.ai/dashboard/keys");
    process.exit(1);
  }

  configureFal();

  // Check for --force flag to regenerate all
  const force = process.argv.includes("--force");

  // Get people needing headshots
  const people = force
    ? await sql<Array<{ id: string; name: string; slug: string; title: string | null }>>`
        SELECT id, name, slug, title FROM people ORDER BY name
      `
    : await sql<Array<{ id: string; name: string; slug: string; title: string | null }>>`
        SELECT id, name, slug, title FROM people
        WHERE avatar_url IS NULL
        ORDER BY name
      `;

  console.log(`Found ${people.length} people ${force ? "(force regenerate all)" : "needing headshots"}\n`);

  if (people.length === 0) {
    console.log("✅ All people already have headshots. Use --force to regenerate.");
    await sql.end();
    return;
  }

  let success = 0;
  let errors = 0;

  for (const person of people) {
    try {
      console.log(`\n🖼️  ${person.name} (${person.slug})`);

      const avatarUrl = await generateHeadshot({
        name: person.name,
        slug: person.slug,
        title: person.title ?? undefined,
      });

      await sql`
        UPDATE people
        SET avatar_url = ${avatarUrl}, updated_at = NOW()
        WHERE id = ${person.id}
      `;

      console.log(`  ✅ Saved: ${avatarUrl}`);
      success++;

      // Rate limit: 500ms between requests
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`  ❌ Failed:`, err instanceof Error ? err.message : err);
      errors++;
    }
  }

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Errors: ${errors}`);
  console.log("═══════════════════════════════════════════════════════════════\n");

  await sql.end();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
