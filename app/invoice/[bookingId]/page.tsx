import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintInvoiceButton } from "@/components/invoice/PrintInvoiceButton";
import { BRAND } from "@/lib/brand";
import { getBookingInvoice, hasSupabaseAdmin } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invoice",
  description: `Invoice from ${BRAND.name}.`,
};

export default async function InvoicePage({ params }: { params: { bookingId: string } }) {
  if (!hasSupabaseAdmin()) {
    return (
      <main className="min-h-screen bg-[color:var(--ethereal-pearl)] px-6 pt-32">
        <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-white p-8 text-slate-700">
          Invoice access needs Supabase service-role environment variables configured.
        </div>
      </main>
    );
  }

  const booking = await getBookingInvoice(params.bookingId).catch(() => null);

  if (!booking) {
    notFound();
  }

  const amountPaid = Number(booking.amount_paid ?? 0);
  const invoiceNumber = booking.invoice_number ?? `${BRAND.invoicePrefix}-${booking.id.slice(0, 8).toUpperCase()}`;

  return (
    <main className="min-h-screen bg-[color:var(--ethereal-pearl)] px-6 pb-20 pt-32 print:bg-white print:px-0 print:pb-0 print:pt-0">
      <div className="mx-auto mb-6 flex max-w-4xl justify-end print:hidden">
        <PrintInvoiceButton />
      </div>

      <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#E8A020]/20 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] print:rounded-none print:border-none print:shadow-none">
        <header className="grid gap-6 border-b border-[#E8A020]/15 bg-[#1E0A3C] p-8 text-white sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[3px] text-[#F8D48A]">{BRAND.founder}</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">{BRAND.name}</h1>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[#F9E8C5]">{BRAND.tagline}</p>
            <p className="mt-3 text-xs font-semibold text-[#F9E8C5]">{BRAND.location}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold uppercase tracking-[2px] text-[#F8D48A]">Invoice</p>
            <p className="mt-2 font-numeral text-xl font-bold">{invoiceNumber}</p>
            <p className="mt-1 text-xs text-[#F9E8C5]">Issued: {formatDisplayDate(booking.booking_date)}</p>
          </div>
        </header>

        <div className="p-8">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">Billed To</p>
              <p className="mt-2 font-semibold text-slate-900">{booking.clients?.name ?? "Client"}</p>
              <p className="text-sm text-slate-500">{booking.clients?.phone}</p>
              {booking.clients?.email && <p className="text-sm text-slate-500">{booking.clients.email}</p>}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">Consultant</p>
              <p className="mt-2 font-semibold text-slate-900">{BRAND.founder}</p>
              <p className="text-sm text-slate-500">{BRAND.location}</p>
              <p className="text-sm text-slate-500">{BRAND.email}</p>
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-[#E8A020]/15">
            <table className="min-w-full divide-y divide-[#E8A020]/15">
              <thead className="bg-[#E8A020]/6">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                    Service
                  </th>
                  <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-[1px] text-slate-500">
                    Schedule
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-[1px] text-slate-500">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-5 py-5 text-sm font-semibold text-slate-900">
                    {booking.services?.name ?? "Numerology Consultation"}
                    <span className="mt-1 block text-xs font-medium text-slate-400">
                      Duration: {booking.services?.duration_minutes ?? 60} minutes
                    </span>
                  </td>
                  <td className="px-5 py-5 text-center text-sm font-semibold text-slate-600">
                    {formatDisplayDate(booking.booking_date)}
                    <span className="block text-xs text-slate-400">{formatTimeForDisplay(booking.time_slot)}</span>
                  </td>
                  <td className="px-5 py-5 text-right font-numeral text-sm font-bold text-slate-900">
                    {formatCurrency(amountPaid)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-xs space-y-3 text-sm font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-numeral">{formatCurrency(amountPaid)}</span>
              </div>
              <div className="flex justify-between border-t border-[#E8A020]/15 pt-3 text-base font-bold text-slate-900">
                <span>Total Paid</span>
                <span className="font-numeral">{formatCurrency(amountPaid)}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 rounded-xl border border-[#E8A020]/15 bg-[#FAF6EE] p-5 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[1px] text-slate-400">Payment ID</span>
              <span className="font-numeral font-semibold text-slate-800">{booking.razorpay_payment_id ?? "Recorded"}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[1px] text-slate-400">Mode</span>
              <span className="font-semibold text-slate-800">{formatMode(booking.mode ?? "video")}</span>
            </div>
            {booking.video_conference_url && (
              <div className="sm:col-span-2">
                <span className="block text-[10px] font-bold uppercase tracking-[1px] text-slate-400">Video Link</span>
                <a className="break-all font-semibold text-[#D4700A]" href={booking.video_conference_url}>
                  {booking.video_conference_url}
                </a>
              </div>
            )}
          </div>

          <p className="mt-10 border-t border-[#E8A020]/15 pt-6 text-center text-xs font-semibold text-slate-400">
            Thank you for trusting {BRAND.name}. Guided cycles, clear choices, and aligned timing.
          </p>
        </div>
      </section>
    </main>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00+05:30`));
}

function formatTimeForDisplay(value: string) {
  const [hourRaw, minute] = value.split(":");
  const hour = Number(hourRaw);
  const hour12 = hour % 12 || 12;
  const meridiem = hour >= 12 ? "PM" : "AM";
  return `${hour12}:${minute} ${meridiem}`;
}

function formatMode(mode: string) {
  if (mode === "whatsapp") return "WhatsApp Call";
  if (mode === "in_person") return "In-person";
  return "Online Video Call";
}
