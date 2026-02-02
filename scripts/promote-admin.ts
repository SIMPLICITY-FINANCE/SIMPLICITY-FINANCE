#!/usr/bin/env tsx
/**
 * Promote User to Admin
 * 
 * This script promotes a user to admin role in the database.
 * It is idempotent and reversible.
 * 
 * Usage:
 *   export DATABASE_URL='postgresql://...'
 *   npx tsx scripts/promote-admin.ts user@example.com
 * 
 * To demote (reverse):
 *   npx tsx scripts/promote-admin.ts user@example.com --demote
 */

import postgres from 'postgres';

const email = process.argv[2];
const isDemote = process.argv[3] === '--demote';

if (!email) {
  console.error('❌ ERROR: Email address required');
  console.error('Usage: npx tsx scripts/promote-admin.ts user@example.com');
  console.error('To demote: npx tsx scripts/promote-admin.ts user@example.com --demote');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable not set');
  console.error('Set it with: export DATABASE_URL="postgresql://..."');
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function main() {
  try {
    console.log(`🔍 Looking up user: ${email}`);
    
    // Check if user exists
    const [user] = await sql`
      SELECT id, email, role, name
      FROM users
      WHERE email = ${email}
    `;

    if (!user) {
      console.error(`❌ ERROR: User not found: ${email}`);
      console.error('');
      console.error('The user must sign in at least once before being promoted.');
      console.error('1. Deploy the app to Vercel');
      console.error('2. Visit the app and sign in with Google OAuth');
      console.error('3. Then run this script to promote to admin');
      await sql.end();
      process.exit(1);
    }

    console.log(`✅ User found: ${user.name || user.email}`);
    console.log(`   Current role: ${user.role}`);
    console.log('');

    const targetRole = isDemote ? 'user' : 'admin';

    if (user.role === targetRole) {
      console.log(`ℹ️  User already has role: ${targetRole}`);
      console.log('   No changes needed.');
      await sql.end();
      return;
    }

    // Update role
    console.log(`🔄 ${isDemote ? 'Demoting' : 'Promoting'} user to: ${targetRole}`);
    
    await sql`
      UPDATE users
      SET role = ${targetRole}
      WHERE email = ${email}
    `;

    console.log(`✅ SUCCESS: User ${isDemote ? 'demoted' : 'promoted'} to ${targetRole}`);
    console.log('');
    console.log('📋 Updated user:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Role: ${user.role} → ${targetRole}`);
    console.log('');
    console.log('🔄 To reverse this change, run:');
    console.log(`   npx tsx scripts/promote-admin.ts ${email} ${isDemote ? '' : '--demote'}`);

  } catch (error) {
    console.error('❌ ERROR:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
