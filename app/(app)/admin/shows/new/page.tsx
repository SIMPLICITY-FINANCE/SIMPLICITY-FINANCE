import Link from "next/link.js";
import { ArrowLeft } from "lucide-react";
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
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin/shows"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shows
        </Link>

        <ShowForm />
      </main>
    </div>
  );
}
