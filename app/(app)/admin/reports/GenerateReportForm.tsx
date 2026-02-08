"use client";

import { useState } from "react";
import { generateDailyReportManual } from "../../../lib/actions/reports.js";

export function GenerateReportForm() {
  const [date, setDate] = useState(() => {
    // Default to yesterday
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0]!;
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const result = await generateDailyReportManual(date);
      if (result.success) {
        setStatus("success");
        setMessage(result.message || "Report generation started!");
      } else {
        setStatus("error");
        setMessage(result.error || "Failed to start generation");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4">
      <div>
        <label htmlFor="report-date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          id="report-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="block w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Generating...
          </span>
        ) : (
          "Generate Daily Report"
        )}
      </button>

      {status === "success" && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-600 font-medium">{message}</span>
          <a href={`/reports/daily/${date}`} className="text-sm text-blue-600 hover:underline">
            View →
          </a>
        </div>
      )}

      {status === "error" && (
        <span className="text-sm text-red-600 font-medium">{message}</span>
      )}
    </form>
  );
}
