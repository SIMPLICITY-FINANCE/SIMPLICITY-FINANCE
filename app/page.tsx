export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Simplicity Finance
        </h1>
        <p className="text-gray-600 mb-6">
          Finance podcast summarization platform focused on trustworthy, evidence-grounded outputs.
        </p>
        
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Development Links</h2>
            <ul className="space-y-2">
              <li>
                <a href="/admin" className="text-blue-600 hover:underline">
                  Admin Dashboard
                </a>
              </li>
              <li>
                <a href="/dev/login" className="text-blue-600 hover:underline">
                  Dev Login (Set Cookie)
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
