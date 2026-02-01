"use client";

import { useState, useEffect } from "react";
import { getIngestRequests, type IngestRequest } from "../../lib/actions/getIngestRequests.js";
import { Card } from "../../components/ui/Card.js";
import { Chip } from "../../components/ui/Chip.js";
import { Button } from "../../components/ui/Button.js";
import { Loader2, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Copy } from "lucide-react";

interface IngestStatusListProps {
  initialRequests: IngestRequest[];
}

export function IngestStatusList({ initialRequests }: IngestStatusListProps) {
  const [requests, setRequests] = useState<IngestRequest[]>(initialRequests);
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());

  // Auto-refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const updated = await getIngestRequests();
      setRequests(updated);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleErrorExpanded = (id: string) => {
    setExpandedErrors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg mb-2">No recent uploads</p>
        <p className="text-muted-foreground/70 text-sm">
          Your upload history will appear here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const isErrorExpanded = expandedErrors.has(request.id);
        
        return (
          <Card key={request.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-muted-foreground truncate">
                      {request.url}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  {request.status === "queued" && (
                    <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0">
                      <Clock size={16} />
                      <Chip>Queued</Chip>
                    </div>
                  )}
                  {request.status === "running" && (
                    <div className="flex items-center gap-2 text-primary flex-shrink-0">
                      <Loader2 size={16} className="animate-spin" />
                      <Chip>Running</Chip>
                    </div>
                  )}
                  {request.status === "succeeded" && (
                    <div className="flex items-center gap-2 text-green-600 flex-shrink-0">
                      <CheckCircle2 size={16} />
                      <Chip>Succeeded</Chip>
                    </div>
                  )}
                  {request.status === "failed" && (
                    <div className="flex items-center gap-2 text-destructive flex-shrink-0">
                      <XCircle size={16} />
                      <Chip>Failed</Chip>
                    </div>
                  )}
                </div>
                
                {/* Metadata Row */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span>{formatRelativeTime(request.created_at)}</span>
                  <span>•</span>
                  <span className="capitalize">{request.source}</span>
                  {request.started_at && (
                    <>
                      <span>•</span>
                      <span>Started {formatRelativeTime(request.started_at)}</span>
                    </>
                  )}
                  {request.completed_at && (
                    <>
                      <span>•</span>
                      <span>Completed {formatRelativeTime(request.completed_at)}</span>
                    </>
                  )}
                </div>

                {/* Error Details (Failed Status) */}
                {request.status === "failed" && request.error_message && (
                  <div className="mt-3">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs font-semibold text-destructive">Error:</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(request.error_message || "")}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                            title="Copy error message"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => toggleErrorExpanded(request.id)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                            title={isErrorExpanded ? "Collapse" : "Expand"}
                          >
                            {isErrorExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </div>
                      
                      <p className={`text-xs text-destructive ${isErrorExpanded ? "" : "line-clamp-2"}`}>
                        {request.error_message}
                      </p>

                      {isErrorExpanded && request.error_details && (
                        <div className="mt-3 pt-3 border-t border-destructive/20">
                          <p className="text-xs font-semibold text-destructive mb-2">Details:</p>
                          <pre className="text-xs text-destructive bg-destructive/5 p-2 rounded overflow-x-auto">
                            {JSON.stringify(request.error_details, null, 2)}
                          </pre>
                        </div>
                      )}

                      {request.inngest_event_id && (
                        <div className="mt-2 pt-2 border-t border-destructive/20">
                          <p className="text-xs text-destructive/70">
                            Inngest Event ID:{" "}
                            <button
                              onClick={() => copyToClipboard(request.inngest_event_id || "")}
                              className="font-mono hover:text-destructive transition-colors inline-flex items-center gap-1"
                            >
                              {request.inngest_event_id}
                              <Copy size={12} />
                            </button>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Success Actions */}
                {request.status === "succeeded" && request.episode_id && (
                  <div className="mt-3">
                    <a href={`/episode/${request.episode_id}`}>
                      <Button variant="secondary" size="sm">
                        View Episode →
                      </Button>
                    </a>
                  </div>
                )}

                {/* Running Progress */}
                {request.status === "running" && (
                  <div className="mt-3">
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                      <p className="text-xs text-primary">
                        Processing in progress... This may take several minutes.
                      </p>
                      {request.inngest_event_id && (
                        <p className="text-xs text-primary/70 mt-1 font-mono">
                          Event: {request.inngest_event_id}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
