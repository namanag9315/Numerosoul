import { BRAND, brandUrl } from "@/lib/brand";
import type { ConfirmationPayload } from "@/lib/server/supabase";
import { sendMetaWhatsapp } from "@/lib/server/meta-whatsapp";

type LifecycleKind = "confirmation" | "reminder" | "post-session" | "follow-up";

export type CustomerJourneyPayload = ConfirmationPayload & {
  amountPaid?: number;
  followUpDate?: string;
  invoiceNumber?: string;
  invoiceUrl?: string;
  reportUrl?: string;
  sessionNotes?: string;
  videoConferenceLink?: string;
};

type SendResult = {
  emailSent: boolean;
  whatsappFallbackUrl?: string;
  whatsappSent: boolean;
};

type MessageContent = {
  intro: string;
  preheader: string;
  sections: Array<{
    rows?: Array<{ label: string; value?: string | number | null }>;
    text?: string;
    title: string;
  }>;
  subject: string;
  templateEnv: string;
  templateParams: string[];
  title: string;
  whatsapp: string;
  cta?: {
    href: string;
    label: string;
  };
};

export async function sendConfirmation(payload: CustomerJourneyPayload): Promise<SendResult> {
  return sendLifecycleMessage(payload, "confirmation");
}

export async function sendReminder(payload: CustomerJourneyPayload): Promise<SendResult> {
  return sendLifecycleMessage(payload, "reminder");
}

export async function sendPostSessionCare(payload: CustomerJourneyPayload): Promise<SendResult> {
  return sendLifecycleMessage(payload, "post-session");
}

export async function sendFollowUpReminder(payload: CustomerJourneyPayload): Promise<SendResult> {
  return sendLifecycleMessage(payload, "follow-up");
}

async function sendLifecycleMessage(payload: CustomerJourneyPayload, kind: LifecycleKind) {
  const content = buildMessageContent(payload, kind);
  const [emailResult, whatsappResult] = await Promise.allSettled([
    sendBrevoEmail(payload, content),
    sendWhatsapp(payload, content),
  ]);

  return {
    emailSent: emailResult.status === "fulfilled" && emailResult.value,
    whatsappFallbackUrl:
      whatsappResult.status === "fulfilled" ? whatsappResult.value.fallbackUrl : undefined,
    whatsappSent: whatsappResult.status === "fulfilled" && whatsappResult.value.sent,
  };
}

