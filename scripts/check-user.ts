import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function checkUser() {
  const users = await sql`
    SELECT email, role, name, created_at 
    FROM users 
    WHERE LOWER(email) = 'admin@simplicity-finance.com'
  `;
  
  console.log('User in database:');
  console.table(users);
  
  await sql.end();
}

checkUser().catch(console.error);
