# Database Setup

## Prerequisites

- Docker Desktop installed and running
- Node.js and npm installed

## Quick Start

1. **Start the database**:
   ```bash
   docker-compose up -d
   ```

2. **Verify the database is running**:
   ```bash
   docker-compose ps
   ```

3. **Generate migration files** (after schema changes):
   ```bash
   npm run db:generate
   ```

4. **Run migrations**:
   ```bash
   npm run db:migrate
   ```

5. **Open Drizzle Studio** (database GUI):
   ```bash
   npm run db:studio
   ```
   Then open http://localhost:4983 in your browser

## Connection Details

- **Host**: localhost
- **Port**: 5432
- **Database**: simplicity_finance_dev
- **User**: postgres
- **Password**: postgres
- **Connection String**: `postgresql://postgres:postgres@localhost:5432/simplicity_finance_dev`

## Useful Commands

### Stop the database
```bash
docker-compose down
```

### Stop and remove volumes (reset database)
```bash
docker-compose down -v
```

### View logs
```bash
docker-compose logs -f postgres
```

### Connect with psql
```bash
docker exec -it simplicity-finance-db psql -U postgres -d simplicity_finance_dev
```

## Troubleshooting

### "Cannot connect to Docker daemon"
Make sure Docker Desktop is running.

### Port 5432 already in use
Another Postgres instance is running. Either:
- Stop the other instance
- Change the port in `docker-compose.yml` (e.g., `"5433:5432"`)

### Connection refused
Wait a few seconds for the container to fully start, then try again.
