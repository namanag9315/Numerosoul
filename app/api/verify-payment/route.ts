
import { NextRequest, NextResponse } from "next/server";
import { sendConfirmation } from "@/lib/server/notifications";

import { createGoogleCalendarEvent } from "@/lib/server/google-calendar";
import {
  createInvoiceNumber,
  hasSupabaseAdmin,
  insertBooking,
  normalizeMode,
  publicInvoiceUrl,
} from "@/lib/server/supabase";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await readRequestJson(request);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { message: "Payment details are incomplete." },
        { status: 400 },
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return NextResponse.json(
        { message: "Razorpay keys are not configured." },
        { status: 500 },
      );
    }

    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Payment verification failed. Invalid signature." },
        { status: 400 },
      );
    }

    const razorpayOrderId = razorpay_order_id;
    const razorpayPaymentId = razorpay_payment_id;

    if (!hasSupabaseAdmin()) {
      return NextResponse.json(
        { message: "Booking storage is not configured. Please contact NumeroSoul support." },
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
      videoConferenceLink = `${process.env.NEXT_PUBLIC_SITE_URL || "https://numerosoul.in"}/session/${roomId}`;
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
            const userData = await readResponseJson<{ id?: string }>(authResponse, {});
            if (userData.id) {
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
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Payment verification failed. Please contact NumeroSoul support if money was deducted.",
        success: false,
      },
      { status: 500 },
    );
  }
}

async function readRequestJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function readResponseJson<T>(response: Response, fallback: T): Promise<T> {
  const text = await response.text();

  if (!text.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}
