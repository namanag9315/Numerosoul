"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarPlus, MessageCircle, Receipt, Sparkles, Video } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

type StoredBooking = {
  serviceName?: string;
  date?: string;
  timeSlot?: string;
  mode?: string;
  total?: number;
  client?: {
    fullName?: string;
    email?: string;
  };
};

type StoredReceipt = {
  invoiceNumber?: string;
  invoiceUrl?: string;
  videoConferenceLink?: string;
};

export function BookingConfirmedClient() {
  const searchParams = useSearchParams();
  const [storedBooking, setStoredBooking] = useState<StoredBooking | null>(null);
  const [storedReceipt, setStoredReceipt] = useState<StoredReceipt | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("numeraBookingSummary");
      setStoredBooking(raw ? (JSON.parse(raw) as StoredBooking) : null);
      const receiptRaw = localStorage.getItem("numeroBookingReceipt");
      setStoredReceipt(receiptRaw ? (JSON.parse(receiptRaw) as StoredReceipt) : null);
    } catch {
      setStoredBooking(null);
      setStoredReceipt(null);
    }
  }, []);

  const summary = useMemo(() => {
    const serviceName = searchParams.get("service") || storedBooking?.serviceName || "Numerology Session";
    const date = searchParams.get("date") || storedBooking?.date || "";
    const time = searchParams.get("time") || storedBooking?.timeSlot || "";

    return {
      bookingId: searchParams.get("booking") || "confirmed",
      date,
      mode: storedBooking?.mode || "Online (Video Call)",
      invoiceUrl: searchParams.get("invoice") || storedReceipt?.invoiceUrl || "",
      serviceName,
      time,
      total: storedBooking?.total,
      videoConferenceLink: searchParams.get("join") || storedReceipt?.videoConferenceLink || "",
    };
  }, [searchParams, storedBooking, storedReceipt]);
  const icsHref = useMemo(() => createIcsHref(summary), [summary]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[color:var(--cream)] px-6 pb-20 pt-32 sm:px-10 lg:px-16">
      <GoldConfetti />
      <div className="relative z-[1] mx-auto max-w-4xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--teal-pale)] text-[color:var(--teal)]">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-5xl font-medium text-[color:var(--navy)] sm:text-6xl">
          ✓ Booking Confirmed!
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[color:var(--text-secondary)]">
          Your NumeroSoul session is reserved. Your booking details, video link,
          and invoice are being sent by WhatsApp and email.
        </p>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-[color:var(--border)] bg-[color:var(--cream-deep)] p-6 text-left shadow-[0_24px_70px_var(--shadow)]">
          <h2 className="font-display text-3xl font-medium text-[color:var(--navy)]">
            Booking Summary
          </h2>
          <dl className="mt-6 space-y-4 text-sm">
            <SummaryRow label="Booking ID" value={summary.bookingId} />
            <SummaryRow label="Service" value={summary.serviceName} />
            <SummaryRow label="Date" value={summary.date ? formatDisplayDate(summary.date) : "Shared after confirmation"} />
            <SummaryRow label="Time" value={summary.time || "Shared after confirmation"} />
            <SummaryRow label="Mode" value={summary.mode} />
            {summary.videoConferenceLink && <SummaryRow label="Video Link" value="Ready" />}
            {summary.invoiceUrl && <SummaryRow label="Invoice" value="Ready" />}
            {typeof summary.total === "number" && (
              <SummaryRow value={formatCurrency(summary.total)} label="Paid" />
            )}
          </dl>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
          {summary.videoConferenceLink && (
            <a
              href={summary.videoConferenceLink}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[color:var(--sacred-indigo)] px-6 text-sm font-medium text-white shadow-[0_14px_30px_rgba(30,10,60,0.18)] transition hover:shadow-[0_16px_34px_rgba(30,10,60,0.24)]"
            >
              <Video className="h-4 w-4" />
              Open video link
            </a>
          )}
          {summary.invoiceUrl && (
            <a
              href={summary.invoiceUrl}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[color:var(--gold)] bg-white px-6 text-sm font-medium text-[color:var(--gold-dark)] shadow-[0_14px_30px_var(--shadow)] transition hover:bg-[color:var(--gold-pale)]"
            >
              <Receipt className="h-4 w-4" />
              View invoice
            </a>
          )}
          <a
            href={icsHref}
            download="numerosoul-booking.ics"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[color:var(--gold)] px-6 text-sm font-medium text-white shadow-[0_14px_30px_var(--shadow)] transition hover:bg-[color:var(--gold-dark)]"
          >
            <CalendarPlus className="h-4 w-4" />
            Add to Google Calendar
          </a>
          <a
            href={getWhatsAppLink("Hi! My NumeroSoul session is booked and I have a question before my session.")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-medium text-white shadow-[0_14px_30px_rgba(37,211,102,0.22)]"
          >
            <MessageCircle className="h-4 w-4" />
            Chat with us before your session
          </a>
        </div>

        <Link
          href="/#tools"
          className="mt-8 inline-flex text-sm font-medium text-[color:var(--gold)] hover:text-[color:var(--gold-dark)]"
        >
          While you wait, try our free tools →
        </Link>
      </div>
    </section>
  );
}

function GoldConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    let width = 0;
    let height = 0;
    let animationId = 0;
    const particles = Array.from({ length: 110 }, () => ({
      alpha: 0.35 + Math.random() * 0.45,
      radius: 2 + Math.random() * 3,
      speed: 0.8 + Math.random() * 1.8,
      sway: Math.random() * 1.6,
      x: Math.random(),
      y: Math.random(),
    }));

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        const x = particle.x * width + Math.sin(time / 800 + particle.y * 8) * particle.sway * 12;
        const y = ((particle.y * height + time * particle.speed * 0.045) % (height + 40)) - 20;
        context.fillStyle = `rgba(201,151,58,${particle.alpha})`;
        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-5">
      <dt className="text-[color:var(--text-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[color:var(--navy)]">{value}</dd>
    </div>
  );
}

function createIcsHref(summary: {
  date: string;
  serviceName: string;
  time: string;
}) {
  const start = parseDateTime(summary.date, summary.time);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NumeroSoul//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@numerosoul`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcs(`NumeroSoul - ${summary.serviceName}`)}`,
    "DESCRIPTION:Your NumeroSoul numerology consultation.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

function parseDateTime(date: string, time: string) {
  if (!date) {
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  const [hourRaw, minuteRaw] = time.split(/:| /);
  let hour = Number(hourRaw || 10);
  const minute = Number(minuteRaw || 0);

  if (time.includes("PM") && hour !== 12) {
    hour += 12;
  }

  if (time.includes("AM") && hour === 12) {
    hour = 0;
  }

  return new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
}

function formatIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(value: string) {
  return value.replace(/[\\,;]/g, "\\$&").replace(/\n/g, "\\n");
}

function formatDisplayDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
