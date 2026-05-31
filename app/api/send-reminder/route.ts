import { NextRequest, NextResponse } from "next/server";
import { sendReminder } from "@/lib/server/notifications";
import { getTomorrowConfirmedBookings, hasSupabaseAdmin } from "@/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (cronSecret && authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ message: "Unauthorized.", sent: 0 }, { status: 401 });
  }

  if (!hasSupabaseAdmin()) {
    return NextResponse.json(
      { message: "Supabase service-role environment variables are not configured.", sent: 0 },
      { status: 500 },
    );
  }

  const bookings = await getTomorrowConfirmedBookings();
  const results = await Promise.allSettled(bookings.map((booking) => sendReminder(booking)));

  return NextResponse.json({
    checked: bookings.length,
    sent: results.filter(
      (result) => result.status === "fulfilled" && (result.value.emailSent || result.value.whatsappSent),
    ).length,
  });
}
