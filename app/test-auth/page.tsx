import { auth } from "../../auth.js";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

export default async function TestAuthPage() {
  const session = await auth();
  
  let dbUser = null;
  if (session?.user?.email) {
    const users = await sql`
      SELECT id, email, role, name, created_at
      FROM users
      WHERE email = ${session.user.email}
    `;
    dbUser = users[0] || null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Auth Test Results</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-lg mb-2">1. Session Exists?</h2>
              <p className={session ? "text-green-600" : "text-red-600"}>
                {session ? "✅ YES - Session found" : "❌ NO - No session"}
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">2. Session Email</h2>
              <p className="font-mono bg-gray-100 p-2 rounded">
                {session?.user?.email || "No email in session"}
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">3. Database User Found?</h2>
              <p className={dbUser ? "text-green-600" : "text-red-600"}>
                {dbUser ? "✅ YES - User found in database" : "❌ NO - User not in database"}
              </p>
            </div>

            {dbUser && (
              <div>
                <h2 className="font-semibold text-lg mb-2">4. Database User Details</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                  {JSON.stringify(dbUser, null, 2)}
                </pre>
              </div>
            )}

            <div>
              <h2 className="font-semibold text-lg mb-2">5. Role Check</h2>
              <p className={dbUser?.role === 'admin' ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {dbUser?.role === 'admin' 
                  ? "✅ ADMIN - You should have access" 
                  : `❌ NOT ADMIN - Current role: ${dbUser?.role || 'none'}`}
              </p>
            </div>

            <div className="border-t pt-4 mt-4">
              <h2 className="font-semibold text-lg mb-2">Full Session Object</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Next Steps:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>If session exists but role is not 'admin', the database user needs updating</li>
            <li>If no session, sign out and sign in again</li>
            <li>If user not in database, sign in will create them with 'user' role</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <a
            href="/api/auth/signout"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Sign Out
          </a>
          <a
            href="/auth/signin"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In
          </a>
          <a
            href="/admin"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Try Admin Page
          </a>
        </div>
      </div>
    </div>
  );
}
