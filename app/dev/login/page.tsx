import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

async function loginAsAdmin() {
  "use server";
  
  const [admin] = await sql`
    SELECT email FROM users WHERE role = 'admin' LIMIT 1
  `;
  
  if (admin) {
    const cookieStore = await cookies();
    cookieStore.set("user_email", admin.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  
  redirect("/admin");
}

async function loginAsUser() {
  "use server";
  
  const [user] = await sql`
    SELECT email FROM users WHERE role = 'user' LIMIT 1
  `;
  
  if (user) {
    const cookieStore = await cookies();
    cookieStore.set("user_email", user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  
  redirect("/admin");
}

async function logout() {
  "use server";
  
  const cookieStore = await cookies();
  cookieStore.delete("user_email");
  redirect("/");
}

export default function DevLoginPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Dev Login
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          This page is for development only. It sets a cookie to simulate authentication.
        </p>
        
        <div className="space-y-4">
          <form action={loginAsAdmin}>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Login as Admin
            </button>
          </form>
          
          <form action={loginAsUser}>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Login as User (will be blocked)
            </button>
          </form>
          
          <form action={logout}>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <a href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
