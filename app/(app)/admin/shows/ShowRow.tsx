"use client";

import { useState } from "react";
import { toggleShowStatus, deleteShow, triggerShowIngestion } from "../../../lib/actions/shows.js";
import { formatSubscriberCount } from "../../../lib/youtube/parser.js";
import { Trash2, ExternalLink, Loader2, Play } from "lucide-react";

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
  host_name: string | null;
  host_slug: string | null;
  host_image_url: string | null;
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
  const [testing, setTesting] = useState(false);
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [status, setStatus] = useState(show.status);
  
  // Host management state
  const [editingHost, setEditingHost] = useState(false);
  const [hostName, setHostName] = useState(show.host_name ?? "");
  const [hostImageUrl, setHostImageUrl] = useState(show.host_image_url ?? "");
  const [savingHost, setSavingHost] = useState(false);

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

  async function handleTestIngestion() {
    setTesting(true);
    setTestMessage(null);
    try {
      const result = await triggerShowIngestion(show.id);
      if (result.success) {
        setTestMessage(result.message || "Ingestion triggered!");
        setTimeout(() => setTestMessage(null), 5000);
      } else {
        setTestMessage(result.error || "Failed");
        setTimeout(() => setTestMessage(null), 5000);
      }
    } catch {
      setTestMessage("Failed to trigger ingestion");
      setTimeout(() => setTestMessage(null), 5000);
    } finally {
      setTesting(false);
    }
  }

  async function handleUpdateHost() {
    setSavingHost(true);
    try {
      const response = await fetch(`/api/admin/shows/${show.id}/host`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host_name: hostName, host_image_url: hostImageUrl }),
      });
      
      if (response.ok) {
        setEditingHost(false);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        console.error("Failed to update host");
      }
    } catch (error) {
      console.error("Error updating host:", error);
    } finally {
      setSavingHost(false);
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
      <div className="flex items-center justify-end gap-1.5">
        <button
          onClick={handleTestIngestion}
          disabled={testing}
          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-600 disabled:opacity-50"
          title="Test ingestion"
        >
          {testing ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
        </button>

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

      {/* Test message - spans full row */}
      {testMessage && (
        <div className="col-span-5 -mt-2 mb-1 px-2">
          <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">{testMessage}</p>
        </div>
      )}

      {/* Host section - spans full row */}
      <div className="col-span-5 bg-gray-50 border border-gray-200 rounded-lg p-4 -mx-6 -mb-4 mt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Host</h3>
          {!editingHost && (
            <button
              onClick={() => setEditingHost(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Edit
            </button>
          )}
        </div>
        
        {editingHost ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Host Name</label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="e.g. Guy Turner"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Host Image URL (optional)</label>
              <input
                type="text"
                value={hostImageUrl}
                onChange={(e) => setHostImageUrl(e.target.value)}
                placeholder="https://example.com/host-image.jpg"
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateHost}
                disabled={savingHost || !hostName.trim()}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {savingHost ? "Saving..." : "Save Host"}
              </button>
              <button
                onClick={() => {
                  setEditingHost(false);
                  setHostName(show.host_name ?? "");
                  setHostImageUrl(show.host_image_url ?? "");
                }}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            {show.host_name ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {show.host_image_url && (
                    <img src={show.host_image_url} className="w-full h-full object-cover" alt={show.host_name} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{show.host_name}</p>
                  <p className="text-xs text-gray-500">{show.host_slug}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No host set</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
