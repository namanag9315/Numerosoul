import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { sendPostSessionCare } from "@/lib/server/notifications";
import { hasSupabaseAdmin, updateBookingPostSession } from "@/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!hasSupabaseAdmin()) {
      return NextResponse.json({ message: "Supabase not configured." }, { status: 503 });
    }

    const body = await request.json();
    const bookingId = String(body.bookingId ?? "");

    if (!bookingId) {
      return NextResponse.json({ message: "bookingId is required." }, { status: 400 });
    }

    const payload = await updateBookingPostSession({
      bookingId,
      followUpAt: body.followUpAt ? String(body.followUpAt) : null,
      reportUrl: body.reportUrl ? String(body.reportUrl) : null,
      sessionNotes: body.sessionNotes ? String(body.sessionNotes) : null,
    });
    const result = await sendPostSessionCare(payload);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: unknown) {
    console.error("Post-session route error:", error);
    const message = error instanceof Error ? error.message : "Failed to send post-session details.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
