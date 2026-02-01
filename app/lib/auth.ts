import { auth } from "../../auth.js";
import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  name: string | null;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    const [user] = await sql<User[]>`
      SELECT id, email, role, name
      FROM users
      WHERE email = ${session.user.email}
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
    redirect("/api/auth/signin");
  }

  if (user.role !== "admin") {
    redirect("/unauthorized");
  }

  return user;
}
