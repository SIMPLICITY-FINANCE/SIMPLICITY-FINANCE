import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log("Checking existing shows...");
  const shows = await sql`
    SELECT id, name, channel_id, channel_thumbnail 
    FROM shows 
    ORDER BY name
  `;
  
  console.log(`Found ${shows.length} shows:`);
  for (const show of shows) {
    console.log(`  - ${show.name} (${show.channel_id})`);
  }
  
  await sql.end();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
