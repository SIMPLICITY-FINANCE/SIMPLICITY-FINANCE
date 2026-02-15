import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log("Updating host_image_url with channel_thumbnail where missing...");
  
  const result = await sql`
    UPDATE shows 
    SET host_image_url = channel_thumbnail
    WHERE host_name IS NOT NULL 
      AND host_image_url IS NULL
      AND channel_thumbnail IS NOT NULL
  `;
  
  console.log(`✓ Updated ${result.count} shows with channel thumbnails as host images`);
  
  // Verify the update
  const updated = await sql`
    SELECT name, host_name, host_image_url 
    FROM shows 
    WHERE host_name IS NOT NULL
    ORDER BY name
  `;
  
  console.log(`\nAll shows with hosts now have images:`);
  for (const show of updated) {
    console.log(`  - ${show.host_name} (${show.name}): ${show.host_image_url ? '✓ has image' : '✗ no image'}`);
  }
  
  await sql.end();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
