"use client";

import { useState } from "react";
import { submitIngestRequest } from "../../lib/actions/ingest.js";
import { Card } from "../../components/ui/Card.js";
import { Button } from "../../components/ui/Button.js";
import { Input } from "../../components/ui/Input.js";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export function UploadForm() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [isExisting, setIsExisting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setStatus("submitting");
    setError(null);
    setRequestId(null);
    setIsExisting(false);

    const result = await submitIngestRequest(url);

    if (result.success) {
      setStatus("success");
      setRequestId(result.requestId || null);
      setIsExisting(result.isExisting || false);
      // Note: IngestStatusList auto-refreshes via polling, no manual refresh needed
    } else {
      setStatus("error");
      setError(result.error || "Failed to submit request");
    }
  };

  const reset = () => {
    setUrl("");
    setStatus("idle");
    setError(null);
    setRequestId(null);
    setIsExisting(false);
  };

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Submit Content for Processing
        </h2>
        <p className="text-muted-foreground text-sm">
          Enter a YouTube URL or audio file URL to generate a financial summary. The content will be transcribed,
          analyzed, and made available for approval.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
            Content URL
          </label>
          <Input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or https://example.com/audio.mp3"
            disabled={status === "submitting"}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {error && (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={status === "submitting"}
            variant="primary"
            size="lg"
          >
            {status === "submitting" ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>

          {(status === "success" || status === "error") && (
            <Button
              type="button"
              onClick={reset}
              variant="secondary"
              size="lg"
            >
              Submit Another
            </Button>
          )}
        </div>
      </form>

      {/* Status Display */}
      {status !== "idle" && (
        <div className="mt-8 border-t border-border/30 pt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Status</h3>

          {status === "submitting" && (
            <div className="flex items-center gap-3 text-primary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Submitting request...</span>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
                <span className="font-medium">
                  {isExisting ? "Request already exists!" : "Successfully submitted!"}
                </span>
              </div>

              {isExisting ? (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    This URL has already been submitted. Check the queue below for its status.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                    Your request has been queued for processing. This may take several minutes.
                  </p>
                  {requestId && (
                    <p className="text-xs text-green-700 dark:text-green-300 font-mono">
                      Request ID: {requestId}
                    </p>
                  )}
                  <div className="mt-3 text-sm text-green-800 dark:text-green-200">
                    <p className="mb-2">The workflow will:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Fetch metadata and download audio</li>
                      <li>Transcribe the content</li>
                      <li>Generate financial summary with key points</li>
                      <li>Run quality control checks</li>
                      <li>Submit for admin approval</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-destructive">
                <XCircle className="h-6 w-6" />
                <span className="font-medium">Submission failed</span>
              </div>

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive">
                  {error || "An unexpected error occurred. Please try again."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
