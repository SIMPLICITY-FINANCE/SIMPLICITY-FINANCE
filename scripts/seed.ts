import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

async function seed() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  const sql = postgres(DATABASE_URL);

  try {
    console.log("🌱 Starting database seed...\n");

    // Seed admin user
    console.log("👤 Seeding admin user...");
    const [admin] = await sql`
      INSERT INTO users (email, name, role)
      VALUES ('admin@simplicity-finance.com', 'Admin User', 'admin')
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        updated_at = NOW()
      RETURNING id, email, (xmax = 0) as inserted
    `;
    
    if (!admin) throw new Error("Failed to seed admin user");
    console.log(`✅ Admin user ${admin.inserted ? 'created' : 'updated'}: ${admin.email}`);

    // Seed sample show
    console.log("\n📺 Seeding sample show...");
    const [show] = await sql`
      INSERT INTO shows (name, description, youtube_channel_id)
      VALUES (
        'Sample Finance Podcast',
        'A sample podcast about finance and investing',
        'UC_sample_channel_id'
      )
      ON CONFLICT (youtube_channel_id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        updated_at = NOW()
      RETURNING id, name, (xmax = 0) as inserted
    `;
    
    if (!show) throw new Error("Failed to seed sample show");
    console.log(`✅ Sample show ${show.inserted ? 'created' : 'updated'}: ${show.name}`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nSummary:");
    console.log(`  Admin ID: ${admin.id}`);
    console.log(`  Admin Email: ${admin.email}`);
    console.log(`  Show ID: ${show.id}`);
    console.log(`  Show Name: ${show.name}`);

  } catch (err) {
    console.error("❌ Error seeding database:");
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seed();
