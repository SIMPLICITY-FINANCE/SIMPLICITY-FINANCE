"use client";

import { useState } from "react";
import { toggleShowStatus, deleteShow } from "../../../lib/actions/shows.js";
import { formatSubscriberCount } from "../../../lib/youtube/parser.js";
import { Trash2, ExternalLink, Loader2 } from "lucide-react";

interface ShowData {
  id: string;
  name: string;
  channel_id: string;
  channel_handle: string | null;
  channel_url: string;
  channel_thumbnail: string | null;
  subscriber_count: number | null;
  source_type: string;
  status: string;
  last_videos_to_ingest: number | null;
  last_ingested_at: string | null;
  last_checked_at: string | null;
  total_episodes_ingested: number | null;
  created_at: string;
  episode_count: number;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ShowRow({ show }: { show: ShowData }) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState(show.status);

  async function handleToggle() {
    setToggling(true);
    const newEnabled = status !== "enabled";
    try {
      const result = await toggleShowStatus(show.id, newEnabled);
      if (result.success) {
        setStatus(newEnabled ? "enabled" : "disabled");
      }
    } catch {
      // revert on error
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const result = await deleteShow(show.id);
      if (result.success) {
        window.location.reload();
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const isEnabled = status === "enabled";

  return (
    <div className="grid grid-cols-[1fr_100px_80px_120px_100px] gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
      {/* Show info */}
      <div className="flex items-center gap-3 min-w-0">
        {show.channel_thumbnail ? (
          <img
            src={show.channel_thumbnail}
            alt={show.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500 text-sm font-bold">
            {show.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{show.name}</div>
          <div className="text-xs text-gray-500 truncate">
            {show.channel_handle || show.channel_id}
          </div>
          {show.subscriber_count != null && show.subscriber_count > 0 && (
            <div className="text-[10px] text-gray-400">
              {formatSubscriberCount(show.subscriber_count)} subscribers
            </div>
          )}
        </div>
      </div>

      {/* Status toggle */}
      <div>
        <button
          onClick={handleToggle}
          disabled={toggling}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          style={{ backgroundColor: isEnabled ? "#22c55e" : "#d1d5db" }}
        >
          {toggling ? (
            <Loader2 size={12} className="absolute left-1/2 -translate-x-1/2 animate-spin text-white" />
          ) : (
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                isEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          )}
        </button>
      </div>

      {/* Episode count */}
      <div className="text-sm text-gray-700 font-medium">
        {show.episode_count}
      </div>

      {/* Last ingested */}
      <div className="text-xs text-gray-500">
        {timeAgo(show.last_ingested_at)}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <a
          href={show.channel_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
          title="Open YouTube channel"
        >
          <ExternalLink size={14} />
        </a>

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "..." : "Yes"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600"
            title="Delete show"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
