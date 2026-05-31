import crypto from "crypto";
import { normalizeMode, normalizeTime, type BookingDetailsInput } from "./supabase";

export const DAILY_SLOTS = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

let cachedToken: { token: string; expiresAt: number } | null = null;

export function hasGoogleCalendarConfig(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID
  );
}

async function getAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    throw new Error("Google Calendar credentials are not configured.");
  }

  // Format the private key if it contains escaped newlines
  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  const now = Date.now();
  // Return cached token if valid (with 1-minute safety margin)
  if (cachedToken && cachedToken.expiresAt > now + 60 * 1000) {
    return cachedToken.token;
  }

  const iat = Math.floor(now / 1000);
  const exp = iat + 3600;

  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: email,
    scope: "https://www.googleapis.com/auth/calendar.events",
    aud: "https://oauth2.googleapis.com/token",
    exp,
    iat,
  };

  const base64url = (str: string | Buffer): string => {
    const base64 = typeof str === "string" ? Buffer.from(str).toString("base64") : str.toString("base64");
    return base64
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedClaims = base64url(JSON.stringify(claims));

  const signInput = `${encodedHeader}.${encodedClaims}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signInput);
  const signature = signer.sign(privateKey);

  const jwt = `${signInput}.${base64url(signature)}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to exchange JWT assertion for Google access token: ${errText}`);
  }

  const data = await response.json();
  const token = data.access_token;
  const expiresAt = now + (data.expires_in || 3600) * 1000;

  cachedToken = { token, expiresAt };
  return token;
}

export type GoogleEvent = {
  id: string;
  summary?: string;
  description?: string;
  transparency?: string;
  status?: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
};

export async function getGoogleCalendarEvents(timeMin: Date, timeMax: Date): Promise<GoogleEvent[]> {
  if (!hasGoogleCalendarConfig()) {
    console.warn("Google Calendar credentials are not configured. Returning empty events list.");
    return [];
  }

  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID!);
  const accessToken = await getAccessToken();

  const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`);
  url.searchParams.set("timeMin", timeMin.toISOString());
  url.searchParams.set("timeMax", timeMax.toISOString());
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "250");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to fetch Google Calendar events: ${errText}`);
  }

  const data = await response.json();
  return (data.items || []) as GoogleEvent[];
}

export function getSlotTimeRange(dateStr: string, slotStr: string) {
  const startTimeStr = normalizeTime(slotStr); // e.g. "10:00:00"
  const [h, m, s] = startTimeStr.split(":").map(Number);

  const startIso = `${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}+05:30`;

  // duration is 1 hour
  const endHour = h + 1;
  const endIso = `${dateStr}T${String(endHour).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}+05:30`;

  return {
    start: new Date(startIso),
    end: new Date(endIso),
  };
}

function parseGoogleEventTime(eventTime: { dateTime?: string; date?: string }): Date {
  if (eventTime.dateTime) {
    return new Date(eventTime.dateTime);
  }
  if (eventTime.date) {
    // all-day event (YYYY-MM-DD)
    return new Date(`${eventTime.date}T00:00:00+05:30`);
  }
  throw new Error("Invalid google event time object");
}

export async function getGoogleCalendarBusySlotsForDate(dateStr: string): Promise<string[]> {
  if (!hasGoogleCalendarConfig()) {
    return [];
  }

  const startDate = new Date(`${dateStr}T00:00:00+05:30`);
  const endDate = new Date(`${dateStr}T23:59:59+05:30`);

  try {
    const events = await getGoogleCalendarEvents(startDate, endDate);
    const busySlots: string[] = [];

    for (const slot of DAILY_SLOTS) {
      const { start: slotStart, end: slotEnd } = getSlotTimeRange(dateStr, slot);

      const isBusy = events.some((event) => {
        if (event.status === "cancelled" || event.transparency === "transparent") {
          return false;
        }

        try {
          const eventStart = parseGoogleEventTime(event.start);
          const eventEnd = parseGoogleEventTime(event.end);
          return eventStart < slotEnd && eventEnd > slotStart;
        } catch {
          return false;
        }
      });

      if (isBusy) {
        busySlots.push(slot);
      }
    }

    return busySlots;
  } catch (error) {
    console.error("Error fetching Google Calendar busy slots for date:", error);
    return [];
  }
}

export async function getGoogleCalendarBusySlotsForMonth(
  monthStr: string
): Promise<Array<{ date: string; time_slot: string; status: string }>> {
  if (!hasGoogleCalendarConfig()) {
    return [];
  }

  const [year, monthNum] = monthStr.split("-").map(Number);
  const startDate = new Date(`${monthStr}-01T00:00:00+05:30`);

  const nextMonth = monthNum === 12 ? 1 : monthNum + 1;
  const nextYear = monthNum === 12 ? year + 1 : year;
  const endDate = new Date(`${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:00:00+05:30`);

  try {
    const events = await getGoogleCalendarEvents(startDate, endDate);
    const busySlots: Array<{ date: string; time_slot: string; status: string }> = [];

    const lastDay = new Date(year, monthNum, 0).getDate();
    for (let day = 1; day <= lastDay; day++) {
      const dateStr = `${monthStr}-${String(day).padStart(2, "0")}`;

      for (const slot of DAILY_SLOTS) {
        const { start: slotStart, end: slotEnd } = getSlotTimeRange(dateStr, slot);

        const isBusy = events.some((event) => {
          if (event.status === "cancelled" || event.transparency === "transparent") {
            return false;
          }

          try {
            const eventStart = parseGoogleEventTime(event.start);
            const eventEnd = parseGoogleEventTime(event.end);
            return eventStart < slotEnd && eventEnd > slotStart;
          } catch {
            return false;
          }
        });

        if (isBusy) {
          busySlots.push({
            date: dateStr,
            time_slot: slot,
            status: "confirmed",
          });
        }
      }
    }

    return busySlots;
  } catch (error) {
    console.error("Error fetching Google Calendar busy slots for month:", error);
    return [];
  }
}

export async function createGoogleCalendarEvent(bookingDetails: BookingDetailsInput) {
  if (!hasGoogleCalendarConfig()) {
    console.warn("Google Calendar credentials are not configured. Skipping event creation.");
    return null;
  }

  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID!);
  const accessToken = await getAccessToken();

  const client = bookingDetails.client ?? {};
  const clientName = client.fullName || "Client";
  const dateStr = bookingDetails.date;
  const slotStr = bookingDetails.timeSlot;

  if (!dateStr || !slotStr) {
    throw new Error("Date and Time Slot are required to create a Google Calendar event.");
  }

  const { start: slotStart, end: slotEnd } = getSlotTimeRange(dateStr, slotStr);

  const descriptionLines = [
    `Client: ${clientName}`,
    client.phone ? `Phone: ${client.phone}` : null,
    client.email ? `Email: ${client.email}` : null,
    client.dob ? `DOB: ${client.dob}` : null,
    `Mode: ${bookingDetails.mode || "Online (Video Call)"}`,
    client.focus || bookingDetails.focus ? `Focus Areas: ${client.focus || bookingDetails.focus}` : null,
    client.additional || bookingDetails.additional ? `Additional Info: ${client.additional || bookingDetails.additional}` : null,
  ].filter(Boolean);

  const normalizedMode = normalizeMode(bookingDetails.mode);
  const eventBody: Record<string, unknown> = {
    summary: `NumeroSoul Session: ${clientName} - ${bookingDetails.serviceName || "Numerology Session"}`,
    description: descriptionLines.join("\n"),
    start: {
      dateTime: slotStart.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: slotEnd.toISOString(),
      timeZone: "Asia/Kolkata",
    },
    attendees: client.email ? [{ email: client.email }] : [],
  };

  if (normalizedMode === "video") {
    eventBody.conferenceData = {
      createRequest: {
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
        requestId: crypto.randomUUID(),
      },
    };
  }

  const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`);
  url.searchParams.set("sendUpdates", "all");
  if (normalizedMode === "video") {
    url.searchParams.set("conferenceDataVersion", "1");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventBody),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create Google Calendar event: ${errText}`);
  }

  return await response.json();
}

export function getGoogleConferenceLink(event: unknown) {
  if (!event || typeof event !== "object") {
    return null;
  }

  const googleEvent = event as {
    conferenceData?: {
      entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
    };
    hangoutLink?: string;
  };

  return (
    googleEvent.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri ??
    googleEvent.hangoutLink ??
    null
  );
}
