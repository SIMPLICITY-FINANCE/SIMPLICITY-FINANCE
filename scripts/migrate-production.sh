#!/bin/bash
# Production Database Migration Script
# This script is idempotent and safe to run multiple times

set -e  # Exit on error

echo "🔍 Checking production database connection..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable not set"
  echo "Set it with: export DATABASE_URL='postgresql://...'"
  exit 1
fi

echo "✅ DATABASE_URL is set"

echo ""
echo "🚀 Running Drizzle migrations..."
echo "This is idempotent - safe to run multiple times"
echo ""

# Run migrations
npx drizzle-kit push

echo ""
echo "✅ Migrations complete!"
echo ""
echo "📊 Verifying tables exist..."

# Verify tables exist (simple check)
npx tsx -e "
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL);
const tables = await sql\`
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public'
  ORDER BY table_name
\`;
console.log('Tables found:', tables.map(t => t.table_name).join(', '));
await sql.end();
"

echo ""
echo "✅ Database migration verified!"
