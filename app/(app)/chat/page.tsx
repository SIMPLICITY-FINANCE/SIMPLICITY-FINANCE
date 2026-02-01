export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-6">🤖</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Chatbot Coming Soon
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Ask questions about finance podcasts, get personalized recommendations, and explore insights with our AI assistant.
        </p>
        <div className="space-y-4 text-left max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <h3 className="font-semibold text-gray-900">Natural Conversations</h3>
              <p className="text-sm text-gray-600">Chat naturally about finance topics</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h3 className="font-semibold text-gray-900">Smart Search</h3>
              <p className="text-sm text-gray-600">Find exactly what you're looking for</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h3 className="font-semibold text-gray-900">Context-Aware</h3>
              <p className="text-sm text-gray-600">Understands your listening history</p>
            </div>
          </div>
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
