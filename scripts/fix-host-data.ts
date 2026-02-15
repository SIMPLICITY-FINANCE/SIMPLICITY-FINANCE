import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log("Step 1: Clearing wrong host images (show thumbnails)...");
  
  await sql`
    UPDATE shows 
    SET host_image_url = NULL 
    WHERE host_name IS NOT NULL
  `;
  
  console.log("✓ Cleared all host_image_url values\n");
  
  console.log("Step 2: Updating host names and setting real headshot URLs...\n");
  
  // Benjamin Cowen - keep as is, clear image for now
  await sql`
    UPDATE shows SET 
      host_name = 'Benjamin Cowen',
      host_slug = 'benjamin-cowen',
      host_image_url = NULL
    WHERE name ILIKE '%benjamin cowen%'
  `;
  console.log("✓ Updated Benjamin Cowen");
  
  // All-In Podcast - group show, use initials
  await sql`
    UPDATE shows SET
      host_name = 'All-In Pod',
      host_slug = 'all-in-pod',
      host_image_url = NULL
    WHERE name ILIKE '%all-in%'
  `;
  console.log("✓ Updated All-In Podcast");
  
  // Darren Moore Jr - keep as is
  await sql`
    UPDATE shows SET
      host_name = 'Darren Moore Jr',
      host_slug = 'darren-moore-jr',
      host_image_url = NULL
    WHERE name ILIKE '%darren%'
  `;
  console.log("✓ Updated Darren Moore Jr");
  
  // Coin Bureau - hosted by Guy Turner
  await sql`
    UPDATE shows SET
      host_name = 'Guy Turner',
      host_slug = 'guy-turner',
      host_image_url = NULL
    WHERE name ILIKE '%coin bureau%'
  `;
  console.log("✓ Updated Coin Bureau (Guy Turner)");
  
  // Eurodollar University - hosted by Jeff Snider
  await sql`
    UPDATE shows SET
      host_name = 'Jeff Snider',
      host_slug = 'jeff-snider',
      host_image_url = NULL
    WHERE name ILIKE '%eurodollar%'
  `;
  console.log("✓ Updated Eurodollar University (Jeff Snider)");
  
  // Mark Moss - keep as is
  await sql`
    UPDATE shows SET
      host_name = 'Mark Moss',
      host_slug = 'mark-moss',
      host_image_url = NULL
    WHERE name ILIKE '%mark moss%'
  `;
  console.log("✓ Updated Mark Moss");
  
  // My Financial Friend - keep as is
  await sql`
    UPDATE shows SET
      host_name = 'My Financial Friend',
      host_slug = 'my-financial-friend',
      host_image_url = NULL
    WHERE name ILIKE '%my financial friend%'
  `;
  console.log("✓ Updated My Financial Friend");
  
  // Liberal Hivemind - keep as is
  await sql`
    UPDATE shows SET
      host_name = 'Liberal Hivemind',
      host_slug = 'liberal-hivemind',
      host_image_url = NULL
    WHERE name ILIKE '%liberal%'
  `;
  console.log("✓ Updated Liberal Hivemind");
  
  // FoFty - keep as is
  await sql`
    UPDATE shows SET
      host_name = 'FoFty',
      host_slug = 'fofty',
      host_image_url = NULL
    WHERE name ILIKE '%fofty%'
  `;
  console.log("✓ Updated FoFty");
  
  console.log("\nStep 3: Verifying updates...\n");
  
  const updated = await sql`
    SELECT name, host_name, host_slug, host_image_url
    FROM shows
    WHERE host_name IS NOT NULL
    ORDER BY name
  `;
  
  const unique = Array.from(new Map(updated.map(s => [s.host_slug, s])).values());
  
  for (const show of unique) {
    console.log(`${show.name} → ${show.host_name} (${show.host_slug})`);
    console.log(`  Image: ${show.host_image_url || 'NULL (will use styled initial)'}`);
  }
  
  await sql.end();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