async function sendBrevoEmail(payload: CustomerJourneyPayload, content: MessageContent) {
  const apiKey = process.env.BREVO_API_KEY?.replace(/^["']|["']$/g, '');

  if (!apiKey || !payload.clientEmail) {
    return false;
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? BRAND.email;
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    body: JSON.stringify({
      htmlContent: brandedEmailHtml(payload, content),
      sender: { email: senderEmail, name: BRAND.name },
      subject: content.subject,
      to: [{ email: payload.clientEmail, name: payload.clientName }],
    }),
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  return response.ok;
}

async function sendWhatsapp(payload: CustomerJourneyPayload, content: MessageContent) {
  const phone = payload.clientPhone?.replace(/\D/g, "");
  const fallbackUrl = phone
    ? `https://wa.me/${phone.startsWith("91") ? phone : `91${phone}`}?text=${encodeURIComponent(content.whatsapp)}`
    : undefined;

  if (!phone) {
    return { fallbackUrl, sent: false };
  }

  const templateName = process.env[content.templateEnv];
  const hasMetaWhatsapp = Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

  if (hasMetaWhatsapp) {
    const result = await sendMetaWhatsapp({
      templateName,
      templateParams: templateName ? content.templateParams : undefined,
      text: templateName ? undefined : content.whatsapp,
      to: phone,
    });

    if (result.sent) {
      return { fallbackUrl, sent: true };
    }
  }

  const twilioResult = await sendTwilioWhatsappText(phone, content.whatsapp);
  return { fallbackUrl, sent: twilioResult };
}

async function sendTwilioWhatsappText(phone: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.replace(/^["']|["']$/g, '');
  const authToken = process.env.TWILIO_AUTH_TOKEN?.replace(/^["']|["']$/g, '');
  const from = process.env.TWILIO_WHATSAPP_FROM?.replace(/^["']|["']$/g, '');

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

  return response.ok;
}

function buildMessageContent(payload: CustomerJourneyPayload, kind: LifecycleKind): MessageContent {
  const sessionRows = [
    { label: "Booking ID", value: payload.bookingId },
    { label: "Service", value: payload.service },
    { label: "Date", value: payload.date },
    { label: "Time", value: payload.time },
    { label: "Mode", value: modeLabel(payload.mode) },
    { label: "Video link", value: payload.videoConferenceLink },
    { label: "Invoice", value: payload.invoiceNumber },
    { label: "Paid", value: payload.amountPaid ? formatMoney(payload.amountPaid) : undefined },
  ];

  if (kind === "reminder") {
    return {
      cta: payload.videoConferenceLink
        ? { href: payload.videoConferenceLink, label: "Join Your Session" }
        : undefined,
      intro: `Dear ${payload.clientName}, this is a gentle reminder for your ${payload.service} session with ${BRAND.founder}.`,
      preheader: `Your ${BRAND.name} session is scheduled for ${payload.date} at ${payload.time}.`,
      sections: [
        { rows: sessionRows, title: "Session Details" },
        {
          text: "Please keep your full name, date of birth, key questions, and any additional names or dates ready before the session.",
          title: "Before We Begin",
        },
      ],
      subject: `Reminder: Your ${BRAND.name} session is coming up`,
      templateEnv: "WHATSAPP_TEMPLATE_SESSION_REMINDER",
      templateParams: [
        payload.clientName,
        payload.service,
        payload.date,
        payload.time,
        payload.videoConferenceLink ?? modeLabel(payload.mode),
      ],
      title: "Your session is almost here",
      whatsapp: [
        `Hi ${payload.clientName}, this is a reminder for your ${BRAND.name} ${payload.service} session.`,
        `Date: ${payload.date}`,
        `Time: ${payload.time}`,
        `Mode: ${modeLabel(payload.mode)}`,
        payload.videoConferenceLink ? `Join link: ${payload.videoConferenceLink}` : null,
        "Please keep your questions, names, and DOB details ready.",
        `- ${BRAND.name}`,
      ].filter(Boolean).join("\n"),
    };
  }

  if (kind === "post-session") {
    return {
      cta: payload.reportUrl
        ? { href: payload.reportUrl, label: "Open Your Report" }
        : payload.invoiceUrl
          ? { href: payload.invoiceUrl, label: "Open Your Invoice" }
          : undefined,
      intro: `Dear ${payload.clientName}, thank you for your session with ${BRAND.founder}. Your notes and next steps are below.`,
      preheader: `Your ${BRAND.name} session notes and report are ready.`,
      sections: [
        {
          text: payload.sessionNotes || "Your personalised session notes will be shared here.",
          title: "Session Notes",
        },
        {
          rows: [
            { label: "Report", value: payload.reportUrl },
            { label: "Suggested follow-up", value: payload.followUpDate },
            { label: "Invoice", value: payload.invoiceUrl },
          ],
          title: "Helpful Links",
        },
      ],
      subject: `Your ${BRAND.name} session notes and report`,
      templateEnv: "WHATSAPP_TEMPLATE_POST_SESSION",
      templateParams: [
        payload.clientName,
        payload.service,
        payload.reportUrl ?? "Report shared by email",
        payload.followUpDate ?? "We will follow up with you soon",
      ],
      title: "Your notes and next steps",
      whatsapp: [
        `Hi ${payload.clientName}, thank you for your ${BRAND.name} session.`,
        payload.sessionNotes ? `Notes: ${payload.sessionNotes}` : null,
        payload.reportUrl ? `Report: ${payload.reportUrl}` : null,
        payload.followUpDate ? `Follow-up reminder: ${payload.followUpDate}` : null,
        payload.invoiceUrl ? `Invoice: ${payload.invoiceUrl}` : null,
        `- ${BRAND.name}`,
      ].filter(Boolean).join("\n"),
    };
  }

  if (kind === "follow-up") {
    return {
      cta: { href: brandUrl("/book"), label: "Book a Follow-Up" },
      intro: `Dear ${payload.clientName}, this is a thoughtful follow-up from ${BRAND.name} after your ${payload.service} session.`,
      preheader: "A gentle follow-up for your next aligned step.",
      sections: [
        {
          text: "If you have applied the recommended name, date, colour, number, or timing guidance, this is a good moment to review what shifted and what still needs clarity.",
          title: "Reflection Prompt",
        },
        { rows: [{ label: "Previous session", value: payload.service }], title: "Context" },
      ],
      subject: `A gentle ${BRAND.name} follow-up`,
      templateEnv: "WHATSAPP_TEMPLATE_FOLLOW_UP",
      templateParams: [payload.clientName, payload.service, brandUrl("/book")],
      title: "Checking in after your session",
      whatsapp: [
        `Hi ${payload.clientName}, checking in after your ${BRAND.name} ${payload.service} session.`,
        "If you have applied the guidance, this is a good time to review what shifted and what still needs clarity.",
        `Book a follow-up: ${brandUrl("/book")}`,
        `- ${BRAND.name}`,
      ].join("\n"),
    };
  }

  return {
    cta: payload.videoConferenceLink
      ? { href: payload.videoConferenceLink, label: "Join Video Session" }
      : payload.invoiceUrl
        ? { href: payload.invoiceUrl, label: "Open Your Invoice" }
        : undefined,
    intro: `Dear ${payload.clientName}, your ${BRAND.name} booking is confirmed. We have included your session details, video link, and invoice below.`,
    preheader: `Booking confirmed for ${payload.date} at ${payload.time}.`,
    sections: [
      { rows: sessionRows, title: "Booking Details" },
      {
        rows: [
          { label: "Join link", value: payload.videoConferenceLink || modeDescription(payload.mode) },
          { label: "Invoice link", value: payload.invoiceUrl },
        ],
        title: "Access Links",
      },
      {
        text: "Please keep your full name, date of birth, key questions, and any additional names or DOBs ready before the session.",
        title: "What To Prepare",
      },
    ],
    subject: `Your ${BRAND.name} session is confirmed`,
    templateEnv: "WHATSAPP_TEMPLATE_BOOKING_CONFIRMATION",
    templateParams: [
      payload.clientName,
      payload.service,
      payload.date,
      payload.time,
      payload.videoConferenceLink ?? modeDescription(payload.mode),
      payload.invoiceUrl ?? "",
    ],
    title: "Your session is confirmed",
    whatsapp: [
      `Hi ${payload.clientName}, your ${BRAND.name} session is confirmed.`,
      `Booking ID: ${payload.bookingId}`,
      `Service: ${payload.service}`,
      `Date: ${payload.date}`,
      `Time: ${payload.time}`,
      `Mode: ${modeLabel(payload.mode)}`,
      payload.videoConferenceLink ? `Video link: ${payload.videoConferenceLink}` : `Access: ${modeDescription(payload.mode)}`,
      payload.invoiceUrl ? `Invoice: ${payload.invoiceUrl}` : null,
      "Reply here if you want to share questions before the session.",
      `- ${BRAND.name}`,
    ].filter(Boolean).join("\n"),
  };
}

function brandedEmailHtml(payload: CustomerJourneyPayload, content: MessageContent) {
  const rowsHtml = content.sections.map((section) => {
    const rowMarkup = section.rows
      ?.filter((row) => row.value !== undefined && row.value !== null && row.value !== "")
      .map(
        (row) => `
          <tr>
            <td style="padding:10px 0;color:${BRAND.colors.muted};font-size:13px;">${escapeHtml(row.label)}</td>
            <td style="padding:10px 0;color:${BRAND.colors.ink};font-size:13px;font-weight:700;text-align:right;">${linkifyValue(row.value)}</td>
          </tr>
        `,
      )
      .join("");

    const textMarkup = section.text
      ? `<p style="margin:0;color:${BRAND.colors.ink};font-size:14px;line-height:1.8;">${escapeMultiline(section.text)}</p>`
      : "";

    return `
      <div style="margin-top:22px;border:1px solid #F3E4C4;border-radius:18px;background:#FFFDF9;padding:20px;">
        <h2 style="margin:0 0 12px;font-family:Georgia,serif;color:${BRAND.colors.indigo};font-size:21px;line-height:1.2;">${escapeHtml(section.title)}</h2>
        ${textMarkup}
        ${rowMarkup ? `<table role="presentation" width="100%" style="border-collapse:collapse;">${rowMarkup}</table>` : ""}
      </div>
    `;
  }).join("");

  const ctaHtml = content.cta
    ? `
      <div style="margin-top:26px;text-align:center;">
        <a href="${escapeAttribute(content.cta.href)}" style="display:inline-block;border-radius:999px;background:${BRAND.colors.indigo};color:#ffffff;font-weight:700;text-decoration:none;padding:13px 24px;font-size:14px;">
          ${escapeHtml(content.cta.label)}
        </a>
      </div>
    `
    : "";

  return `
    <div style="margin:0;background:${BRAND.colors.cream};padding:28px 12px;font-family:Arial,sans-serif;color:${BRAND.colors.ink};">
      <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(content.preheader)}</div>
      <div style="max-width:680px;margin:0 auto;border:1px solid #EED9A9;border-radius:26px;overflow:hidden;background:#FFFDF9;box-shadow:0 20px 55px rgba(15,23,42,0.08);">
        <div style="background:${BRAND.colors.indigo};padding:28px;color:#ffffff;">
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#F8D48A;font-weight:700;">${BRAND.founder}</div>
          <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:34px;line-height:1.05;color:#ffffff;">${escapeHtml(content.title)}</h1>
          <p style="margin:12px 0 0;color:#F9E8C5;font-size:14px;line-height:1.7;">${escapeHtml(BRAND.tagline)}</p>
        </div>
        <div style="padding:28px;">
          <p style="margin:0;color:${BRAND.colors.ink};font-size:15px;line-height:1.8;">${escapeHtml(content.intro)}</p>
          ${rowsHtml}
          ${ctaHtml}
          <div style="margin-top:28px;border-top:1px solid #F3E4C4;padding-top:18px;text-align:center;color:${BRAND.colors.muted};font-size:12px;line-height:1.7;">
            <strong style="color:${BRAND.colors.ink};">${BRAND.name}</strong><br/>
            ${BRAND.location}<br/>
            <a href="${brandUrl("/")}" style="color:${BRAND.colors.amberDark};text-decoration:none;">${brandUrl("/")}</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function linkifyValue(value?: string | number | null) {
  const text = String(value ?? "");

  if (/^https?:\/\//i.test(text)) {
    return `<a href="${escapeAttribute(text)}" style="color:${BRAND.colors.amberDark};text-decoration:none;">${escapeHtml(text)}</a>`;
  }

  return escapeHtml(text);
}

function modeLabel(mode: string) {
  if (mode === "whatsapp" || mode === "WhatsApp Call") {
    return "WhatsApp Call";
  }

  if (mode === "in_person" || mode === "In-Person") {
    return "In-person";
  }

  return "Online Video Call";
}

function modeDescription(mode: string) {
  if (mode === "whatsapp" || mode === "WhatsApp Call") {
    return "WhatsApp call";
  }

  if (mode === "in_person" || mode === "In-Person") {
    return `${BRAND.location}`;
  }

  return "Video link will be shared shortly";
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

function escapeMultiline(value: string) {
  return value.split(/\r?\n/).map(escapeHtml).join("<br/>");
}

function escapeHtml(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
