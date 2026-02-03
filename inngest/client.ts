import { Inngest } from "inngest";

// Determine if we're in dev mode
const isDevMode = process.env.INNGEST_DEV === "1" || process.env.NODE_ENV !== "production";
const devServerUrl = process.env.INNGEST_DEV_SERVER_URL || "http://localhost:8288";

// Create an Inngest client
export const inngest = new Inngest({
  id: "simplicity-finance",
  
  // In dev mode, use minimal config (no keys required)
  // In production, require proper keys
  ...(isDevMode
    ? {
        eventKey: "local-dev",
        isDev: true,
      }
    : {
        eventKey: process.env.INNGEST_EVENT_KEY!,
        signingKey: process.env.INNGEST_SIGNING_KEY,
      }),
});

// Log Inngest configuration at startup
if (typeof window === "undefined") {
  const mode = isDevMode ? "dev" : "cloud";
  const baseUrl = isDevMode ? devServerUrl : "https://api.inngest.com";
  
  console.log("\n" + "=".repeat(60));
  console.log("[inngest] Configuration:");
  console.log(`  mode: ${mode}`);
  console.log(`  baseUrl: ${baseUrl}`);
  console.log(`  id: simplicity-finance`);
  if (isDevMode) {
    console.log(`  ⚠️  Dev mode enabled - events will execute locally`);
    console.log(`  💡 Start dev server: npx inngest-cli dev -u http://localhost:3000/api/inngest`);
  }
  console.log("=".repeat(60) + "\n");
}
