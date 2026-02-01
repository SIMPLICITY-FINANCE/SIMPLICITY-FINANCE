import { UserNav } from "./components/UserNav.js";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <UserNav />
        </div>
      </div>
      
      <div className="flex items-center justify-center py-12">
        <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Simplicity Finance
          </h1>
          <p className="text-gray-600 mb-6">
            Finance podcast summarization platform focused on trustworthy, evidence-grounded outputs.
          </p>
        
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Public Pages</h2>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-blue-600 hover:underline">
                  📰 Dashboard (Feed) - Browse approved episode summaries
                </a>
              </li>
              <li>
                <a href="/saved" className="text-blue-600 hover:underline">
                  🔖 Saved - Your saved episodes and reports
                </a>
              </li>
              <li>
                <a href="/notebook" className="text-blue-600 hover:underline">
                  📓 Notebook - Your saved key points
                </a>
              </li>
              <li>
                <a href="/reports" className="text-blue-600 hover:underline">
                  📊 Reports - Daily/weekly/monthly summaries
                </a>
              </li>
              <li>
                <a href="/search" className="text-blue-600 hover:underline">
                  🔍 Search - Find episodes and key points
                </a>
              </li>
              <li>
                <a href="/upload" className="text-blue-600 hover:underline">
                  📤 Upload - Submit a YouTube video for processing
                </a>
              </li>
            </ul>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Admin Pages (Requires Login)</h2>
            <ul className="space-y-2">
              <li>
                <a href="/admin" className="text-blue-600 hover:underline">
                  🔐 Admin Dashboard - Overview and stats
                </a>
              </li>
              <li>
                <a href="/admin/approvals" className="text-blue-600 hover:underline">
                  ✅ Approvals - Review pending summaries
                </a>
              </li>
            </ul>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Development Tools</h2>
            <ul className="space-y-2">
              <li>
                <a href="/dev/login" className="text-blue-600 hover:underline">
                  🔑 Dev Login - Set authentication cookie
                </a>
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
