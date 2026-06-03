import { BRAND, brandUrl } from "@/lib/brand";

type ClientInput = {
  dateOfBirth?: string;
  email?: string;
  name: string;
  notes?: string;
  phone: string;
  authUserId?: string | null;
};

export type BookingDetailsInput = {
  additional?: string;
  amount?: number;
  coupon?: string | null;
  client?: {
    additional?: string;
    dob?: string;
    email?: string;
    focus?: string;
    fullName?: string;
    phone?: string;
  };
  date?: string;
  focus?: string;
  mode?: string;
  serviceId?: string;
  serviceName?: string;
  subtotal?: number;
  tax?: number;
  timeSlot?: string;
  total?: number;
  authUserId?: string | null;
};

export type ConfirmationPayload = {
  bookingId: string;
  clientEmail?: string;
  clientName: string;
  clientPhone?: string;
  date: string;
  followUpDate?: string;
  invoiceNumber?: string;
  invoiceUrl?: string;
  mode: string;
  reportUrl?: string;
  service: string;
  sessionNotes?: string;
  time: string;
  videoConferenceLink?: string;
  amountPaid?: number;
};

type SupabaseBookingRow = {
  id: string;
  amount_paid?: number | null;
  booking_date: string;
  follow_up_at?: string | null;
  invoice_number?: string | null;
  report_url?: string | null;
  session_notes?: string | null;
  time_slot: string;
  video_conference_url?: string | null;
  mode: string | null;
  clients?: { date_of_birth?: string | null; email?: string | null; name?: string | null; phone?: string | null } | null;
  services?: { name?: string | null } | null;
};

