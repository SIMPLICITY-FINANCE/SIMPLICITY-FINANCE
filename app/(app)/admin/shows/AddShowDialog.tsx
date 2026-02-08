"use client";

import { useState, useRef, useEffect } from "react";
import { addShow } from "../../../lib/actions/shows.js";
import type { ChannelMetadata } from "../../../lib/youtube/api.js";
import { formatSubscriberCount } from "../../../lib/youtube/parser.js";
import { Loader2, Youtube, CheckCircle, AlertCircle, X, Plus } from "lucide-react";

export function AddShowDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [preview, setPreview] = useState<ChannelMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced URL validation
  function handleUrlInput(value: string) {
    setUrl(value);
    setError(null);
    setPreview(null);
    setSuccess(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim() || (!value.includes("youtube.com") && !value.includes("youtu.be"))) {
      return;
    }

    setValidating(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/shows/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
        const data = await res.json();
        if (data.success && data.channel) {
          setPreview(data.channel);
          setError(null);
        } else {
          setPreview(null);
          setError(data.error || "Invalid YouTube URL");
        }
      } catch {
        setPreview(null);
        setError("Failed to validate URL");
      } finally {
        setValidating(false);
      }
    }, 600);
  }

  async function handleAddShow() {
    if (!url.trim() || !preview) return;

    setLoading(true);
    setError(null);

    try {
      const result = await addShow(url);
      if (result.success) {
        setSuccess(`Added "${preview.name}" successfully!`);
        setTimeout(() => {
          handleClose();
          window.location.reload();
        }, 1000);
      } else {
        setError(result.error || "Failed to add show");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setUrl("");
    setPreview(null);
    setError(null);
    setSuccess(null);
    setValidating(false);
  }

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) handleClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={16} />
        Add Show
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Add YouTube Channel</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Paste any YouTube URL to auto-detect the channel
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* URL Input */}
              <div>
                <label htmlFor="yt-url" className="block text-sm font-medium text-gray-700 mb-1.5">
                  YouTube URL
                </label>
                <input
                  id="yt-url"
                  type="url"
                  placeholder="https://www.youtube.com/@channel..."
                  value={url}
                  onChange={(e) => handleUrlInput(e.target.value)}
                  disabled={loading}
                  className="w-full h-10 px-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1">
                  Supports @handles, /channel/UC..., video URLs
                </p>
              </div>

              {/* Validating spinner */}
              {validating && (
                <div className="flex items-center gap-2 py-3">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">Looking up channel...</span>
                </div>
              )}

              {/* Success message */}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm text-green-700">{success}</span>
                </div>
              )}

              {/* Error message */}
              {error && !loading && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Channel Preview */}
              {preview && !success && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    {preview.thumbnail && (
                      <img
                        src={preview.thumbnail}
                        alt={preview.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{preview.name}</h3>
                      {preview.handle && (
                        <p className="text-sm text-gray-500">{preview.handle}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span>{formatSubscriberCount(preview.subscriberCount)} subscribers</span>
                        <span>{preview.videoCount.toLocaleString()} videos</span>
                      </div>
                    </div>
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-1" />
                  </div>
                </div>
              )}

              {/* Help text when empty */}
              {!preview && !url && !error && !validating && (
                <div className="border border-blue-100 rounded-lg p-4 bg-blue-50/50">
                  <p className="text-sm font-medium text-blue-800 mb-1.5">Accepted formats:</p>
                  <ul className="text-xs text-blue-700 space-y-0.5">
                    <li>• youtube.com/@intothecryptoverse</li>
                    <li>• youtube.com/channel/UCqK_GSMbpiV8spgD3ZGloSw</li>
                    <li>• youtube.com/watch?v=VIDEO_ID (extracts channel)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddShow}
                disabled={loading || !preview || !!error || !!success}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Youtube size={16} />
                    Add Show
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
