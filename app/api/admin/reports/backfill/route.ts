import { NextResponse } from "next/server";
import { inngest } from "../../../../../inngest/client.js";

export async function POST() {
  try {
    await inngest.send({
      name: "report/backfill-daily",
      data: {},
    });

    return NextResponse.json({ started: true });
  } catch (error) {
    console.error("[BackfillRoute] Failed to trigger backfill:", error);
    return NextResponse.json(
      { error: "Failed to trigger backfill" },
      { status: 500 }
    );
  }
}
