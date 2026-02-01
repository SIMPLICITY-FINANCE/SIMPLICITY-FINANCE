import { redirect } from "next/navigation";
import { requireAdmin } from "../lib/auth";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

export default async function AdminPage() {
  const user = await requireAdmin();

  const [stats] = await sql`
    SELECT 
      (SELECT COUNT(*) FROM episode_summary WHERE approval_status = 'pending') as pending_approvals,
      (SELECT COUNT(*) FROM episodes) as total_episodes
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.name || user.email}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/admin" className="px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Dashboard
            </a>
            <a href="/admin/approvals" className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
              Approvals
            </a>
            <button className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
              Users
            </button>
            <button className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
              Errors
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.pending_approvals}</p>
            <a href="/admin/approvals" className="mt-2 text-sm text-blue-600 hover:underline">
              Review →
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Episodes</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.total_episodes}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Failed Runs</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/approvals"
              className="block px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="font-semibold">Approvals</div>
              <div className="text-sm">Review pending summaries</div>
            </a>
            <a
              href="/admin/ops"
              className="block px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="font-semibold">Operations</div>
              <div className="text-sm">System monitoring & cleanup</div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
