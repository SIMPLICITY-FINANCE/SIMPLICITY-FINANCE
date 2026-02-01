"use client";

import { useState, useEffect } from "react";
import { retryIngestRequest, deleteIngestRequest } from "../../../lib/actions/retryIngest.js";
import { Card } from "../../../components/ui/Card.js";
import { Chip } from "../../../components/ui/Chip.js";
import { Button } from "../../../components/ui/Button.js";
import { Loader2, CheckCircle2, XCircle, Clock, RefreshCw, Trash2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface IngestRequest {
  id: string;
  user_id: string;
  url: string;
  source: string;
  status: string;
  created_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
  error_message: string | null;
  error_details: any;
  episode_id: string | null;
  inngest_event_id: string | null;
}

interface AdminIngestTableProps {
  initialRequests: IngestRequest[];
}

export function AdminIngestTable({ initialRequests }: AdminIngestTableProps) {
  const [requests, setRequests] = useState<IngestRequest[]>(initialRequests);
  const [retrying, setRetrying] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch("/api/admin/ingest");
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = async (requestId: string) => {
    setRetrying((prev) => new Set(prev).add(requestId));
    
    const result = await retryIngestRequest(requestId);
    
    if (result.success) {
      // Refresh will happen via polling
    } else {
      alert(`Failed to retry: ${result.error}`);
    }
    
    setRetrying((prev) => {
      const next = new Set(prev);
      next.delete(requestId);
      return next;
    });
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this request?")) {
      return;
    }

    setDeleting((prev) => new Set(prev).add(requestId));
    
    const result = await deleteIngestRequest(requestId);
    
    if (result.success) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } else {
      alert(`Failed to delete: ${result.error}`);
    }
    
    setDeleting((prev) => {
      const next = new Set(prev);
      next.delete(requestId);
      return next;
    });
  };

  const toggleExpanded = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDuration = (start: Date | null, end: Date | null) => {
    if (!start || !end) return "—";
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    
    if (diffMin > 0) return `${diffMin}m ${diffSec % 60}s`;
    return `${diffSec}s`;
  };

  if (requests.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg mb-2">No ingest requests</p>
        <p className="text-muted-foreground/70 text-sm">
          Requests will appear here as users submit content
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Stats Summary */}
      <Card className="p-4 bg-accent/30">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {requests.filter((r) => r.status === "queued").length}
            </div>
            <div className="text-xs text-muted-foreground">Queued</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {requests.filter((r) => r.status === "running").length}
            </div>
            <div className="text-xs text-muted-foreground">Running</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {requests.filter((r) => r.status === "succeeded").length}
            </div>
            <div className="text-xs text-muted-foreground">Succeeded</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-destructive">
              {requests.filter((r) => r.status === "failed").length}
            </div>
            <div className="text-xs text-muted-foreground">Failed</div>
          </div>
        </div>
      </Card>

      {/* Requests Table */}
      {requests.map((request) => {
        const isExpanded = expandedRows.has(request.id);
        const isRetrying = retrying.has(request.id);
        const isDeleting = deleting.has(request.id);

        return (
          <Card key={request.id} className="p-4">
            <div className="space-y-3">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {/* Status Badge */}
                    {request.status === "queued" && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <Chip>Queued</Chip>
                      </div>
                    )}
                    {request.status === "running" && (
                      <div className="flex items-center gap-1.5 text-primary">
                        <Loader2 size={14} className="animate-spin" />
                        <Chip>Running</Chip>
                      </div>
                    )}
                    {request.status === "succeeded" && (
                      <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 size={14} />
                        <Chip>Succeeded</Chip>
                      </div>
                    )}
                    {request.status === "failed" && (
                      <div className="flex items-center gap-1.5 text-destructive">
                        <XCircle size={14} />
                        <Chip>Failed</Chip>
                      </div>
                    )}

                    <span className="text-xs text-muted-foreground capitalize">
                      {request.source}
                    </span>
                  </div>

                  <p className="text-sm font-mono text-muted-foreground truncate">
                    {request.url}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {request.status === "failed" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRetry(request.id)}
                      disabled={isRetrying}
                    >
                      {isRetrying ? (
                        <Loader2 size={14} className="mr-1.5 animate-spin" />
                      ) : (
                        <RefreshCw size={14} className="mr-1.5" />
                      )}
                      Retry
                    </Button>
                  )}

                  {request.episode_id && (
                    <a href={`/episode/${request.episode_id}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" size="sm">
                        <ExternalLink size={14} className="mr-1.5" />
                        Episode
                      </Button>
                    </a>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(request.id)}
                    disabled={isDeleting}
                    className="text-destructive hover:text-destructive"
                  >
                    {isDeleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(request.id)}
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </Button>
                </div>
              </div>

              {/* Metadata Row */}
              <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground">
                <div>
                  <div className="font-medium mb-0.5">Created</div>
                  <div>{formatDate(request.created_at)}</div>
                </div>
                <div>
                  <div className="font-medium mb-0.5">Started</div>
                  <div>{formatDate(request.started_at)}</div>
                </div>
                <div>
                  <div className="font-medium mb-0.5">Completed</div>
                  <div>{formatDate(request.completed_at)}</div>
                </div>
                <div>
                  <div className="font-medium mb-0.5">Duration</div>
                  <div>{formatDuration(request.started_at, request.completed_at)}</div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="pt-3 border-t border-border/30 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-medium text-foreground mb-1">Request ID</div>
                      <div className="font-mono text-muted-foreground break-all">{request.id}</div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground mb-1">User ID</div>
                      <div className="font-mono text-muted-foreground break-all">{request.user_id}</div>
                    </div>
                    {request.inngest_event_id && (
                      <div>
                        <div className="font-medium text-foreground mb-1">Inngest Event ID</div>
                        <div className="font-mono text-muted-foreground break-all">{request.inngest_event_id}</div>
                      </div>
                    )}
                    {request.episode_id && (
                      <div>
                        <div className="font-medium text-foreground mb-1">Episode ID</div>
                        <div className="font-mono text-muted-foreground break-all">{request.episode_id}</div>
                      </div>
                    )}
                  </div>

                  {request.error_message && (
                    <div>
                      <div className="font-medium text-destructive mb-2 text-xs">Error Message</div>
                      <div className="bg-destructive/10 border border-destructive/20 rounded p-3 text-xs text-destructive">
                        {request.error_message}
                      </div>
                    </div>
                  )}

                  {request.error_details && (
                    <div>
                      <div className="font-medium text-destructive mb-2 text-xs">Error Details</div>
                      <pre className="bg-destructive/10 border border-destructive/20 rounded p-3 text-xs text-destructive overflow-x-auto">
                        {JSON.stringify(request.error_details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
