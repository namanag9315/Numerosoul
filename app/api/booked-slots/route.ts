import { NextRequest, NextResponse } from "next/server";
import { getBookedSlotsForMonth, hasSupabaseAdmin } from "@/lib/server/supabase";
import { getGoogleCalendarBusySlotsForMonth } from "@/lib/server/google-calendar";

export const dynamic = "force-dynamic";

type BookingSlot = {
  date: string;
  time_slot: string;
  service_id?: string;
  status: string;
};

const fallbackSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ message: "Month must be YYYY-MM." }, { status: 400 });
  }

  if (hasSupabaseAdmin()) {
    const [slots, calendarSlots] = await Promise.all([
      getBookedSlotsForMonth(month),
      getGoogleCalendarBusySlotsForMonth(month),
    ]);
    return NextResponse.json({ slots: [...slots, ...calendarSlots], source: "supabase-google-calendar" });
  }

  const calendarSlots = await getGoogleCalendarBusySlotsForMonth(month);

  return NextResponse.json({
    slots: [...calendarSlots, ...createFallbackSlots(month)],
    source: calendarSlots.length > 0 ? "google-calendar-local-fallback" : "local-fallback",
  });
}

function createFallbackSlots(month: string): BookingSlot[] {
  const [year, monthNumber] = month.split("-").map(Number);
  const today = new Date();
  const first = new Date(year, monthNumber - 1, 1);

  if (first.getMonth() !== today.getMonth() || first.getFullYear() !== today.getFullYear()) {
    return [];
  }

  const partialDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
  const fullDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5);

  return [
    ...["10:00 AM", "11:00 AM"].map((time_slot) => ({
      date: formatDate(partialDate),
      service_id: "personal-full-reading",
      status: "confirmed",
      time_slot,
    })),
    ...fallbackSlots.map((time_slot) => ({
      date: formatDate(fullDate),
      service_id: "baby-name-numerology",
      status: "confirmed",
      time_slot,
    })),
  ];
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}
