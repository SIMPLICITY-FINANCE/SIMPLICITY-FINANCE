import { auth, signOut } from "../../auth.js";
import { getCurrentUser } from "../lib/auth.js";
import Link from "next/link";

export async function UserNav() {
  const session = await auth();
  const user = await getCurrentUser();

  if (!session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/auth/signin"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <div className="font-medium text-gray-900">{session.user.name}</div>
          <div className="text-gray-500">{session.user.email}</div>
          {user?.role === "admin" && (
            <div className="text-xs text-blue-600 font-semibold">ADMIN</div>
          )}
        </div>
      </div>

      {user?.role === "admin" && (
        <div className="flex items-center gap-2 border-l pl-4">
          <Link
            href="/admin"
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Admin
          </Link>
          <Link
            href="/admin/ops"
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Ops
          </Link>
          <Link
            href="/admin/ingest"
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Ingest
          </Link>
          <Link
            href="/admin/approve"
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Approve
          </Link>
        </div>
      )}

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
