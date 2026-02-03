"use client";

import { useState, useEffect, useRef } from "react";
import { retryIngestRequest, deleteIngestRequest } from "../../../lib/actions/retryIngest.js";
import { Card } from "../../../components/ui/Card.js";
import { Chip } from "../../../components/ui/Chip.js";
import { Button } from "../../../components/ui/Button.js";
import { Loader2, CheckCircle2, XCircle, Clock, RefreshCw, Trash2, ExternalLink, ChevronDown, ChevronUp, Pause, Play, Send, AlertTriangle } from "lucide-react";

interface IngestRequest {
  id: string;
  user_id: string;
  url: string;
  source: string;
  status: string;
  stage: string | null;
  created_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
  error_message: string | null;
  error_details: any;
  episode_id: string | null;
  inngest_event_id: string | null;
  updated_at: Date;
}

interface AdminIngestTableProps {
  initialRequests: IngestRequest[];
}

export function AdminIngestTable({ initialRequests }: AdminIngestTableProps) {
  const [requests, setRequests] = useState<IngestRequest[]>(initialRequests);
  const [retrying, setRetrying] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [resending, setResending] = useState<Set<string>>(new Set());
  const [inngestHealth, setInngestHealth] = useState<{
    mode: string;
    baseUrl: string;
    devServerReachable: boolean;
    error?: string;
    isLocalhost: boolean;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load pause state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ingest-live-updates-paused');
    if (saved === 'true') {
      setIsPaused(true);
    }
  }, []);

  // Check Inngest health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/admin/inngest-health');
        if (response.ok) {
          const data = await response.json();
          setInngestHealth(data);
        }
      } catch (err) {
        console.error('Failed to check Inngest health:', err);
      }
    };
    checkHealth();
  }, []);

  // Auto-refresh every 8 seconds (reduced from 5s)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(async () => {
      const response = await fetch("/api/admin/ingest");
      if (response.ok) {
        const data = await response.json();
        
        // Merge updates in-place instead of replacing entire array
        // This prevents React from remounting components and losing scroll position
        setRequests((prevRequests) => {
          const updatedMap = new Map<string, IngestRequest>(
            data.map((r: IngestRequest) => [r.id, r])
          );
          
          // Update existing items, keep same order
          const merged: IngestRequest[] = prevRequests.map((prevReq) => {
            const updated = updatedMap.get(prevReq.id);
            if (updated) {
              updatedMap.delete(prevReq.id);
              return updated;
            }
            return prevReq;
          });
          
          // Add any new items at the end (not at top to avoid scroll jumps)
          const newItems: IngestRequest[] = Array.from(updatedMap.values());
          return [...merged, ...newItems];
        });
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const togglePause = () => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    localStorage.setItem('ingest-live-updates-paused', String(newPaused));
  };

  const handleResend = async (requestId: string) => {
    setResending((prev) => new Set(prev).add(requestId));
    
    try {
      const response = await fetch('/api/admin/ingest/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[resend] Request ${requestId} resent with event ID ${data.eventId}`);
        // Refresh will happen via polling
      } else {
        const error = await response.json();
        alert(`Failed to resend: ${error.error}`);
      }
    } catch (err: any) {
      alert(`Failed to resend: ${err.message}`);
    } finally {
      setResending((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

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

  // Get most recent request for debug panel
  const mostRecentRequest = requests[0];

  return (
    <div 
      ref={containerRef}
      className="space-y-3" 
      style={{ 
        overflowAnchor: 'none',
        scrollbarGutter: 'stable'
      }}
    >
      {/* Debug Panel - Inngest Health & Most Recent Request */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              🔍 Debug Panel - Inngest Status
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Real-time Inngest connectivity and latest request
            </p>
          </div>
        </div>

        {/* Inngest Health Status */}
        {inngestHealth && (
          <div className="mb-4 p-3 bg-white dark:bg-slate-800 rounded border border-blue-100 dark:border-blue-900">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-foreground">Inngest Configuration</div>
              <div className="flex items-center gap-2">
                {inngestHealth.mode === 'dev' && inngestHealth.devServerReachable && (
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Dev Server Connected
                  </span>
                )}
                {inngestHealth.mode === 'dev' && !inngestHealth.devServerReachable && (
                  <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Dev Server Offline
                  </span>
                )}
                {inngestHealth.mode === 'cloud' && inngestHealth.isLocalhost && (
                  <span className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Using Cloud (should be Dev)
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Mode:</span>{' '}
                <span className="font-mono font-semibold">{inngestHealth.mode}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Base URL:</span>{' '}
                <span className="font-mono text-xs">{inngestHealth.baseUrl}</span>
              </div>
            </div>
            {inngestHealth.error && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-300">
                <strong>Error:</strong> {inngestHealth.error}
              </div>
            )}
            {inngestHealth.mode === 'dev' && !inngestHealth.devServerReachable && (
              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-200">
                <strong>⚠️ Dev Server Not Running</strong>
                <div className="mt-1">Start it with:</div>
                <code className="block mt-1 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                  npx inngest-cli dev -u http://localhost:3000/api/inngest
                </code>
              </div>
            )}
            {inngestHealth.mode === 'cloud' && inngestHealth.isLocalhost && (
              <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded text-xs text-orange-800 dark:text-orange-200">
                <strong>⚠️ Running in Cloud Mode on Localhost</strong>
                <div className="mt-1">Add to .env.local:</div>
                <code className="block mt-1 bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded">
                  INNGEST_DEV=1
                </code>
                <div className="mt-1">Then restart the dev server.</div>
              </div>
            )}
          </div>
        )}

        {/* Most Recent Request */}
        {mostRecentRequest ? (
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs font-semibold text-foreground">Most Recent Request</div>
              {mostRecentRequest.inngest_event_id && (
                <a
                  href={`http://localhost:8288/events/${mostRecentRequest.inngest_event_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink size={12} />
                  View in Inngest
                </a>
              )}
            </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="bg-white dark:bg-slate-800 rounded p-2 border border-blue-100 dark:border-blue-900">
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <div className="font-semibold text-sm capitalize">{mostRecentRequest.status}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded p-2 border border-blue-100 dark:border-blue-900">
              <div className="text-xs text-muted-foreground mb-1">Stage</div>
              <div className="font-semibold text-sm">
                {mostRecentRequest.stage || '—'}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded p-2 border border-blue-100 dark:border-blue-900">
              <div className="text-xs text-muted-foreground mb-1">Updated</div>
              <div className="font-semibold text-sm text-xs">
                {formatDate(mostRecentRequest.updated_at)}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded p-2 border border-blue-100 dark:border-blue-900">
              <div className="text-xs text-muted-foreground mb-1">Request ID</div>
              <div className="font-mono text-xs truncate">
                {mostRecentRequest.id.substring(0, 8)}...
              </div>
            </div>
          </div>

          {mostRecentRequest.error_message && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-3 mb-3">
              <div className="text-xs font-semibold text-red-900 dark:text-red-100 mb-1">
                ❌ Error Message
              </div>
              <div className="text-xs text-red-700 dark:text-red-300 font-mono">
                {mostRecentRequest.error_message}
              </div>
            </div>
          )}

          {mostRecentRequest.error_details && (
            <details className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-3">
              <summary className="text-xs font-semibold text-red-900 dark:text-red-100 cursor-pointer">
                📋 Error Details (click to expand)
              </summary>
              <pre className="mt-2 text-xs text-red-700 dark:text-red-300 overflow-x-auto">
                {JSON.stringify(mostRecentRequest.error_details, null, 2)}
              </pre>
            </details>
          )}

            {mostRecentRequest.status === 'running' && !mostRecentRequest.stage && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Note:</strong> If this stays in "running" with no stage for more than 1 minute, check:
                <ul className="list-disc list-inside mt-1 ml-2 space-y-0.5">
                  <li>Inngest Dev Server is running (<code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">npm run inngest:dev</code>)</li>
                  <li>Next.js dev server is running (<code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">npm run dev</code>)</li>
                  <li>Check terminal for <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">🚀 PROCESS_EPISODE_START</code> log</li>
                </ul>
              </div>
            )}

            {mostRecentRequest.status === 'queued' && !mostRecentRequest.started_at && (
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded p-3 text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Stuck in Queued:</strong> This request hasn't started executing.
                {inngestHealth?.mode === 'cloud' && inngestHealth.isLocalhost && (
                  <div className="mt-1">
                    You're in <strong>Cloud mode</strong> on localhost. Switch to Dev mode (see above).
                  </div>
                )}
                {inngestHealth?.mode === 'dev' && !inngestHealth.devServerReachable && (
                  <div className="mt-1">
                    Dev server is not running. Start it to execute requests locally.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center py-4">
            No ingest requests yet. Submit a URL to get started.
          </div>
        )}
      </Card>

      {/* Controls Bar */}
      <Card className="p-3 bg-accent/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePause}
            className="flex items-center gap-2"
          >
            {isPaused ? (
              <>
                <Play size={14} />
                Resume Updates
              </>
            ) : (
              <>
                <Pause size={14} />
                Pause Updates
              </>
            )}
          </Button>
          {isPaused && (
            <span className="text-xs text-muted-foreground">
              Live updates paused
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {requests.length} total requests
        </div>
      </Card>

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
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
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

                    {/* Stage Badge (inline, small) */}
                    {request.stage && request.status === "running" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {request.stage}
                      </span>
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
                  {request.status === "queued" && !request.started_at && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleResend(request.id)}
                      disabled={resending.has(request.id)}
                      title="Resend this request to Inngest"
                    >
                      {resending.has(request.id) ? (
                        <Loader2 size={14} className="mr-1.5 animate-spin" />
                      ) : (
                        <Send size={14} className="mr-1.5" />
                      )}
                      Resend
                    </Button>
                  )}

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

              {/* Metadata Row - Fixed height to prevent layout shifts */}
              <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground min-h-[40px]">
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
