#!/usr/bin/env tsx

/**
 * Deployment Verification Script
 * 
 * Checks that the application is ready for production deployment.
 * Run this before deploying to catch configuration issues.
 */

import { config } from 'dotenv';
import { exit } from 'process';

// Load environment variables
config({ path: '.env.local' });

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: CheckResult[] = [];

function check(name: string, condition: boolean, message: string) {
  results.push({ name, passed: condition, message });
  const icon = condition ? '✅' : '❌';
  console.log(`${icon} ${name}: ${message}`);
}

async function verifyDeployment() {
  console.log('🔍 Verifying deployment readiness...\n');

  // Check required environment variables
  check(
    'DATABASE_URL',
    !!process.env.DATABASE_URL,
    process.env.DATABASE_URL ? 'Set' : 'Missing - required for database connection'
  );

  check(
    'DEEPGRAM_API_KEY',
    !!process.env.DEEPGRAM_API_KEY,
    process.env.DEEPGRAM_API_KEY ? 'Set' : 'Missing - required for transcription'
  );

  check(
    'YOUTUBE_API_KEY',
    !!process.env.YOUTUBE_API_KEY,
    process.env.YOUTUBE_API_KEY ? 'Set' : 'Missing - required for YouTube metadata'
  );

  check(
    'OPENAI_API_KEY',
    !!process.env.OPENAI_API_KEY,
    process.env.OPENAI_API_KEY ? 'Set' : 'Missing - required for summary generation'
  );

  // Check Node environment (optional for local dev)
  const nodeEnv = process.env.NODE_ENV;
  check(
    'NODE_ENV',
    !nodeEnv || nodeEnv === 'production' || nodeEnv === 'development' || nodeEnv === 'test',
    nodeEnv ? `Set to: ${nodeEnv}` : 'Not set (OK for local dev)'
  );

  // Check database connection
  try {
    const postgres = (await import('postgres')).default;
    const sql = postgres(process.env.DATABASE_URL!, {
      max: 1,
      connect_timeout: 5,
    });
    
    await sql`SELECT 1 as health_check`;
    await sql.end();
    
    check('Database Connection', true, 'Connected successfully');
  } catch (error) {
    check(
      'Database Connection',
      false,
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  // Check critical files exist
  const fs = await import('fs');
  const path = await import('path');
  
  const criticalFiles = [
    'package.json',
    'tsconfig.json',
    'drizzle.config.ts',
    'middleware.ts',
    'app/api/health/route.ts',
  ];

  for (const file of criticalFiles) {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    check(`File: ${file}`, exists, exists ? 'Exists' : 'Missing');
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const allPassed = passed === total;

  if (allPassed) {
    console.log(`✅ All checks passed (${passed}/${total})`);
    console.log('🚀 Ready for deployment!');
    exit(0);
  } else {
    console.log(`❌ ${total - passed} check(s) failed (${passed}/${total} passed)`);
    console.log('⚠️  Fix issues before deploying');
    exit(1);
  }
}

verifyDeployment().catch((error) => {
  console.error('❌ Verification failed:', error);
  exit(1);
});
