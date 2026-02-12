import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log("Adding category column to shows table...");
  await sql`ALTER TABLE shows ADD COLUMN IF NOT EXISTS category text`;
  console.log("Done.");

  console.log("\nSeeding categories for existing shows...");
  const shows = await sql`SELECT id, name, channel_id FROM shows ORDER BY name`;
  console.log(`Found ${shows.length} shows:`);
  for (const s of shows) {
    console.log(`  - ${s.name} (${s.channel_id})`);
  }

  // Assign categories based on show names
  await sql`UPDATE shows SET category = 'markets' WHERE name ILIKE '%cowen%' OR name ILIKE '%benjamin%' OR name ILIKE '%coin bureau%'`;
  await sql`UPDATE shows SET category = 'macro' WHERE name ILIKE '%eurodollar%' OR name ILIKE '%macro%' OR name ILIKE '%financial friend%'`;
  await sql`UPDATE shows SET category = 'technology' WHERE name ILIKE '%all-in%' OR name ILIKE '%all in%'`;
  await sql`UPDATE shows SET category = 'markets' WHERE name ILIKE '%mark moss%' OR name ILIKE '%darren%'`;
  await sql`UPDATE shows SET category = 'geopolitics' WHERE name ILIKE '%liberal%' OR name ILIKE '%hivemind%'`;
  await sql`UPDATE shows SET category = 'business' WHERE name ILIKE '%fofty%'`;

  // Show results
  const updated = await sql`SELECT name, category FROM shows ORDER BY name`;
  console.log("\nCategories assigned:");
  for (const s of updated) {
    console.log(`  - ${s.name}: ${s.category || '(none)'}`);
  }

  await sql.end();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
