import { NextRequest, NextResponse } from "next/server";
import { getBookedTimeSlots, hasSupabaseAdmin, normalizeDate } from "@/lib/server/supabase";
import { getGoogleCalendarBusySlotsForDate } from "@/lib/server/google-calendar";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const date = normalizeDate(request.nextUrl.searchParams.get("date") ?? "");

  if (!date) {
    return NextResponse.json({ message: "date query parameter is required." }, { status: 400 });
  }

  if (!hasSupabaseAdmin()) {
    const calendarBusySlots = await getGoogleCalendarBusySlotsForDate(date);
    return NextResponse.json({ bookedTimeSlots: calendarBusySlots, source: "google-calendar" });
  }

  const [bookedTimeSlots, calendarBusySlots] = await Promise.all([
    getBookedTimeSlots(date),
    getGoogleCalendarBusySlotsForDate(date),
  ]);

  return NextResponse.json({ bookedTimeSlots: Array.from(new Set([...bookedTimeSlots, ...calendarBusySlots])) });
}
