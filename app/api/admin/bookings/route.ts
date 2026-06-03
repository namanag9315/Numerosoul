import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { hasSupabaseAdmin, normalizeDate, normalizeTime } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

// GET all bookings
export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!hasSupabaseAdmin()) {
      return NextResponse.json(
        { message: "Supabase not configured." },
        { status: 503 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^["']|["']$/g, '');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const res = await fetch(
      `${supabaseUrl}/rest/v1/bookings?select=id,booking_date,time_slot,mode,status,amount_paid,focus_areas,additional_dobs,invoice_number,video_conference_url,session_notes,report_url,follow_up_at,follow_up_sent_at,created_at,clients(id,name,email,phone,date_of_birth,notes),services(id,name,slug,duration_minutes)&order=booking_date.desc,time_slot.asc`,
      {
        headers: {
          apikey: serviceRoleKey!,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch bookings: ${res.statusText}`);
    }

    const bookings = await res.json();
    return NextResponse.json(bookings);
  } catch (error: unknown) {
    console.error("Fetch bookings error:", error);
    const message = error instanceof Error ? error.message : "Failed to load bookings.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

// PUT to edit/reschedule booking
export async function PUT(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!hasSupabaseAdmin()) {
      return NextResponse.json(
        { message: "Supabase not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id, date, timeSlot, status } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Booking ID is required." },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, string | null> = {};
    if (date !== undefined) updatePayload.booking_date = normalizeDate(date);
    if (timeSlot !== undefined) updatePayload.time_slot = normalizeTime(timeSlot);
    if (status !== undefined) updatePayload.status = status;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^["']|["']$/g, '');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const res = await fetch(`${supabaseUrl}/rest/v1/bookings?id=eq.${id}`, {
      body: JSON.stringify(updatePayload),
      headers: {
        apikey: serviceRoleKey!,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      method: "PATCH",
    });

    if (!res.ok) {
      throw new Error(`Failed to update booking: ${res.statusText}`);
    }

    const updatedRows = await res.json();
    return NextResponse.json({ success: true, booking: updatedRows[0] });
  } catch (error: unknown) {
    console.error("Update booking error:", error);
    const message = error instanceof Error ? error.message : "Failed to update booking.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
