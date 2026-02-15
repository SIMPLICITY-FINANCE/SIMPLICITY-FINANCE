import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../../../../lib/db.js";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ showId: string }> }
) {
  try {
    const { showId } = await params;
    const { host_name, host_image_url } = await request.json();

    // Auto-generate slug from name
    const host_slug = host_name
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    await sql`
      UPDATE shows
      SET host_name = ${host_name},
          host_slug = ${host_slug},
          host_image_url = ${host_image_url || null},
          updated_at = NOW()
      WHERE id = ${showId}
    `;

    console.log(`[ADMIN][HOST] Updated host for show ${showId}: ${host_name}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN][HOST] Error updating host:", error);
    return NextResponse.json(
      { error: "Failed to update host" },
      { status: 500 }
    );
  }
}