export function hasSupabaseAdmin() {
  return Boolean(getSupabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function insertToolAnalytic(toolName: string) {
  const response = await supabaseFetch(supabaseUrl("/rest/v1/tool_analytics"), {
    body: JSON.stringify({
      tool_name: toolName,
    }),
    headers: {
      Prefer: "return=representation",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Could not log tool analytic.");
  }

  const rows = (await response.json()) as Array<{ id: string }>;
  return rows[0].id;
}

export async function resolveServiceUuid(serviceIdOrSlug: string) {
  if (isUuid(serviceIdOrSlug)) {
    return serviceIdOrSlug;
  }

  const url = supabaseUrl("/rest/v1/services");
  url.searchParams.set("select", "id");
  url.searchParams.set("slug", `eq.${serviceIdOrSlug}`);
  url.searchParams.set("limit", "1");

  const response = await supabaseFetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error("Could not resolve service.");
  }

  const rows = (await response.json()) as Array<{ id?: string }>;
  const serviceId = rows[0]?.id;

  if (!serviceId) {
    throw new Error("Service not found.");
  }

  return serviceId;
}

export async function insertClient(input: ClientInput) {
  const response = await supabaseFetch(supabaseUrl("/rest/v1/clients"), {
    body: JSON.stringify({
      date_of_birth: normalizeDate(input.dateOfBirth) ?? null,
      email: input.email || null,
      name: input.name,
      notes: input.notes || null,
      phone: input.phone,
      auth_user_id: input.authUserId || null,
    }),
    headers: {
      Prefer: "return=representation",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    console.error("Supabase create client error:", errorText);
    throw new Error(`Could not create client. Supabase Error: ${errorText}`);
  }

  const rows = (await response.json()) as Array<{ id: string }>;
  return rows[0].id;
}

export async function insertBooking({
  bookingDetails,
  calendarEventId,
  invoiceNumber,
  razorpayOrderId,
  razorpayPaymentId,
  videoConferenceUrl,
}: {
  bookingDetails: BookingDetailsInput;
  calendarEventId?: string | null;
  invoiceNumber?: string | null;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  videoConferenceUrl?: string | null;
}) {
  const client = bookingDetails.client ?? {};
  const serviceId = await resolveServiceUuid(String(bookingDetails.serviceId ?? ""));
  const clientId = await insertClient({
    dateOfBirth: client.dob,
    email: client.email,
    name: String(client.fullName ?? "Client"),
    notes: client.focus,
    phone: String(client.phone ?? ""),
    authUserId: bookingDetails.authUserId || null,
  });
  const response = await supabaseFetch(supabaseUrl("/rest/v1/bookings"), {
    body: JSON.stringify({
      additional_dobs: client.additional || bookingDetails.additional || null,
      amount_paid: Math.round(Number(bookingDetails.total ?? bookingDetails.amount ?? 0)),
      booking_date: normalizeDate(bookingDetails.date),
      client_id: clientId,
      focus_areas: client.focus || bookingDetails.focus || null,
      invoice_number: invoiceNumber,
      mode: normalizeMode(bookingDetails.mode),
      calendar_event_id: calendarEventId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      service_id: serviceId,
      status: "confirmed",
      time_slot: normalizeTime(bookingDetails.timeSlot),
      video_conference_url: videoConferenceUrl,
    }),
    headers: {
      Prefer: "return=representation",
    },
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    console.error("Supabase create booking error:", errorText);
    throw new Error(`Could not create booking. Supabase Error: ${errorText}`);
  }

  const rows = (await response.json()) as Array<{ id: string }>;
  return rows[0].id;
}

export async function getBookedTimeSlots(date: string) {
  const normalizedDate = normalizeDate(date);

  if (!normalizedDate) {
    throw new Error("Invalid date.");
  }

  const url = supabaseUrl("/rest/v1/bookings");
  url.searchParams.set("select", "time_slot");
  url.searchParams.set("booking_date", `eq.${normalizedDate}`);
  url.searchParams.set("status", "neq.cancelled");

  const response = await supabaseFetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error("Could not check availability.");
  }

  const rows = (await response.json()) as Array<{ time_slot: string }>;
  return rows.map((row) => formatTimeForDisplay(row.time_slot));
}

export async function getBookedSlotsForMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const start = `${month}-01`;
  const endDate = new Date(year, monthNumber, 0);
  const end = `${month}-${String(endDate.getDate()).padStart(2, "0")}`;
  const url = supabaseUrl("/rest/v1/bookings");
  url.searchParams.set("select", "booking_date,time_slot,service_id,status");
  url.searchParams.set("booking_date", `gte.${start}`);
  url.searchParams.append("booking_date", `lte.${end}`);
  url.searchParams.set("status", "neq.cancelled");

  const response = await supabaseFetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error("Could not load booked slots.");
  }

  const rows = (await response.json()) as Array<{
    booking_date: string;
    service_id?: string;
    status: string;
    time_slot: string;
  }>;

  return rows.map((row) => ({
    date: row.booking_date,
    service_id: row.service_id,
    status: row.status,
    time_slot: formatTimeForDisplay(row.time_slot),
  }));
}

export async function getTomorrowConfirmedBookings() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = normalizeDate(tomorrow.toISOString().slice(0, 10));
  const url = supabaseUrl("/rest/v1/bookings");
  url.searchParams.set(
    "select",
    "id,booking_date,time_slot,mode,amount_paid,invoice_number,video_conference_url,clients(name,email,phone),services(name)",
  );
  url.searchParams.set("booking_date", `eq.${date}`);
  url.searchParams.set("status", "eq.confirmed");

  const response = await supabaseFetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error("Could not load reminders.");
  }

  const rows = (await response.json()) as SupabaseBookingRow[];

  return rows.map((row) => ({
    bookingId: row.id,
    clientEmail: row.clients?.email ?? undefined,
    clientName: row.clients?.name ?? "Client",
    clientPhone: row.clients?.phone ?? undefined,
    date: row.booking_date,
    amountPaid: row.amount_paid ?? undefined,
    invoiceNumber: row.invoice_number ?? undefined,
    invoiceUrl: row.invoice_number ? publicInvoiceUrl(row.id) : undefined,
    mode: row.mode ?? "video",
    service: row.services?.name ?? "Numerology Session",
    time: formatTimeForDisplay(row.time_slot),
    videoConferenceLink: row.video_conference_url ?? undefined,
  }));
}

export async function getDueFollowUpBookings() {
  const url = supabaseUrl("/rest/v1/bookings");
  url.searchParams.set("select", bookingNotificationSelect());
  url.searchParams.set("status", "eq.completed");
  url.searchParams.set("follow_up_at", `lte.${new Date().toISOString()}`);
  url.searchParams.set("follow_up_sent_at", "is.null");
  url.searchParams.set("limit", "50");

  const response = await supabaseFetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error("Could not load follow-up reminders.");
  }

  const rows = (await response.json()) as SupabaseBookingRow[];
  return rows.map(bookingRowToConfirmationPayload);
}

