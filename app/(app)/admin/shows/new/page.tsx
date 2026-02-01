import { requireAdmin } from "../../../../lib/auth.js";
import { ShowForm } from "../ShowForm.js";

export default async function NewShowPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Show</h1>
              <p className="text-sm text-gray-600 mt-1">
                Configure a new show for automatic episode ingestion
              </p>
            </div>
            <a
              href="/admin/shows"
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
            >
              ← Back to Shows
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShowForm />
      </main>
    </div>
  );
}
