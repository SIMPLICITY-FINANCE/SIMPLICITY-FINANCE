"use client";

import { useState } from "react";
import { ArrowLeft, Calendar, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  generateDailyReportManual,
  generateWeeklyReportManual,
  generateMonthlyReportManual,
  generateQuarterlyReportManual,
} from "../../../../lib/actions/reports.js";

type ReportType = "daily" | "weekly" | "monthly" | "quarterly";
type GenerateStatus = "idle" | "loading" | "success" | "error";

// ─── Date helpers ────────────────────────────────────────────

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0]!;
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateStr(d);
}

function getToday() {
  return toDateStr(new Date());
}

function getMonday(d: Date): Date {
  const result = new Date(d);
  const day = result.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  result.setUTCDate(result.getUTCDate() + diff);
  return result;
}

function getISOWeek(d: Date): number {
  const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getLastWeek() {
  const now = new Date();
  const thisMonday = getMonday(now);
  const lastMonday = new Date(thisMonday);
  lastMonday.setUTCDate(thisMonday.getUTCDate() - 7);
  const lastSunday = new Date(lastMonday);
  lastSunday.setUTCDate(lastMonday.getUTCDate() + 6);
  return { start: toDateStr(lastMonday), end: toDateStr(lastSunday) };
}

function getThisWeek() {
  const now = new Date();
  const mon = getMonday(now);
  return { start: toDateStr(mon), end: toDateStr(now) };
}

function getLastMonth() {
  const now = new Date();
  const y = now.getUTCMonth() === 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear();
  const m = now.getUTCMonth() === 0 ? 12 : now.getUTCMonth();
  const start = `${y}-${String(m).padStart(2, "0")}-01`;
  const lastDay = new Date(Date.UTC(y, m, 0));
  const label = new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return { start, end: toDateStr(lastDay), label };
}

function getThisMonth() {
  const now = new Date();
  const start = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
  const label = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return { start, end: toDateStr(now), label };
}

function getLastQuarter() {
  const now = new Date();
  const q = Math.floor(now.getUTCMonth() / 3);
  const prevQ = q === 0 ? 3 : q - 1;
  const year = q === 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear();
  const start = new Date(Date.UTC(year, prevQ * 3, 1));
  const end = new Date(Date.UTC(year, prevQ * 3 + 3, 0));
  return { start: toDateStr(start), end: toDateStr(end), label: `Q${prevQ + 1} ${year}` };
}

function getThisQuarter() {
  const now = new Date();
  const q = Math.floor(now.getUTCMonth() / 3);
  const start = new Date(Date.UTC(now.getUTCFullYear(), q * 3, 1));
  return { start: toDateStr(start), end: toDateStr(now), label: `Q${q + 1} ${now.getUTCFullYear()}` };
}

function formatDateDisplay(dateStr: string) {
  return new Date(dateStr + "T12:00:00Z").toLocaleDateString("en-US", {
    weekday: "long", month: "short", day: "numeric", year: "numeric",
  });
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const e = new Date(end + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${s} — ${e}`;
}

function computeDateKey(reportType: ReportType, startStr: string): string {
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

// ─── Component ───────────────────────────────────────────────

export default function AdminGenerateReportPage() {
  const [reportType, setReportType] = useState<ReportType>("daily");
  const [datePreset, setDatePreset] = useState<string>("yesterday");
  const [customDate, setCustomDate] = useState(getToday());
  const [customWeekStart, setCustomWeekStart] = useState(getLastWeek().start);
  const [customMonth, setCustomMonth] = useState(new Date().toISOString().substring(0, 7));
  const [customQuarterYear, setCustomQuarterYear] = useState(new Date().getFullYear());
  const [customQuarter, setCustomQuarter] = useState(Math.floor(new Date().getMonth() / 3) + 1);

  const [status, setStatus] = useState<GenerateStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [progress, setProgress] = useState(0);

  // Reset preset when report type changes
  const handleTypeChange = (type: ReportType) => {
    setReportType(type);
    setDatePreset(
      type === "daily" ? "yesterday" :
      type === "weekly" ? "last-week" :
      type === "monthly" ? "last-month" :
      "last-quarter"
    );
    setStatus("idle");
  };

  // Get resolved date range based on current selections
  const getResolvedRange = (): { start: string; end: string; label: string } => {
    if (reportType === "daily") {
      const date =
        datePreset === "yesterday" ? getYesterday() :
        datePreset === "today" ? getToday() :
        customDate;
      return { start: date, end: date, label: formatDateDisplay(date) };
    }
    if (reportType === "weekly") {
      const range =
        datePreset === "last-week" ? getLastWeek() :
        datePreset === "this-week" ? getThisWeek() :
        (() => {
          const d = new Date(customWeekStart + "T12:00:00Z");
          d.setUTCDate(d.getUTCDate() + 6);
          return { start: customWeekStart, end: toDateStr(d) };
        })();
      const dateKey = computeDateKey("weekly", range.start);
      return { ...range, label: `${formatDateRange(range.start, range.end)} (${dateKey})` };
    }
    if (reportType === "monthly") {
      if (datePreset === "last-month") return getLastMonth();
      if (datePreset === "this-month") return getThisMonth();
      const [y, m] = customMonth.split("-").map(Number);
      const start = toDateStr(new Date(Date.UTC(y!, m! - 1, 1)));
      const end = toDateStr(new Date(Date.UTC(y!, m!, 0)));
      const label = new Date(Date.UTC(y!, m! - 1, 15)).toLocaleDateString("en-US", { month: "long", year: "numeric" });
      return { start, end, label };
    }
    // quarterly
    if (datePreset === "last-quarter") return getLastQuarter();
    if (datePreset === "this-quarter") return getThisQuarter();
    const qIdx = customQuarter - 1;
    const start = toDateStr(new Date(Date.UTC(customQuarterYear, qIdx * 3, 1)));
    const end = toDateStr(new Date(Date.UTC(customQuarterYear, qIdx * 3 + 3, 0)));
    return { start, end, label: `Q${customQuarter} ${customQuarterYear}` };
  };

  const resolved = getResolvedRange();
  const dateKey = computeDateKey(reportType, resolved.start);

  const handleGenerate = async () => {
    setStatus("loading");
    setProgress(0);
    setStatusMessage(`Generating ${reportType} report...`);

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 85) { clearInterval(interval); return 85; }
        return p + (p < 30 ? 8 : p < 60 ? 4 : 1);
      });
    }, 400);

    try {
      let res: { success: boolean; message?: string; error?: string };

      switch (reportType) {
        case "daily":
          res = await generateDailyReportManual(resolved.start);
          break;
        case "weekly":
          res = await generateWeeklyReportManual(resolved.start, resolved.end, dateKey);
          break;
        case "monthly": {
          const d = new Date(resolved.start + "T12:00:00Z");
          res = await generateMonthlyReportManual(d.getUTCFullYear(), d.getUTCMonth() + 1, dateKey);
          break;
        }
        case "quarterly": {
          const d = new Date(resolved.start + "T12:00:00Z");
          const q = Math.floor(d.getUTCMonth() / 3) + 1;
          res = await generateQuarterlyReportManual(d.getUTCFullYear(), q, dateKey);
          break;
        }
      }

      clearInterval(interval);
      setProgress(100);

      if (res.success) {
        setStatus("success");
        setStatusMessage(res.message || "Report generation started! Check Inngest dashboard for progress.");
      } else {
        setStatus("error");
        setStatusMessage(res.error || "Failed to start generation.");
      }
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      setStatus("error");
      setStatusMessage(err instanceof Error ? err.message : "Something went wrong. Check Inngest logs.");
    }
  };

  const handleBackfill = async () => {
    setStatus("loading");
    setStatusMessage("Finding dates with missing daily reports...");
    setProgress(20);
    try {
      const res = await fetch("/api/admin/reports/backfill", { method: "POST" });
      if (res.ok) {
        setProgress(100);
        setStatus("success");
        setStatusMessage("Backfill started! Check Inngest dashboard for progress.");
      } else {
        setStatus("error");
        setStatusMessage("Failed to trigger backfill.");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Backfill failed to start.");
    }
  };

  // ─── Date selector per report type ─────────────────────────

  const presetBtn = (value: string, label: string) => (
    <button
      key={value}
      onClick={() => setDatePreset(value)}
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
        datePreset === value
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-card text-foreground border-border hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );

  const renderDateOptions = () => {
    if (reportType === "daily") return (
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {presetBtn("yesterday", "Yesterday")}
          {presetBtn("today", "Today")}
          {presetBtn("custom", "Custom")}
        </div>
        {datePreset === "custom" && (
          <input
            type="date"
            value={customDate}
            max={getToday()}
            onChange={(e) => setCustomDate(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-card"
          />
        )}
      </div>
    );

    if (reportType === "weekly") return (
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {presetBtn("last-week", "Last Week")}
          {presetBtn("this-week", "This Week")}
          {presetBtn("custom", "Custom Week")}
        </div>
        {datePreset === "custom" && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Week starting:</label>
            <input
              type="date"
              value={customWeekStart}
              onChange={(e) => setCustomWeekStart(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-card"
            />
            <span className="text-xs text-muted-foreground">(Mon-Sun)</span>
          </div>
        )}
      </div>
    );

    if (reportType === "monthly") return (
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {presetBtn("last-month", "Last Month")}
          {presetBtn("this-month", "This Month")}
          {presetBtn("custom", "Custom Month")}
        </div>
        {datePreset === "custom" && (
          <input
            type="month"
            value={customMonth}
            onChange={(e) => setCustomMonth(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-card"
          />
        )}
      </div>
    );

    // quarterly
    return (
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {presetBtn("last-quarter", "Last Quarter")}
          {presetBtn("this-quarter", "This Quarter")}
          {presetBtn("custom", "Custom Quarter")}
        </div>
        {datePreset === "custom" && (
          <div className="flex items-center gap-2">
            <select
              value={customQuarter}
              onChange={(e) => setCustomQuarter(Number(e.target.value))}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-card"
            >
              <option value={1}>Q1 (Jan-Mar)</option>
              <option value={2}>Q2 (Apr-Jun)</option>
              <option value={3}>Q3 (Jul-Sep)</option>
              <option value={4}>Q4 (Oct-Dec)</option>
            </select>
            <select
              value={customQuarterYear}
              onChange={(e) => setCustomQuarterYear(Number(e.target.value))}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-card"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };

  const typeLabels: Record<ReportType, string> = {
    daily: "Daily", weekly: "Weekly", monthly: "Monthly", quarterly: "Quarterly",
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground">Generate Report</h1>
        <a href="/admin/reports" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Reports
        </a>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Manually generate reports for any date range.
      </p>

      {/* First Time Setup */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-amber-900 mb-1">First Time Setup</h3>
        <p className="text-sm text-amber-700 mb-3">
          If weekly/monthly reports aren&apos;t working, generate daily reports first.
          This finds all dates with 2+ episodes that don&apos;t have a daily report yet.
        </p>
        <button
          onClick={handleBackfill}
          disabled={status === "loading"}
          className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Generate Missing Daily Reports
        </button>
        <p className="text-xs text-amber-600 mt-2">
          Runs in the background via Inngest. Check{" "}
          <a href="http://localhost:8288" target="_blank" rel="noopener noreferrer" className="underline">
            Inngest dashboard
          </a>{" "}
          for progress.
        </p>
      </div>

      {/* Step 1: Report Type */}
      <div className="bg-card border border-border rounded-lg p-5 mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          1. Report Type
        </h2>
        <div className="flex gap-2 flex-wrap">
          {(["daily", "weekly", "monthly", "quarterly"] as ReportType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                reportType === type
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-card text-foreground border-border hover:bg-muted"
              }`}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Date */}
      <div className="bg-card border border-border rounded-lg p-5 mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          2. Date Range
        </h2>
        {renderDateOptions()}
        {/* Resolved date display */}
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{resolved.label}</span>
          <code className="ml-auto text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{dateKey}</code>
        </div>
      </div>

      {/* Step 3: Generate */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          3. Generate
        </h2>

        <button
          onClick={handleGenerate}
          disabled={status === "loading"}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
          Generate {typeLabels[reportType]} Report
        </button>

        {/* Progress Bar */}
        {status === "loading" && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Processing...</span>
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{statusMessage}</p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-800">{statusMessage}</p>
              <a
                href="http://localhost:8288"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-green-600 hover:text-green-700 underline mt-1 inline-block"
              >
                View in Inngest dashboard
              </a>
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">{statusMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
