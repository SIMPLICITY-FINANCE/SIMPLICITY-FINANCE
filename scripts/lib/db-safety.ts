/**
 * Database Safety Guard
 * 
 * Prevents accidental writes to production database from local scripts.
 * Scripts that modify data should call assertSafeDatabaseUrl() before executing.
 */

export function assertSafeDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.error('   Please configure .env.local with your database connection string');
    process.exit(1);
  }
  
  const isProduction = url.includes('supabase.co') || url.includes('supabase.com');
  const allowProd = process.env.ALLOW_PROD_DB_WRITE === '1';
  
  if (isProduction && !allowProd) {
    console.error('');
    console.error('❌ SAFETY CHECK FAILED');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('   DATABASE_URL points to PRODUCTION (Supabase)');
    console.error('   This script writes to the database.');
    console.error('');
    console.error('   For local development, use:');
    console.error('   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simplicity_finance_dev');
    console.error('');
    console.error('   To intentionally run against production, set:');
    console.error('   ALLOW_PROD_DB_WRITE=1');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('');
    process.exit(1);
  }
  
  if (isProduction) {
    console.warn('');
    console.warn('⚠️  WARNING: Running against PRODUCTION database (Supabase)');
    console.warn('   ALLOW_PROD_DB_WRITE=1 is set');
    console.warn('');
  } else {
    console.log('✓ Running against local database');
  }
}

export function getDatabaseEnvironment(): 'local' | 'production' {
  const url = process.env.DATABASE_URL || '';
  return url.includes('supabase.co') || url.includes('supabase.com') ? 'production' : 'local';
}
