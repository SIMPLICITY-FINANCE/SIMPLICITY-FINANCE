import { NextResponse } from "next/server";

const isDevMode = process.env.INNGEST_DEV === "1" || process.env.NODE_ENV !== "production";
const devServerUrl = process.env.INNGEST_DEV_SERVER_URL || "http://localhost:8288";

export async function GET() {
  const mode = isDevMode ? "dev" : "cloud";
  const baseUrl = isDevMode ? devServerUrl : "https://api.inngest.com";

  let devServerReachable = false;
  let error: string | undefined;

  if (isDevMode) {
    try {
      // Try to reach the dev server
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

      const response = await fetch(`${devServerUrl}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      devServerReachable = response.ok;

      if (!response.ok) {
        error = `Dev server responded with status ${response.status}`;
      }
    } catch (err: any) {
      devServerReachable = false;
      if (err.name === "AbortError") {
        error = "Dev server timeout (not responding)";
      } else {
        error = err.message || "Failed to connect to dev server";
      }
    }
  }

  return NextResponse.json({
    mode,
    baseUrl,
    devServerReachable,
    error,
    isLocalhost: typeof window === "undefined" && process.env.VERCEL !== "1",
  });
}
