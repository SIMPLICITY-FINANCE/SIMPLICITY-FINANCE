"use client";

import { useState, useMemo } from "react";
import {
  generateDailyReportManual,
  generateWeeklyReportManual,
  generateMonthlyReportManual,
  generateQuarterlyReportManual,
} from "../../../../lib/actions/reports.js";

type ReportType = "daily" | "weekly" | "monthly" | "quarterly";
type PresetPeriod = "last-week" | "last-month" | "last-quarter" | "this-week" | "this-month";

interface PreviewEpisode {
  id: string;
  title: string;
  channel: string;
  published_at: string;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0]!;
}

function formatDisplay(dateStr: string): string {
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimestamp(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) +
    " UTC";
}

/** Get Monday of the week containing `d` */
function getMonday(d: Date): Date {
  const result = new Date(d);
  const day = result.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  result.setUTCDate(result.getUTCDate() + diff);
  return result;
}

/** ISO week number for a date */
function getISOWeek(d: Date): number {
  const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function computePresetRange(preset: PresetPeriod): { start: string; end: string } {
  const now = new Date();
  const today = formatDate(now);

  switch (preset) {
    case "last-week": {
      const thisMonday = getMonday(now);
      const lastMonday = new Date(thisMonday);
      lastMonday.setUTCDate(thisMonday.getUTCDate() - 7);
      const lastSunday = new Date(lastMonday);
      lastSunday.setUTCDate(lastMonday.getUTCDate() + 6);
      return { start: formatDate(lastMonday), end: formatDate(lastSunday) };
    }
    case "this-week": {
      const monday = getMonday(now);
      return { start: formatDate(monday), end: today };
    }
    case "last-month": {
      const y = now.getUTCMonth() === 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear();
      const m = now.getUTCMonth() === 0 ? 12 : now.getUTCMonth(); // 1-indexed
      const start = `${y}-${String(m).padStart(2, "0")}-01`;
      const lastDay = new Date(Date.UTC(y, m, 0)); // day 0 of next month = last day of m
      return { start, end: formatDate(lastDay) };
    }
    case "this-month": {
      const start = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
      return { start, end: today };
    }
    case "last-quarter": {
      const currentQ = Math.floor(now.getUTCMonth() / 3) + 1;
      let qYear = now.getUTCFullYear();
      let prevQ = currentQ - 1;
      if (prevQ === 0) { prevQ = 4; qYear -= 1; }
      const startMonth = (prevQ - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      const start = `${qYear}-${String(startMonth).padStart(2, "0")}-01`;
      const lastDay = new Date(Date.UTC(qYear, endMonth, 0));
      return { start, end: formatDate(lastDay) };
    }
  }
}

function computeDateKey(reportType: ReportType, startStr: string, endStr: string): string {
  const start = new Date(startStr + "T12:00:00Z");
  switch (reportType) {
    case "daily":
      return startStr;
    case "weekly": {
      const wn = getISOWeek(start);
      return `${start.getUTCFullYear()}-W${String(wn).padStart(2, "0")}`;
    }
    case "monthly":
      return `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, "0")}`;
    case "quarterly": {
      const q = Math.floor(start.getUTCMonth() / 3) + 1;
      return `${start.getUTCFullYear()}-Q${q}`;
    }
  }
}

export default function AdminGenerateReportPage() {
  const [reportType, setReportType] = useState<ReportType>("weekly");
  const [dateMode, setDateMode] = useState<"preset" | "custom">("preset");
  const [preset, setPreset] = useState<PresetPeriod>("last-week");
  const [customStart, setCustomStart] = useState(() => formatDate(new Date()));
  const [customEnd, setCustomEnd] = useState(() => formatDate(new Date()));

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const [previewing, setPreviewing] = useState(false);
  const [previewEpisodes, setPreviewEpisodes] = useState<PreviewEpisode[]>([]);
  const [previewLoaded, setPreviewLoaded] = useState(false);

  const [backfilling, setBackfilling] = useState(false);
  const [backfillResult, setBackfillResult] = useState<{ success: boolean; message: string } | null>(null);

  const range = useMemo(() => {
    if (dateMode === "preset") return computePresetRange(preset);
    return { start: customStart, end: customEnd };
  }, [dateMode, preset, customStart, customEnd]);

  const dateKey = useMemo(
    () => computeDateKey(reportType, range.start, range.end),
    [reportType, range.start, range.end]
  );

  const handleBackfill = async () => {
    setBackfilling(true);
    setBackfillResult(null);
    try {
      const res = await fetch("/api/admin/reports/backfill", { method: "POST" });
      if (res.ok) {
        setBackfillResult({ success: true, message: "Backfill started! Check Inngest dashboard for progress." });
      } else {
        setBackfillResult({ success: false, message: "Failed to trigger backfill" });
      }
    } catch (err) {
      setBackfillResult({ success: false, message: err instanceof Error ? err.message : "Unexpected error" });
    } finally {
      setBackfilling(false);
    }
  };

  const handlePreview = async () => {
    setPreviewing(true);
    setPreviewLoaded(false);
    setPreviewEpisodes([]);
    try {
      const res = await fetch("/api/admin/reports/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: range.start, end: range.end }),
      });
      const data = await res.json();
      setPreviewEpisodes(data.episodes || []);
      setPreviewLoaded(true);
    } catch {
      setPreviewEpisodes([]);
      setPreviewLoaded(true);
    } finally {
      setPreviewing(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);

    try {
      let res: { success: boolean; message?: string; error?: string };

      switch (reportType) {
        case "daily":
          res = await generateDailyReportManual(range.start);
          break;
        case "weekly":
          res = await generateWeeklyReportManual(range.start, range.end, dateKey);
          break;
        case "monthly": {
          const d = new Date(range.start + "T12:00:00Z");
          res = await generateMonthlyReportManual(d.getUTCFullYear(), d.getUTCMonth() + 1, dateKey);
          break;
        }
        case "quarterly": {
          const d = new Date(range.start + "T12:00:00Z");
          const q = Math.floor(d.getUTCMonth() / 3) + 1;
          res = await generateQuarterlyReportManual(d.getUTCFullYear(), q, dateKey);
          break;
        }
      }

      setResult({
        success: res.success,
        message: res.success ? (res.message || "Generation started!") : (res.error || "Failed"),
      });
    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : "Unexpected error",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Generate Report</h1>
            <a href="/admin/reports/generate" className="text-sm text-blue-600 hover:underline">
              ← Back to Reports
            </a>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a href="/admin" className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Dashboard</a>
            <a href="/admin/approvals" className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Approvals</a>
            <a href="/admin/reports/generate" className="px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Reports</a>
            <a href="/admin/shows" className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Shows</a>
            <a href="/admin/ops" className="px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700">Ops</a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <p className="text-sm text-gray-600">
          Manually generate reports for any date range. Useful for testing generation logic or backfilling reports.
        </p>

        {/* Backfill Section */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
          <h3 className="font-semibold text-amber-900 mb-1">First Time Setup</h3>
          <p className="text-sm text-amber-700 mb-3">
            If weekly/monthly reports aren&apos;t working, generate daily reports first.
            This finds all dates with 2+ episodes that don&apos;t have a daily report yet and generates them.
          </p>
          <button
            onClick={handleBackfill}
            disabled={backfilling}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {backfilling ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Starting...
              </span>
            ) : (
              "Generate Missing Daily Reports"
            )}
          </button>
          {backfillResult && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              backfillResult.success
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {backfillResult.message}
            </div>
          )}
          <p className="text-xs text-amber-600 mt-2">
            Runs in the background via Inngest. Check <a href="http://localhost:8288" target="_blank" rel="noopener noreferrer" className="underline">Inngest dashboard</a> for progress.
          </p>
        </div>

        {/* Report Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Report Type</h2>
          <div className="flex flex-wrap gap-3">
            {(["daily", "weekly", "monthly", "quarterly"] as ReportType[]).map((t) => (
              <button
                key={t}
                onClick={() => setReportType(t)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  reportType === t
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Date Range</h2>

          {/* Mode toggle */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setDateMode("preset")}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                dateMode === "preset"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Preset
            </button>
            <button
              onClick={() => setDateMode("custom")}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                dateMode === "custom"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Custom
            </button>
          </div>

          {dateMode === "preset" ? (
            <div className="flex flex-wrap gap-2">
              {([
                { value: "last-week", label: "Last Week (Mon–Sun)" },
                { value: "this-week", label: "This Week (Mon–Now)" },
                { value: "last-month", label: "Last Month" },
                { value: "this-month", label: "This Month" },
                { value: "last-quarter", label: "Last Quarter" },
              ] as { value: PresetPeriod; label: string }[]).map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPreset(p.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    preset === p.value
                      ? "bg-blue-100 text-blue-800 border-blue-300"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="block w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <span className="text-gray-400 mt-5">→</span>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="block w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Computed range display */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDisplay(range.start)} — {formatDisplay(range.end)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Date key: <code className="bg-gray-200 px-1 rounded">{dateKey}</code>
                </p>
              </div>
              <button
                onClick={handlePreview}
                disabled={previewing}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 disabled:opacity-50 transition-colors"
              >
                {previewing ? "Loading..." : "Preview Episodes"}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Results */}
        {previewLoaded && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Episode Preview — {previewEpisodes.length} episode{previewEpisodes.length !== 1 ? "s" : ""} found
            </h2>
            {previewEpisodes.length === 0 ? (
              <p className="text-sm text-gray-500">No published episodes found in this date range.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {previewEpisodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{ep.title}</p>
                      <p className="text-xs text-gray-500">{ep.channel}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-xs text-gray-600">
                        {new Date(ep.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(ep.published_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} UTC
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generate Button */}
        <div className="bg-white rounded-lg shadow p-6">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Generating {reportType} report...
              </span>
            ) : (
              `Generate ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`
            )}
          </button>

          {result && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              result.success
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {result.message}
              {result.success && (
                <span className="block text-xs mt-1 opacity-70">
                  Watch Inngest dev server at http://localhost:8288 for progress
                </span>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-3 text-center">
            Report generation runs in the background via Inngest. Check the reports tab for results.
          </p>
        </div>
      </main>
    </div>
  );
}
