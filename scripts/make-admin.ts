import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

async function makeAdmin() {
  const email = 'simplicity.finance88@gmail.com';
  
  console.log(`Making ${email} an admin...`);
  
  const result = await sql`
    UPDATE users 
    SET role = 'admin' 
    WHERE LOWER(email) = ${email.toLowerCase()}
    RETURNING id, email, role, name
  `;
  
  if (result.length === 0) {
    console.error(`❌ User not found: ${email}`);
    console.log('\nAvailable users:');
    const users = await sql`SELECT id, email, role, name FROM users`;
    console.table(users);
  } else {
    console.log(`✅ Successfully updated user to admin:`);
    console.table(result);
  }
  
  await sql.end();
}

makeAdmin().catch(console.error);
