import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log("Current shows and hosts:\n");
  
  const shows = await sql`
    SELECT id, name, host_name, host_slug, host_image_url, channel_thumbnail
    FROM shows
    ORDER BY name
  `;
  
  for (const show of shows) {
    console.log(`Show: ${show.name}`);
    console.log(`  Host: ${show.host_name || 'NOT SET'}`);
    console.log(`  Slug: ${show.host_slug || 'NOT SET'}`);
    console.log(`  Host Image: ${show.host_image_url ? '✓ SET' : '✗ NULL'}`);
    console.log(`  Show Thumbnail: ${show.channel_thumbnail ? '✓ SET' : '✗ NULL'}`);
    console.log('');
  }
  
  await sql.end();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
