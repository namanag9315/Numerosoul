
import { NextRequest, NextResponse } from "next/server";
import { sendConfirmation } from "@/lib/server/notifications";

import { createGoogleCalendarEvent } from "@/lib/server/google-calendar";
import {
  createInvoiceNumber,
  hasSupabaseAdmin,
  insertBooking,
  normalizeMode,
  publicInvoiceUrl,
  type BookingDetailsInput,
} from "@/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const transactionId = String(body.transactionId ?? "").trim();
  const bookingDetails = (body.bookingDetails ?? {}) as BookingDetailsInput;

  if (!transactionId) {
    return NextResponse.json(
      { message: "Transaction ID (UTR) is required." },
      { status: 400 },
    );
  }

  // We are bypassing Razorpay, so we map the UTR to razorpayPaymentId for DB schema compatibility
  const razorpayOrderId = `manual_${Date.now()}`;
  const razorpayPaymentId = transactionId;

  if (!hasSupabaseAdmin()) {
    return NextResponse.json(
      { message: "Supabase service-role environment variables are not configured." },
      { status: 500 },
    );
  }

  const normalizedMode = normalizeMode(bookingDetails.mode);
  
  const calendarEvent = await createGoogleCalendarEvent(bookingDetails).catch((error: unknown) => {
    console.error("Google Calendar event creation failed:", error);
    return null;
  });
  
  let videoConferenceLink = null;
  const calendarEventId = calendarEvent && typeof calendarEvent === "object" && "id" in calendarEvent
    ? String(calendarEvent.id)
    : null;

  if (normalizedMode === "video") {
    // Generate a secure unique room ID for the native Jitsi session
    const roomId = crypto.randomUUID();
    videoConferenceLink = `${process.env.NEXT_PUBLIC_SITE_URL || "https://numerasoul.in"}/session/${roomId}`;
  }

  const invoiceNumber = createInvoiceNumber();

  // Extract optional auth_user_id if a Bearer token is provided
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const accessToken = authHeader.substring(7);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (authResponse.ok) {
          const userData = await authResponse.json();
          if (userData && userData.id) {
            bookingDetails.authUserId = userData.id;
          }
        }
      } catch (err) {
        console.warn("Failed to verify auth token during booking:", err);
      }
    }
  }

  const bookingId = await insertBooking({
    bookingDetails,
    calendarEventId: calendarEventId,
    invoiceNumber,
    razorpayOrderId,
    razorpayPaymentId,
    videoConferenceUrl: videoConferenceLink,
  });
  const client = bookingDetails.client ?? {};
  const invoiceUrl = publicInvoiceUrl(bookingId);

  await sendConfirmation({
    amountPaid: Number(bookingDetails.total ?? bookingDetails.amount ?? 0),
    bookingId,
    clientEmail: client.email,
    clientName: client.fullName ?? "Client",
    clientPhone: client.phone,
    date: bookingDetails.date ?? "",
    invoiceNumber,
    invoiceUrl,
    mode: normalizedMode,
    service: bookingDetails.serviceName ?? "Numerology Session",
    time: bookingDetails.timeSlot ?? "",
    videoConferenceLink: videoConferenceLink ?? undefined,
  });

  return NextResponse.json({
    bookingId,
    invoiceNumber,
    invoiceUrl,
    success: true,
    videoConferenceLink,
  });
}
