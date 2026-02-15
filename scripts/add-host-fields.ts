import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  console.log("Adding host fields to shows table...");
  
  // Add the three new columns
  await sql`ALTER TABLE shows ADD COLUMN IF NOT EXISTS host_name text`;
  await sql`ALTER TABLE shows ADD COLUMN IF NOT EXISTS host_slug text`;
  await sql`ALTER TABLE shows ADD COLUMN IF NOT EXISTS host_image_url text`;
  
  console.log("✓ Host fields added successfully");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
