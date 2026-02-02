export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-6">👤</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Profile Management Coming Soon
        </h2>
        <p className="text-gray-600 mb-6">
          View and edit your profile information, manage your listening history, and customize your experience.
        </p>
        <div className="space-y-4 text-left max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <h3 className="font-semibold text-gray-900">Email & Account</h3>
              <p className="text-sm text-gray-600">Update your email and account details</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎧</span>
            <div>
              <h3 className="font-semibold text-gray-900">Listening History</h3>
              <p className="text-sm text-gray-600">View your recently played episodes</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <h3 className="font-semibold text-gray-900">Preferences</h3>
              <p className="text-sm text-gray-600">Customize your content recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
