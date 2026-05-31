import { NextRequest, NextResponse } from "next/server";
import { BRAND } from "@/lib/brand";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { hasSupabaseAdmin } from "@/lib/server/supabase";
import { sendMetaWhatsapp } from "@/lib/server/meta-whatsapp";

async function sendTwilioWhatsappText(phone: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) {
    return false;
  }

  const to = phone.startsWith("91") ? `whatsapp:+${phone}` : `whatsapp:+91${phone}`;
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    body: new URLSearchParams({
      Body: message,
      From: from,
      To: to,
    }),
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twilio error: ${errorText}`);
  }
  return true;
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
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

    const { cohort, channel, subject, message } = await request.json();

    if (!cohort || !channel || !message) {
      return NextResponse.json(
        { message: "Missing required fields: cohort, channel, message." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Helper for Supabase requests
    const dbFetch = async (path: string) => {
      const res = await fetch(`${supabaseUrl}${path}`, {
        headers: {
          apikey: serviceRoleKey!,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        next: { revalidate: 0 },
      });
      if (!res.ok) throw new Error("Supabase query failed");
      return res.json();
    };

    // 1. Fetch data
    const [clients, bookings] = await Promise.all([
      dbFetch("/rest/v1/clients?select=id,name,email,phone,marketing_opt_in"),
      dbFetch("/rest/v1/bookings?select=client_id,status"),
    ]);

    // 2. Filter clients by cohort
    type ClientInfo = { id: string; marketing_opt_in?: boolean | null; name: string; email: string | null; phone: string };
    let targetClients: ClientInfo[] = [];

    const activeClientIds = new Set(
      bookings
        .filter((b: { status: string; client_id: string }) => b.status === "confirmed" || b.status === "completed")
        .map((b: { client_id: string }) => b.client_id)
    );

    if (cohort === "active") {
      targetClients = clients.filter((c: ClientInfo) => activeClientIds.has(c.id));
    } else if (cohort === "leads") {
      const allBookingClientIds = new Set(bookings.map((b: { client_id: string }) => b.client_id));
      targetClients = clients.filter((c: ClientInfo) => !allBookingClientIds.has(c.id));
    } else {
      // "all"
      targetClients = clients;
    }

    targetClients = targetClients.filter((client: ClientInfo) => client.marketing_opt_in !== false);

    if (targetClients.length === 0) {
      return NextResponse.json({
        success: true,
        sentCount: 0,
        message: "No clients found in the selected cohort.",
        simulated: false,
      });
    }

    // 3. Dispatch messages
    let sentCount = 0;
    const errors: string[] = [];
    let isSimulated = false;

    if (channel === "email") {
      const apiKey = process.env.BREVO_API_KEY;
      if (!apiKey) {
        isSimulated = true;
      } else {
        const senderEmail = process.env.BREVO_SENDER_EMAIL ?? BRAND.email;
        const emailPromises = targetClients
          .filter((c) => c.email)
          .map(async (client) => {
            try {
              const res = await fetch("https://api.brevo.com/v3/smtp/email", {
                body: JSON.stringify({
                  htmlContent: marketingEmailHtml(client.name, message),
                  sender: { email: senderEmail, name: BRAND.name },
                  subject: subject || `Insights from ${BRAND.name}`,
                  to: [{ email: client.email, name: client.name }],
                }),
                headers: {
                  "api-key": apiKey,
                  "Content-Type": "application/json",
                },
                method: "POST",
              });
              if (res.ok) sentCount++;
              else errors.push(`Email to ${client.email} failed.`);
            } catch (err: unknown) {
              const errMsg = err instanceof Error ? err.message : "Unknown error";
              errors.push(`Email error for ${client.email}: ${errMsg}`);
            }
          });

        await Promise.all(emailPromises);
      }
    } else if (channel === "whatsapp") {
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const twilioSid = process.env.TWILIO_ACCOUNT_SID;

      if ((!accessToken || !phoneNumberId) && !twilioSid) {
        return NextResponse.json(
          { error: "WhatsApp credentials (Meta or Twilio) not configured for broadcasting." },
          { status: 500 }
        );
      }

      const waPromises = targetClients
        .filter((c) => c.phone)
        .map(async (client) => {
          try {
            if (accessToken && phoneNumberId) {
              const result = await sendMetaWhatsapp({
                to: client.phone,
                text: message,
              });
              if (result.sent) {
                sentCount++;
              } else {
                errors.push(`WhatsApp to ${client.phone} failed: ${result.error}`);
              }
            } else {
              const result = await sendTwilioWhatsappText(client.phone, message);
              if (result) {
                sentCount++;
              }
            }
          } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : String(err);
            errors.push(`WhatsApp error for ${client.phone}: ${errMsg}`);
          }
        });

      await Promise.all(waPromises);
    }

    if (isSimulated) {
      console.log(`[${BRAND.name} Marketing Simulation] Channel: ${channel}, Cohort: ${cohort}`);
      console.log(`[Marketing Message]:\n${message}`);
      console.log(`[Targeted Clients]:`, targetClients.map((c: ClientInfo) => `${c.name} (${c.email || c.phone})`));
      return NextResponse.json({
        success: true,
        sentCount: targetClients.length,
        simulated: true,
        recipients: targetClients.map((c) => ({
          name: c.name,
          email: c.email,
          phone: c.phone,
        })),
        message: "Marketing keys are not configured. Simulated broadcast locally.",
      });
    }

    return NextResponse.json({
      success: true,
      sentCount,
      errors: errors.length > 0 ? errors : undefined,
      simulated: false,
    });
  } catch (error: unknown) {
    console.error("Marketing broadcast route error:", error);
    const message = error instanceof Error ? error.message : "Failed to broadcast marketing messages.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

function marketingEmailHtml(clientName: string, message: string) {
  return `
    <div style="margin:0;background:${BRAND.colors.cream};padding:28px 12px;font-family:Arial,sans-serif;color:${BRAND.colors.ink};">
      <div style="max-width:680px;margin:0 auto;border:1px solid #EED9A9;border-radius:24px;overflow:hidden;background:${BRAND.colors.white};box-shadow:0 20px 55px rgba(15,23,42,0.08);">
        <div style="background:${BRAND.colors.indigo};padding:26px;color:#ffffff;">
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#F8D48A;font-weight:700;">${escapeHtml(BRAND.founder)}</div>
          <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:32px;line-height:1.05;color:#ffffff;">${escapeHtml(BRAND.name)}</h1>
          <p style="margin:12px 0 0;color:#F9E8C5;font-size:14px;line-height:1.7;">${escapeHtml(BRAND.tagline)}</p>
        </div>
        <div style="padding:28px;">
          <p style="margin:0 0 16px;color:${BRAND.colors.ink};font-size:15px;line-height:1.8;">Dear ${escapeHtml(clientName)},</p>
          <div style="white-space:pre-wrap;color:${BRAND.colors.ink};font-size:15px;line-height:1.8;">${escapeHtml(message)}</div>
          <div style="margin-top:26px;border-top:1px solid #F3E4C4;padding-top:18px;text-align:center;color:${BRAND.colors.muted};font-size:12px;line-height:1.7;">
            You are receiving this because you connected with ${escapeHtml(BRAND.name)}. Reply to opt out of future promotional messages.<br/>
            ${escapeHtml(BRAND.location)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
