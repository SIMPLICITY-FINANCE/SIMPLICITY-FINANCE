import { cookies } from "next/headers";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  display_name: string | null;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return null;
    }

    const [user] = await sql<User[]>`
      SELECT id, email, role, display_name
      FROM users
      WHERE email = ${userEmail}
      LIMIT 1
    `;

    return user || null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized: No user session");
  }

  if (user.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}