export async function markFollowUpSent(bookingId: string) {
  const url = supabaseUrl("/rest/v1/bookings");
  url.searchParams.set("id", `eq.${bookingId}`);

  const response = await supabaseFetch(url, {
    body: JSON.stringify({
      follow_up_sent_at: new Date().toISOString(),
      last_customer_message_at: new Date().toISOString(),
    }),
    headers: {
      Prefer: "return=minimal",
    },
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Could not mark follow-up as sent.");
  }
}

export async function updateBookingPostSession({
  bookingId,
  followUpAt,
  reportUrl,
  sessionNotes,
}: {
  bookingId: string;
  followUpAt?: string | null;
  reportUrl?: string | null;
  sessionNotes?: string | null;
}) {
  const url = supabaseUrl("/rest/v1/bookings");
  url.searchParams.set("id", `eq.${bookingId}`);
  url.searchParams.set("select", bookingNotificationSelect());

  const response = await supabaseFetch(url, {
    body: JSON.stringify({
      follow_up_at: followUpAt || null,
      report_url: reportUrl || null,
      session_notes: sessionNotes || null,
      status: "completed",
      last_customer_message_at: new Date().toISOString(),
    }),
    headers: {
      Prefer: "return=representation",
    },
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Could not update post-session details.");
  }

  const rows = (await response.json()) as SupabaseBookingRow[];
  const row = rows[0];

  if (!row) {
    throw new Error("Booking not found.");
  }

  return bookingRowToConfirmationPayload(row);
}

export async function getBookingNotificationPayload(bookingId: string) {
  const row = await getBookingRow(bookingId, bookingNotificationSelect());
  return bookingRowToConfirmationPayload(row);
}

export async function getBookingInvoice(bookingId: string) {
  return getBookingRow(
    bookingId,
    [
      "id",
      "booking_date",
      "time_slot",
      "mode",
      "status",
      "amount_paid",
      "invoice_number",
      "razorpay_payment_id",
      "video_conference_url",
      "created_at",
      "clients(name,email,phone,date_of_birth)",
      "services(name,slug,duration_minutes)",
    ].join(","),
  ) as Promise<
    SupabaseBookingRow & {
      created_at?: string;
      razorpay_payment_id?: string | null;
      services?: { duration_minutes?: number | null; name?: string | null; slug?: string | null } | null;
    }
  >;
}

export function createInvoiceNumber(date = new Date()) {
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${BRAND.invoicePrefix}-${datePart}-${suffix}`;
}

export function publicInvoiceUrl(bookingId: string) {
  return brandUrl(`/invoice/${bookingId}`);
}

function bookingNotificationSelect() {
  return [
    "id",
    "booking_date",
    "time_slot",
    "mode",
    "amount_paid",
    "invoice_number",
    "video_conference_url",
    "session_notes",
    "report_url",
    "follow_up_at",
    "clients(name,email,phone)",
    "services(name)",
  ].join(",");
}

async function getBookingRow(bookingId: string, select: string) {
  const url = supabaseUrl("/rest/v1/bookings");
  url.searchParams.set("id", `eq.${bookingId}`);
  url.searchParams.set("select", select);
  url.searchParams.set("limit", "1");

  const response = await supabaseFetch(url, { method: "GET" });

  if (!response.ok) {
    throw new Error("Could not load booking.");
  }

  const rows = (await response.json()) as SupabaseBookingRow[];
  const row = rows[0];

  if (!row) {
    throw new Error("Booking not found.");
  }

  return row;
}

function bookingRowToConfirmationPayload(row: SupabaseBookingRow): ConfirmationPayload {
  return {
    amountPaid: row.amount_paid ?? undefined,
    bookingId: row.id,
    clientEmail: row.clients?.email ?? undefined,
    clientName: row.clients?.name ?? "Client",
    clientPhone: row.clients?.phone ?? undefined,
    date: row.booking_date,
    followUpDate: row.follow_up_at ?? undefined,
    invoiceNumber: row.invoice_number ?? undefined,
    invoiceUrl: publicInvoiceUrl(row.id),
    mode: row.mode ?? "video",
    reportUrl: row.report_url ?? undefined,
    service: row.services?.name ?? "Numerology Session",
    sessionNotes: row.session_notes ?? undefined,
    time: formatTimeForDisplay(row.time_slot),
    videoConferenceLink: row.video_conference_url ?? undefined,
  };
}

export function normalizeMode(mode?: string) {
  if (mode === "WhatsApp Call" || mode === "whatsapp") {
    return "whatsapp";
  }

  if (mode === "In-Person" || mode === "in_person") {
    return "in_person";
  }

  return "video";
}

export function normalizeDate(value?: string) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const dmy = trimmed.match(/^(\d{1,2})[/. -](\d{1,2})[/. -](\d{4})$/);

  if (iso) {
    return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
  }

  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  }

  return null;
}

export function normalizeTime(value?: string) {
  if (!value) {
    return "10:00:00";
  }

  const time24 = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);

  if (time24) {
    return `${time24[1].padStart(2, "0")}:${time24[2]}:00`;
  }

  const time12 = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!time12) {
    return "10:00:00";
  }

  let hour = Number(time12[1]);
  const minute = time12[2];
  const meridiem = time12[3].toUpperCase();

  if (meridiem === "PM" && hour !== 12) {
    hour += 12;
  }

  if (meridiem === "AM" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:${minute}:00`;
}

function formatTimeForDisplay(value: string) {
  const [hourRaw, minute] = value.split(":");
  const hour = Number(hourRaw);
  const hour12 = hour % 12 || 12;
  const meridiem = hour >= 12 ? "PM" : "AM";
  return `${hour12}:${minute} ${meridiem}`;
}

function supabaseUrl(path: string) {
  const baseUrl = getSupabaseUrl();

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  return new URL(path, baseUrl);
}

function supabaseFetch(url: URL, init: RequestInit) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return fetch(url, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    next: { revalidate: 0 },
  });
}

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^["']|["']$/g, '');
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
