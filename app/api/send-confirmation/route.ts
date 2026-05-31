import { NextRequest, NextResponse } from "next/server";
import { sendConfirmation } from "@/lib/server/notifications";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const clientName = String(body.clientName ?? "");
  const service = String(body.service ?? "");
  const date = String(body.date ?? "");
  const time = String(body.time ?? "");
  const bookingId = String(body.bookingId ?? "");

  if (!clientName || !service || !date || !time || !bookingId) {
    return NextResponse.json(
      { message: "clientName, service, date, time, and bookingId are required." },
      { status: 400 },
    );
  }

  const result = await sendConfirmation({
    amountPaid: Number(body.amountPaid ?? 0) || undefined,
    bookingId,
    clientEmail: body.clientEmail,
    clientName,
    clientPhone: body.clientPhone,
    date,
    invoiceNumber: body.invoiceNumber,
    invoiceUrl: body.invoiceUrl,
    mode: String(body.mode ?? "video"),
    service,
    time,
    videoConferenceLink: body.videoConferenceLink,
  });

  return NextResponse.json({
    success: true,
    ...result,
  });
}
