export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-6">⚙️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Settings Coming Soon
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Customize your experience, manage notifications, and configure preferences.
        </p>
        <a
          href="/dashboard"
          className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
