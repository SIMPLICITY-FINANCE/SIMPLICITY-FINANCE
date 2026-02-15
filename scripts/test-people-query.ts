import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log("Testing people query...");
  
  try {
    const people = await sql`
      SELECT
        s.id,
        s.host_name as name,
        s.host_slug as slug,
        s.host_image_url as image_url,
        s.name as show_name,
        NULL as show_slug
      FROM shows s
      WHERE s.host_name IS NOT NULL
        AND s.host_slug IS NOT NULL
      ORDER BY s.name ASC
      LIMIT 20
    `;
    
    console.log(`Found ${people.length} people:`);
    for (const p of people) {
      console.log(`  - ${p.name} (${p.slug}) from ${p.show_name}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  
  await sql.end();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
