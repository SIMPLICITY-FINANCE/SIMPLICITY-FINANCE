"use client";

import { useState } from "react";
import { useRouter } from "next/navigation.js";

interface ShowFormProps {
  show?: {
    id: string;
    name: string;
    description: string | null;
    ingest_enabled: boolean;
    ingest_source: string | null;
    youtube_channel_id: string | null;
    youtube_playlist_id: string | null;
    rss_feed_url: string | null;
    ingest_frequency: string | null;
  };
}

export function ShowForm({ show }: ShowFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: show?.name || "",
    description: show?.description || "",
    ingest_enabled: show?.ingest_enabled || false,
    ingest_source: show?.ingest_source || "youtube_channel",
    youtube_channel_id: show?.youtube_channel_id || "",
    youtube_playlist_id: show?.youtube_playlist_id || "",
    rss_feed_url: show?.rss_feed_url || "",
    ingest_frequency: show?.ingest_frequency || "daily",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Show name is required";
    }

    if (formData.ingest_enabled) {
      if (!formData.ingest_source) {
        newErrors.ingest_source = "Source type is required when ingestion is enabled";
      }

      if (formData.ingest_source === "youtube_channel" && !formData.youtube_channel_id.trim()) {
        newErrors.youtube_channel_id = "YouTube Channel ID is required";
      }

      if (formData.ingest_source === "youtube_playlist" && !formData.youtube_playlist_id.trim()) {
        newErrors.youtube_playlist_id = "YouTube Playlist ID is required";
      }

      if (formData.ingest_source === "rss") {
        if (!formData.rss_feed_url.trim()) {
          newErrors.rss_feed_url = "RSS Feed URL is required";
        } else {
          try {
            new URL(formData.rss_feed_url);
          } catch {
            newErrors.rss_feed_url = "Must be a valid URL";
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/shows", {
        method: show ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: show?.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save show");
      }

      router.push("/admin/shows");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save show");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Show Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., All-In Podcast"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description of the show"
        />
      </div>

      {/* Ingest Enabled */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="ingest_enabled"
          checked={formData.ingest_enabled}
          onChange={(e) => setFormData({ ...formData, ingest_enabled: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="ingest_enabled" className="ml-2 block text-sm text-gray-700">
          Enable automatic episode ingestion
        </label>
      </div>

      {formData.ingest_enabled && (
        <>
          {/* Ingest Source */}
          <div>
            <label htmlFor="ingest_source" className="block text-sm font-medium text-gray-700 mb-1">
              Source Type *
            </label>
            <select
              id="ingest_source"
              value={formData.ingest_source}
              onChange={(e) => setFormData({ ...formData, ingest_source: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ingest_source ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="youtube_channel">YouTube Channel</option>
              <option value="youtube_playlist">YouTube Playlist</option>
              <option value="rss">RSS Feed</option>
            </select>
            {errors.ingest_source && <p className="mt-1 text-sm text-red-600">{errors.ingest_source}</p>}
          </div>

          {/* YouTube Channel ID */}
          {formData.ingest_source === "youtube_channel" && (
            <div>
              <label htmlFor="youtube_channel_id" className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Channel ID *
              </label>
              <input
                type="text"
                id="youtube_channel_id"
                value={formData.youtube_channel_id}
                onChange={(e) => setFormData({ ...formData, youtube_channel_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
                  errors.youtube_channel_id ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="UC..."
              />
              {errors.youtube_channel_id && <p className="mt-1 text-sm text-red-600">{errors.youtube_channel_id}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Find this in the channel URL or page source
              </p>
            </div>
          )}

          {/* YouTube Playlist ID */}
          {formData.ingest_source === "youtube_playlist" && (
            <div>
              <label htmlFor="youtube_playlist_id" className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Playlist ID *
              </label>
              <input
                type="text"
                id="youtube_playlist_id"
                value={formData.youtube_playlist_id}
                onChange={(e) => setFormData({ ...formData, youtube_playlist_id: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
                  errors.youtube_playlist_id ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="PL..."
              />
              {errors.youtube_playlist_id && <p className="mt-1 text-sm text-red-600">{errors.youtube_playlist_id}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Find this in the playlist URL: ?list=...
              </p>
            </div>
          )}

          {/* RSS Feed URL */}
          {formData.ingest_source === "rss" && (
            <div>
              <label htmlFor="rss_feed_url" className="block text-sm font-medium text-gray-700 mb-1">
                RSS Feed URL *
              </label>
              <input
                type="url"
                id="rss_feed_url"
                value={formData.rss_feed_url}
                onChange={(e) => setFormData({ ...formData, rss_feed_url: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.rss_feed_url ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://example.com/feed.xml"
              />
              {errors.rss_feed_url && <p className="mt-1 text-sm text-red-600">{errors.rss_feed_url}</p>}
            </div>
          )}

          {/* Ingest Frequency */}
          <div>
            <label htmlFor="ingest_frequency" className="block text-sm font-medium text-gray-700 mb-1">
              Ingestion Frequency
            </label>
            <select
              id="ingest_frequency"
              value={formData.ingest_frequency}
              onChange={(e) => setFormData({ ...formData, ingest_frequency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              How often to check for new episodes (currently runs daily at 2 AM UTC)
            </p>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : show ? "Update Show" : "Create Show"}
        </button>
        <a
          href="/admin/shows"
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
