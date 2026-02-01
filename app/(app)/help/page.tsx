export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-6">❓</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Help & Support
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Get help with Simplicity Finance, browse documentation, and contact support.
        </p>
        <div className="space-y-4 text-left max-w-md mx-auto">
          <a href="/docs" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold text-gray-900">📚 Documentation</h3>
            <p className="text-sm text-gray-600">Learn how to use the platform</p>
          </a>
          <a href="/faq" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold text-gray-900">💡 FAQ</h3>
            <p className="text-sm text-gray-600">Frequently asked questions</p>
          </a>
          <a href="mailto:support@simplicityfinance.com" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold text-gray-900">✉️ Contact Support</h3>
            <p className="text-sm text-gray-600">Get in touch with our team</p>
          </a>
        </div>
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
