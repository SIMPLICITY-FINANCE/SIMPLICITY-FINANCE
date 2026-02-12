import { redirect } from "next/navigation.js";
import Link from "next/link.js";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "../../../lib/auth.js";
import { sql } from "../../../lib/db.js";

interface PendingSummary {
  id: string;
  title: string;
  published_at: string;
  video_id: string;
  qc_status: string;
  qc_score: number;
  risk_flags: string[];
  created_at: Date;
}

async function approveSummary(formData: FormData) {
  "use server";
  
  const user = await requireAdmin();
  const summaryId = formData.get("summaryId") as string;
  
  await sql`
    UPDATE episode_summary
    SET approval_status = 'approved',
        approved_by = ${user.id},
        approved_at = NOW()
    WHERE id = ${summaryId}
  `;
  
  await sql`
    INSERT INTO admin_audit_logs (user_id, action, resource_type, resource_id, metadata)
    VALUES (
      ${user.id},
      'approve_summary',
      'summary',
      ${summaryId},
      ${JSON.stringify({ approved_by: user.email })}
    )
  `;
  
  redirect("/admin/approvals");
}

async function rejectSummary(formData: FormData) {
  "use server";
  
  const user = await requireAdmin();
  const summaryId = formData.get("summaryId") as string;
  const reason = formData.get("reason") as string;
  
  if (!reason || reason.trim().length === 0) {
    throw new Error("Rejection reason is required");
  }
  
  await sql`
    UPDATE episode_summary
    SET approval_status = 'rejected',
        approved_by = ${user.id},
        approved_at = NOW(),
        rejection_reason = ${reason}
    WHERE id = ${summaryId}
  `;
  
  await sql`
    INSERT INTO admin_audit_logs (user_id, action, resource_type, resource_id, metadata)
    VALUES (
      ${user.id},
      'reject_summary',
      'summary',
      ${summaryId},
      ${JSON.stringify({ rejected_by: user.email, reason })}
    )
  `;
  
  redirect("/admin/approvals");
}

export default async function ApprovalsPage() {
  let user;
  
  try {
    user = await requireAdmin();
  } catch (error) {
    redirect("/unauthorized");
  }

  const pendingSummaries = await sql<PendingSummary[]>`
    SELECT 
      s.id,
      s.title,
      s.published_at,
      s.video_id,
      q.qc_status,
      q.qc_score,
      q.risk_flags,
      s.created_at
    FROM episode_summary s
    LEFT JOIN qc_runs q ON s.id = q.summary_id
    WHERE s.approval_status = 'pending'
    ORDER BY s.created_at DESC
    LIMIT 50
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Approvals
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
            <a href="/admin" className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">
              Dashboard
            </a>
            <a href="/admin/approvals" className="px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Approvals
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Pending Summaries ({pendingSummaries.length})
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve or reject episode summaries
          </p>
        </div>

        {pendingSummaries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No pending summaries to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSummaries.map((summary) => (
              <div key={summary.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {summary.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Video ID: {summary.video_id}</span>
                      <span>Published: {new Date(summary.published_at).toLocaleDateString()}</span>
                      <span>Created: {new Date(summary.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">QC Status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      summary.qc_status === 'pass' ? 'bg-green-100 text-green-800' :
                      summary.qc_status === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {summary.qc_status?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">QC Score:</span>
                    <span className="text-sm text-gray-900">{summary.qc_score || 'N/A'}/100</span>
                  </div>
                  {summary.risk_flags && Array.isArray(summary.risk_flags) && summary.risk_flags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Risk Flags:</span>
                      <div className="flex gap-1">
                        {summary.risk_flags.map((flag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <form action={approveSummary}>
                    <input type="hidden" name="summaryId" value={summary.id} />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                  </form>
                  
                  <details className="inline">
                    <summary className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors cursor-pointer">
                      Reject
                    </summary>
                    <form action={rejectSummary} className="mt-2 p-4 bg-gray-50 rounded border">
                      <input type="hidden" name="summaryId" value={summary.id} />
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason (required)
                      </label>
                      <textarea
                        name="reason"
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="Explain why this summary is being rejected..."
                      />
                      <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                      >
                        Confirm Rejection
                      </button>
                    </form>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
