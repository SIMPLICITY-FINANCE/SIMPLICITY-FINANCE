# DATABASE RULES
# Read this before editing any file in /db/

## WHAT THIS FOLDER DOES
Drizzle ORM schema and database connection.
schema.ts is the SINGLE SOURCE OF TRUTH for the database.

## CRITICAL RULES

1. **schema.ts is the source of truth**
   - All table definitions live here
   - Never modify the database directly (use migrations)

2. **NEVER run `drizzle-kit push` without**:
   - Reading the current schema first
   - Understanding what will change
   - Confirming no data will be lost
   - Having a backup

3. **Adding a new table**:
   - Add to schema.ts
   - Run: `npx drizzle-kit push` 
   - Update /docs/ARCHITECTURE.md with new table name
   - Update /docs/PRD.md if it's a new feature

4. **Column changes are dangerous**:
   - Renaming a column = data loss without migration
   - Always add new columns, migrate data, then remove old ones
   - Ask before any column rename or delete

5. **Environment variable**:
   - DATABASE_URL must point to Supabase
   - ALLOW_PROD_DB_WRITE=1 must be set for writes

## CURRENT TABLES
See /docs/ARCHITECTURE.md for full table list
