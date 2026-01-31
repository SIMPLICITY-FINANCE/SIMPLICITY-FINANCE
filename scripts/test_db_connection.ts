import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

async function testConnection() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  console.log("🔌 Testing database connection...");
  console.log("Connection string:", DATABASE_URL.replace(/:[^:@]+@/, ":****@"));

  try {
    const sql = postgres(DATABASE_URL);
    
    const result = await sql`SELECT version()`;
    console.log("✅ Database connected successfully!");
    console.log("PostgreSQL version:", result[0]?.version);

    const dbCheck = await sql`SELECT current_database()`;
    console.log("Current database:", dbCheck[0]?.current_database);

    await sql.end();
    console.log("✅ Connection test complete");
  } catch (err) {
    console.error("❌ Database connection failed:");
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

testConnection();
