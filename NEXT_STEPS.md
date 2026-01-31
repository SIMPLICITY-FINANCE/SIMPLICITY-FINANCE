# Next Steps - Phase 2.1 Database Setup

## What's Been Done ✅

1. Created `docker-compose.yml` with Postgres 16
2. Installed Drizzle ORM dependencies (`drizzle-orm`, `postgres`, `drizzle-kit`)
3. Created `drizzle.config.ts` for Drizzle configuration
4. Created minimal schema in `db/schema.ts` (episodes table)
5. Added `DATABASE_URL` to `.env.example`
6. Created database scripts in `package.json`
7. Created `db/README.md` with setup instructions
8. Created `scripts/test_db_connection.ts` for connection testing

## What You Need to Do Now 🔧

### 1. Start Docker Desktop
Make sure Docker Desktop is running on your machine.

### 2. Start the Database
```bash
docker-compose up -d
```

### 3. Test the Connection
```bash
npm run db:test
```

You should see:
```
✅ Database connected successfully!
PostgreSQL version: PostgreSQL 16.x ...
Current database: simplicity_finance_dev
✅ Connection test complete
```

### 4. Generate Initial Migration
```bash
npm run db:generate
```

This will create migration files in `db/migrations/`

### 5. Run the Migration
```bash
npm run db:migrate
```

This applies the schema to the database.

### 6. Verify with Drizzle Studio
```bash
npm run db:studio
```

Open http://localhost:4983 and you should see the `episodes` table.

## Acceptance Criteria for Checkpoint 2.1

- [x] docker-compose.yml created
- [x] Drizzle installed and configured
- [x] migrations folder exists
- [ ] Postgres running (docker-compose up -d)
- [ ] Connection test passes (npm run db:test)
- [ ] Migration runs clean (npm run db:migrate)
- [ ] Drizzle Studio connects (npm run db:studio)

## Troubleshooting

If you get "Cannot connect to Docker daemon":
- Start Docker Desktop
- Wait for it to fully start
- Try again

If port 5432 is already in use:
- Check if another Postgres is running: `lsof -i :5432`
- Either stop it or change the port in `docker-compose.yml`

## After This Works

Once all acceptance criteria pass, we'll:
1. Commit this checkpoint
2. Move to checkpoint 2.2 (full schema with all tables)
