"use client";

import { useState } from "react";
import { ingestEpisode } from "../lib/actions/ingest.js";

type Status = "idle" | "submitting" | "processing" | "complete" | "failed";

export default function UploadPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [episodeId, setEpisodeId] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [isExisting, setIsExisting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setStatus("submitting");
    setError(null);
    setEpisodeId(null);
    setRunId(null);
    setIsExisting(false);

    const result = await ingestEpisode(url);

    if (result.success) {
      if (result.isExisting) {
        setStatus("complete");
        setEpisodeId(result.episodeId || null);
        setIsExisting(true);
      } else {
        setStatus("processing");
        setEpisodeId(result.episodeId || null);
        setRunId(result.runId || null);
      }
    } else {
      setStatus("failed");
      setError(result.error || "Failed to submit episode");
    }
  };

  const reset = () => {
    setUrl("");
    setStatus("idle");
    setError(null);
    setEpisodeId(null);
    setRunId(null);
    setIsExisting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Upload Episode</h1>
            <a href="/" className="text-blue-600 hover:text-blue-800 text-sm">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Submit a YouTube Video for Processing
            </h2>
            <p className="text-gray-600 text-sm">
              Enter a YouTube URL to generate a financial summary. The video will be transcribed,
              analyzed, and made available for approval.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={status === "submitting" || status === "processing"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={status === "submitting" || status === "processing"}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {status === "submitting" ? "Submitting..." : "Submit Episode"}
              </button>

              {(status === "complete" || status === "failed") && (
                <button
                  type="button"
                  onClick={reset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Submit Another
                </button>
              )}
            </div>
          </form>

          {/* Status Display */}
          {status !== "idle" && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>

              {status === "submitting" && (
                <div className="flex items-center gap-3 text-blue-600">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span>Validating and submitting...</span>
                </div>
              )}

              {status === "processing" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-blue-600">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="font-medium">Processing episode...</span>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 mb-2">
                      Your episode has been submitted for processing. This may take several minutes.
                    </p>
                    {runId && (
                      <p className="text-xs text-blue-600 font-mono">
                        Run ID: {runId}
                      </p>
                    )}
                    {episodeId && (
                      <p className="text-xs text-blue-600 font-mono mt-1">
                        Episode ID: {episodeId}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-gray-600">
                    <p className="mb-2">The workflow will:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Fetch video metadata from YouTube</li>
                      <li>Download and transcribe audio</li>
                      <li>Generate financial summary with key points</li>
                      <li>Run quality control checks</li>
                      <li>Submit for admin approval</li>
                    </ol>
                  </div>

                  <p className="text-sm text-gray-500 italic">
                    Check the admin approval queue in a few minutes to review the summary.
                  </p>
                </div>
              )}

              {status === "complete" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">
                      {isExisting ? "Episode already exists!" : "Successfully submitted!"}
                    </span>
                  </div>

                  {isExisting && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        This episode has already been processed. No duplicate will be created.
                      </p>
                    </div>
                  )}

                  {episodeId && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800 mb-3">
                        Episode ID: <span className="font-mono">{episodeId}</span>
                      </p>
                      <a
                        href={`/episode/${episodeId}`}
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        View Episode Details →
                      </a>
                    </div>
                  )}
                </div>
              )}

              {status === "failed" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-red-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="font-medium">Submission failed</span>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">
                      {error || "An unexpected error occurred. Please try again."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Supported Formats
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
            <li>• https://youtu.be/VIDEO_ID</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
