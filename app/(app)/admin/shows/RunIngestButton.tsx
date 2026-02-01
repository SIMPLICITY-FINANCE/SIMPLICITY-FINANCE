"use client";

import { useState } from "react";
import { useRouter } from "next/navigation.js";
import { runShowIngest } from "../../../lib/actions/runShowIngest.js";

interface RunIngestButtonProps {
  showId: string;
  showName: string;
}

export function RunIngestButton({ showId, showName }: RunIngestButtonProps) {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);

  const handleRunIngest = async () => {
    if (!confirm(`Run ingestion now for "${showName}"?`)) {
      return;
    }

    setIsRunning(true);

    try {
      const result = await runShowIngest(showId);

      if (result.success) {
        alert(result.message || "Ingestion triggered successfully");
        router.refresh();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to run ingestion");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <button
      onClick={handleRunIngest}
      disabled={isRunning}
      className="text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isRunning ? "Running..." : "Run Now"}
    </button>
  );
}
