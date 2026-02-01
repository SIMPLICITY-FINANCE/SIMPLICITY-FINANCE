import NextAuth from 'next-auth';
import { authConfig } from './auth.config.js';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Check if user exists in database
      const existingUser = await sql`
        SELECT id, email, role FROM users WHERE email = ${user.email}
      `;

      if (existingUser.length === 0) {
        // Create new user with 'user' role by default
        await sql`
          INSERT INTO users (email, name, role)
          VALUES (${user.email}, ${user.name || 'Unknown'}, 'user')
        `;
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        
        // Get user role from database
        if (session.user.email) {
          const userRecord = await sql`
            SELECT role FROM users WHERE email = ${session.user.email}
          `;
          
          if (userRecord.length > 0) {
            (session.user as any).role = userRecord[0].role;
          }
        }
      }
      return session;
    },
  },
});
