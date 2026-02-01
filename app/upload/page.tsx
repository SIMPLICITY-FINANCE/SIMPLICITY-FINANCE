"use client";

import { useState } from "react";
import { ingestEpisode } from "../lib/actions/ingest.js";
import { AppLayout } from "../components/layout/AppLayout.js";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { Input } from "../components/ui/Input.js";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

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
    <AppLayout showRightRail={false} searchPlaceholder="Search...">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Submit a YouTube Video for Processing
            </h2>
            <p className="text-muted-foreground text-sm">
              Enter a YouTube URL to generate a financial summary. The video will be transcribed,
              analyzed, and made available for approval.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
                YouTube URL
              </label>
              <Input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={status === "submitting" || status === "processing"}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {error && (
                <p className="mt-2 text-sm text-destructive">{error}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={status === "submitting" || status === "processing"}
                variant="primary"
                size="lg"
              >
                {status === "submitting" ? "Submitting..." : "Submit Episode"}
              </Button>

              {(status === "complete" || status === "failed") && (
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
                  <span>Validating and submitting...</span>
                </div>
              )}

              {status === "processing" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-medium">Processing episode...</span>
                  </div>
                  
                  <div className="bg-accent/50 border border-border/50 rounded-lg p-4">
                    <p className="text-sm text-foreground mb-2">
                      Your episode has been submitted for processing. This may take several minutes.
                    </p>
                    {runId && (
                      <p className="text-xs text-muted-foreground font-mono">
                        Run ID: {runId}
                      </p>
                    )}
                    {episodeId && (
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        Episode ID: {episodeId}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">The workflow will:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Fetch video metadata from YouTube</li>
                      <li>Download and transcribe audio</li>
                      <li>Generate financial summary with key points</li>
                      <li>Run quality control checks</li>
                      <li>Submit for admin approval</li>
                    </ol>
                  </div>

                  <p className="text-sm text-muted-foreground/70 italic">
                    Check the admin approval queue in a few minutes to review the summary.
                  </p>
                </div>
              )}

              {status === "complete" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                    <span className="font-medium">
                      {isExisting ? "Episode already exists!" : "Successfully submitted!"}
                    </span>
                  </div>

                  {isExisting && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        This episode has already been processed. No duplicate will be created.
                      </p>
                    </div>
                  )}

                  {episodeId && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-lg p-4">
                      <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                        Episode ID: <span className="font-mono">{episodeId}</span>
                      </p>
                      <a href={`/episode/${episodeId}`}>
                        <Button variant="primary" size="sm">
                          View Episode Details →
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {status === "failed" && (
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

        {/* Help Section */}
        <Card className="mt-8 p-6 bg-accent/30">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Supported Formats
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
            <li>• https://youtu.be/VIDEO_ID</li>
          </ul>
        </Card>
      </div>
    </AppLayout>
  );
}
