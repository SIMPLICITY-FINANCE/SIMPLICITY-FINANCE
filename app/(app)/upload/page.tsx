"use client";

import { useState, useEffect } from "react";
import { ingestEpisode } from "../../lib/actions/ingest.js";
import { Card } from "../../components/ui/Card.js";
import { Button } from "../../components/ui/Button.js";
import { Input } from "../../components/ui/Input.js";
import { Chip } from "../../components/ui/Chip.js";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

type Status = "idle" | "submitting" | "processing" | "complete" | "failed";

interface QueueItem {
  id: string;
  title: string;
  url: string;
  status: "processing" | "complete" | "failed";
  submittedAt: Date;
  episodeId?: string;
}

// Demo queue data (in production, fetch from DB)
const demoQueue: QueueItem[] = [
  {
    id: "1",
    title: "Market Analysis: Fed Policy and Tech Earnings",
    url: "https://youtube.com/watch?v=abc123",
    status: "complete",
    submittedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    episodeId: "ep-123",
  },
  {
    id: "2",
    title: "Quarterly Economic Outlook - January 2026",
    url: "https://youtube.com/watch?v=def456",
    status: "processing",
    submittedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
  },
  {
    id: "3",
    title: "Understanding the Federal Reserve's Balance Sheet",
    url: "https://youtube.com/watch?v=ghi789",
    status: "failed",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
];

export default function UploadPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [episodeId, setEpisodeId] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [isExisting, setIsExisting] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>(demoQueue);

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

        {/* Recent Uploads Queue */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Recent Uploads
          </h3>
          
          {queue.length === 0 ? (
            <Card className="p-8 text-center">
              <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-2">No recent uploads</p>
              <p className="text-muted-foreground/70 text-sm">
                Your upload history will appear here
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {queue.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                          {item.title}
                        </h4>
                        {item.status === "processing" && (
                          <div className="flex items-center gap-2 text-primary flex-shrink-0">
                            <Loader2 size={16} className="animate-spin" />
                            <Chip>Processing</Chip>
                          </div>
                        )}
                        {item.status === "complete" && (
                          <div className="flex items-center gap-2 text-green-600 flex-shrink-0">
                            <CheckCircle2 size={16} />
                            <Chip>Complete</Chip>
                          </div>
                        )}
                        {item.status === "failed" && (
                          <div className="flex items-center gap-2 text-destructive flex-shrink-0">
                            <XCircle size={16} />
                            <Chip>Failed</Chip>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {new Date(item.submittedAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span className="truncate">{item.url}</span>
                      </div>
                      {item.episodeId && item.status === "complete" && (
                        <div className="mt-2">
                          <a href={`/episode/${item.episodeId}`}>
                            <Button variant="secondary" size="sm">
                              View Episode →
                            </Button>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

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
  );
}
