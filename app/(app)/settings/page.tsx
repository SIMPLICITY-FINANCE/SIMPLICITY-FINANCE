export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Customize your experience and manage preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-6">⚙️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Settings Configuration Coming Soon
        </h2>
        <p className="text-gray-600 mb-6">
          Manage notifications, customize your experience, and configure application preferences.
        </p>
        <div className="space-y-4 text-left max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Configure email and push notifications</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <h3 className="font-semibold text-gray-900">Appearance</h3>
              <p className="text-sm text-gray-600">Customize theme and display options</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h3 className="font-semibold text-gray-900">Privacy & Security</h3>
              <p className="text-sm text-gray-600">Manage data and privacy settings</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <h3 className="font-semibold text-gray-900">Language & Region</h3>
              <p className="text-sm text-gray-600">Set language and regional preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
