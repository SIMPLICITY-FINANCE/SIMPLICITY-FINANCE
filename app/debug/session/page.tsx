import { auth } from "../../../auth.js";
import { getCurrentUser } from "../../lib/auth.js";

export default async function DebugSessionPage() {
  const session = await auth();
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Session Debug Info</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">NextAuth Session</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Database User</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Access Check</h2>
            <div className="space-y-2">
              <div>
                <strong>Is Authenticated:</strong>{" "}
                {session?.user ? "✅ Yes" : "❌ No"}
              </div>
              <div>
                <strong>Is Admin:</strong>{" "}
                {user?.role === "admin" ? "✅ Yes" : "❌ No"}
              </div>
              <div>
                <strong>User Role:</strong> {user?.role || "N/A"}
              </div>
              <div>
                <strong>User Email:</strong> {user?.email || "N/A"}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Test Links</h2>
            <div className="space-y-2">
              <div>
                <a
                  href="/admin"
                  className="text-blue-600 hover:underline"
                >
                  Try accessing /admin
                </a>
              </div>
              <div>
                <a
                  href="/admin/ops"
                  className="text-blue-600 hover:underline"
                >
                  Try accessing /admin/ops
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
