"use client";

import { useSavedEpisodes } from "../../contexts/SavedEpisodesContext.js";

export function DebugPanel() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const { savedEpisodeIds } = useSavedEpisodes();
  const idsArray = Array.from(savedEpisodeIds);

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-2 border-yellow-600 rounded-lg p-4 max-w-md shadow-lg z-50">
      <h3 className="font-bold text-sm mb-2">🐛 Debug Panel (DEV ONLY)</h3>
      <div className="text-xs space-y-1">
        <div>
          <strong>Saved IDs Count:</strong> {savedEpisodeIds.size}
        </div>
        {idsArray.length > 0 && (
          <div>
            <strong>First 10 IDs:</strong>
            <div className="font-mono text-xs bg-white p-1 rounded mt-1 max-h-32 overflow-auto">
              {idsArray.slice(0, 10).map((id, i) => (
                <div key={i}>{id}</div>
              ))}
            </div>
          </div>
        )}
        {idsArray.length === 0 && (
          <div className="text-red-600">
            ⚠️ No saved IDs in context
          </div>
        )}
      </div>
    </div>
  );
}
