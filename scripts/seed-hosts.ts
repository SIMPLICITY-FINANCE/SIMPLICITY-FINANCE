import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log("Seeding host data for shows...");
  
  // Update shows with host information
  await sql`
    UPDATE shows 
    SET host_name = 'Benjamin Cowen', 
        host_slug = 'benjamin-cowen',
        host_image_url = channel_thumbnail
    WHERE name ILIKE '%benjamin cowen%'
  `;
  
  await sql`
    UPDATE shows 
    SET host_name = 'Eurodollar University', 
        host_slug = 'eurodollar-university',
        host_image_url = channel_thumbnail
    WHERE name ILIKE '%eurodollar%'
  `;
  
  await sql`
    UPDATE shows 
    SET host_name = 'Coin Bureau', 
        host_slug = 'coin-bureau',
        host_image_url = channel_thumbnail
    WHERE name ILIKE '%coin bureau%'
  `;
  
  await sql`
    UPDATE shows 
    SET host_name = 'Darren Moore Jr', 
        host_slug = 'darren-moore-jr',
        host_image_url = channel_thumbnail
    WHERE name ILIKE '%darren%'
  `;
  
  await sql`
    UPDATE shows 
    SET host_name = 'Mark Moss', 
        host_slug = 'mark-moss',
        host_image_url = channel_thumbnail
    WHERE name ILIKE '%mark moss%'
  `;
  
  await sql`
    UPDATE shows 
    SET host_name = 'My Financial Friend', 
        host_slug = 'my-financial-friend',
        host_image_url = channel_thumbnail
    WHERE name ILIKE '%my financial friend%'
  `;
  
  await sql`
    UPDATE shows 
    SET host_name = 'Liberal Hivemind', 
        host_slug = 'liberal-hivemind',
        host_image_url = channel_thumbnail
    WHERE name ILIKE '%liberal%'
  `;
  
  await sql`
    UPDATE shows 
    SET host_name = 'FoFty', 
        host_slug = 'fofty',
        host_image_url = channel_thumbnail
    WHERE name ILIKE '%fofty%'
  `;
  
  // All-In Podcast has multiple hosts, use the show name as host
  await sql`
    UPDATE shows 
    SET host_name = 'All-In Podcast', 
        host_slug = 'all-in-podcast',
        host_image_url = channel_thumbnail
    WHERE name ILIKE '%all-in%'
  `;
  
  // Check results
  const updated = await sql`
    SELECT name, host_name, host_slug 
    FROM shows 
    WHERE host_name IS NOT NULL 
    ORDER BY name
  `;
  
  console.log(`\nHost data set for ${updated.length} shows:`);
  for (const show of updated) {
    console.log(`  - ${show.name}: ${show.host_name} (${show.host_slug})`);
  }
  
  await sql.end();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
