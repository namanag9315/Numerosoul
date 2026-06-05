"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { SERVICES, type NumerologyService } from "@/lib/services";
import { serviceIcons } from "@/components/services/serviceIcons";
import { supabase } from "@/lib/supabase-client";

type BookingMode = "Online (Video Call)" | "WhatsApp Call" | "In-Person";

type ClientDetails = {
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  focus: string;
  additional: string;
};

type BookedSlot = {
  date: string;
  time_slot: string;
  service_id?: string;
  status: string;
};

type CouponState = {
  code: string;
  discount: number;
  message: string;
};



const steps = ["Choose Service", "Pick Date & Time", "Your Details", "Payment"];
const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
const modes: BookingMode[] = ["Online (Video Call)", "WhatsApp Call", "In-Person"];
const focusSuggestions = [
  { label: "Career clarity", text: "I want clarity about my career and next 6-12 months." },
  { label: "Name correction", text: "Please check my name spelling and suggest corrections if needed." },
  { label: "Baby name", text: "I need help choosing a baby name with family harmony." },
  { label: "Compatibility", text: "Please check compatibility for marriage or partnership." },
  { label: "Lo Shu grid", text: "I want to understand my Lo Shu grid, missing numbers, and remedies." },
  { label: "Business timing", text: "Please check my business name, launch date, and lucky colours." },
];
const initialDetails: ClientDetails = {
  fullName: "",
  dob: "",
  phone: "",
  email: "",
  focus: "",
  additional: "",
};

export function BookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get("service");
  const [step, setStep] = useState(0);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    preselectedServiceId && SERVICES.some((service) => service.id === preselectedServiceId)
      ? preselectedServiceId
      : null,
  );
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<BookingMode>("Online (Video Call)");
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
  const [isHoldingSlot, setIsHoldingSlot] = useState(false);
  const [details, setDetails] = useState<ClientDetails>(initialDetails);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ClientDetails, string>>>({});
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<CouponState | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profiles, setProfiles] = useState<any[]>([]);
  useEffect(() => {
    const fetchProfiles = async (token: string) => {
      try {
        const res = await fetch("/api/user/profiles", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await readJsonResponse<unknown[]>(res);
          setProfiles(Array.isArray(data) ? data : []);
        }
      } catch {
        // ignore
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        if (!details.email) {
          setDetails(prev => ({
            ...prev,
            email: session.user.email || prev.email,
            fullName: session.user.user_metadata?.full_name || prev.fullName
          }));
        }
        fetchProfiles(session.access_token);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        if (!details.email) {
          setDetails(prev => ({
            ...prev,
            email: session.user.email || prev.email,
            fullName: session.user.user_metadata?.full_name || prev.fullName
          }));
        }
        fetchProfiles(session.access_token);
      } else {
        setProfiles([]);
      }
    });

    // Restore state if available
    const saved = localStorage.getItem("bookingFlowState");
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.step) setStep(state.step);
        if (state.selectedServiceId) setSelectedServiceId(state.selectedServiceId);
        if (state.selectedDate) setSelectedDate(state.selectedDate);
        if (state.selectedSlot) setSelectedSlot(state.selectedSlot);
        if (state.selectedMode) setSelectedMode(state.selectedMode);
        if (state.details) setDetails(state.details);
      } catch {
        // ignore parse error
      }
      localStorage.removeItem("bookingFlowState");
    }

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleSignIn = async () => {
    localStorage.setItem("bookingFlowState", JSON.stringify({
      step,
      selectedServiceId,
      selectedDate,
      selectedSlot,
      selectedMode,
      details,
    }));
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
  };

  const selectedService = useMemo(
    () => SERVICES.find((service) => service.id === selectedServiceId) ?? null,
    [selectedServiceId],
  );
  const subtotal = selectedService?.amountInr ?? 0;
  const discount = Math.min(coupon?.discount ?? 0, subtotal);
  const taxable = Math.max(subtotal - discount, 0);
  const tax = Math.round(taxable * 0.18);
  const total = taxable + tax;

  useEffect(() => {
    const controller = new AbortController();
    const month = formatMonthKey(visibleMonth);

    fetch(`/api/booked-slots?month=${month}`, { signal: controller.signal })
      .then((response) => readJsonResponse<{ slots?: BookedSlot[] }>(response))
      .then((data) => setBookedSlots(Array.isArray(data.slots) ? data.slots : []))
      .catch(() => setBookedSlots([]));

    return () => controller.abort();
  }, [visibleMonth]);

  const continueFromDetails = () => {
    const errors = validateDetails(details);
    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      setStep(3);
    }
  };

  const selectDate = (date: Date) => {
    const dateKey = formatDateKey(date);

    if (isPastDate(date) || isFullyBooked(dateKey, bookedSlots, selectedServiceId)) {
      return;
    }

    setSelectedDate(dateKey);
    setSelectedSlot(null);
    setHoldExpiresAt(null);
    fetch(`/api/check-availability?date=${dateKey}`)
      .then((response) => readJsonResponse<{ bookedTimeSlots?: string[] }>(response))
      .then((data) => {
        const bookedTimeSlots = data.bookedTimeSlots;

        if (!Array.isArray(bookedTimeSlots)) {
          return;
        }

        setBookedSlots((current) => [
          ...current.filter((slot) => slot.date !== dateKey),
          ...bookedTimeSlots.map((timeSlot: string) => ({
            date: dateKey,
            status: "confirmed",
            time_slot: timeSlot,
          })),
        ]);
      })
      .catch(() => undefined);
  };

  const selectSlot = async (slot: string) => {
    if (!selectedService || !selectedDate) {
      return;
    }

    setSelectedSlot(slot);
    setIsHoldingSlot(true);

    try {
      const response = await fetch("/api/hold-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: selectedDate,
          timeSlot: slot,
        }),
      });
      const data = await readJsonResponse<{ expiresAt?: string | null }>(response);
      setHoldExpiresAt(data.expiresAt ?? null);
    } catch {
      setHoldExpiresAt(null);
    } finally {
      setIsHoldingSlot(false);
    }
  };

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();

    if (!code || !selectedService) {
      return;
    }

    setCouponLoading(true);
    setCoupon(null);

    try {
      const response = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, serviceId: selectedService.id, subtotal }),
      });
      const data = await readJsonResponse<{
        discount?: number;
        message?: string;
        valid?: boolean;
      }>(response);

      if (!response.ok || !data.valid) {
        setCoupon({ code, discount: 0, message: data.message ?? "Coupon not valid." });
        return;
      }

      setCoupon({
        code,
        discount: data.discount ?? 0,
        message: data.message ?? "Coupon applied.",
      });
    } catch {
      setCoupon({ code, discount: 0, message: "Could not validate coupon." });
    } finally {
      setCouponLoading(false);
    }
  };

  const payNow = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      return;
    }

    setPaymentLoading(true);
    setPaymentError("");

    const bookingPayload = {
      serviceId: selectedService.id,
      serviceName: selectedService.title,
      date: selectedDate,
      timeSlot: selectedSlot,
      mode: selectedMode,
      client: details,
      coupon: coupon?.discount ? coupon.code : null,
      subtotal,
      discount,
      tax,
      total,
    };

    try {
      localStorage.setItem("numeraBookingSummary", JSON.stringify(bookingPayload));
      
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const orderData = await readJsonResponse<{
        amount?: number;
        currency?: string;
        message?: string;
        orderId?: string;
        success?: boolean;
      }>(orderResponse);

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.message || "Failed to create order.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.replace(/^["']|["']$/g, ''),
        amount: orderData.amount,
        currency: orderData.currency,
        name: "NumeroSoul",
        description: selectedService.title,
        order_id: orderData.orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          try {
            await verifyPayment({
              booking: bookingPayload,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          } catch (error) {
            setPaymentError(error instanceof Error ? error.message : "Payment verification failed.");
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: details.fullName,
          email: details.email,
          contact: details.phone,
        },
        theme: {
          color: "#E8A020",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on('payment.failed', function (response: any) {
        setPaymentError(response.error.description || "Payment failed. Please try again.");
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Could not initiate payment.");
      setPaymentLoading(false);
    }
  };

  const verifyPayment = async ({
    booking,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }: {
    booking: Record<string, unknown>;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setPaymentLoading(true);
    const response = await fetch("/api/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
      },
      body: JSON.stringify({
        bookingDetails: booking,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      }),
    });
    const data = await readJsonResponse<{
      bookingId?: string;
      invoiceNumber?: string;
      invoiceUrl?: string;
      message?: string;
      success?: boolean;
      videoConferenceLink?: string;
    }>(response);

    if (!response.ok || !data.success) {
      throw new Error(data.message ?? "Payment verification failed. Please contact us if money was deducted.");
    }

    localStorage.setItem(
      "numeroBookingReceipt",
      JSON.stringify({
        invoiceNumber: data.invoiceNumber,
        invoiceUrl: data.invoiceUrl,
        videoConferenceLink: data.videoConferenceLink,
      }),
    );

    router.push(
      `/booking-confirmed?booking=${encodeURIComponent(data.bookingId ?? razorpay_order_id)}&service=${encodeURIComponent(
        selectedService?.title ?? "",
      )}&date=${encodeURIComponent(selectedDate ?? "")}&time=${encodeURIComponent(selectedSlot ?? "")}&invoice=${encodeURIComponent(
        data.invoiceUrl ?? "",
      )}&join=${encodeURIComponent(data.videoConferenceLink ?? "")}`,
    );
  };
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="booking-mobile-shell mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-10 sm:pb-20 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow text-[10px] sm:text-xs">✦ Secure your numerology session ✦</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-[color:var(--text-primary)] sm:mt-4 sm:text-5xl">
          Book a <span className="italic text-[color:var(--sunrise-orange)]">Session</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base">
          Choose your reading, pick a slot, add the details Uma needs, and complete payment in a few clear steps.
        </p>
      </div>

      <ProgressIndicator currentStep={step} />

      <div id="booking-flow-panel" className="booking-flow-card card-premium mt-6 overflow-visible rounded-lg p-4 sm:mt-10 sm:p-8">
        {step === 0 && (
          <ServiceSelection
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
          />
        )}
        {step === 1 && selectedService && (
          <DateTimeStep
            bookedSlots={bookedSlots}
            holdExpiresAt={holdExpiresAt}
            isHoldingSlot={isHoldingSlot}
            selectedDate={selectedDate}
            selectedMode={selectedMode}
            selectedServiceId={selectedService.id}
            selectedSlot={selectedSlot}
            selectDate={selectDate}
            selectSlot={selectSlot}
            setSelectedMode={setSelectedMode}
            setVisibleMonth={setVisibleMonth}
            visibleMonth={visibleMonth}
          />
        )}
        {step === 2 && (
          <DetailsStep
            details={details}
            errors={fieldErrors}
            setDetails={setDetails}
            session={session}
            handleSignIn={handleSignIn}
            profiles={profiles}
          />
        )}
        {step === 3 && selectedService && selectedDate && selectedSlot && (
          <PaymentStep
            applyCoupon={applyCoupon}
            coupon={coupon}
            couponInput={couponInput}
            couponLoading={couponLoading}
            discount={discount}
            paymentError={paymentError}
            paymentLoading={paymentLoading}
            selectedDate={selectedDate}
            selectedMode={selectedMode}
            selectedService={selectedService}
            selectedSlot={selectedSlot}
            setCouponInput={setCouponInput}
            subtotal={subtotal}
            tax={tax}
            total={total}
            payNow={payNow}
          />
        )}

        <div className="booking-action-bar sticky bottom-0 z-30 -mx-4 mt-6 flex flex-col gap-3 border-t border-[color:var(--saffron-gold)]/10 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:static sm:mx-0 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-6 sm:backdrop-blur-0">
          <button
            type="button"
            className="btn-secondary order-2 w-full gap-2 justify-center disabled:pointer-events-none disabled:opacity-45 sm:order-none sm:w-auto"
            disabled={step === 0}
            onClick={() => setStep((current) => Math.max(current - 1, 0))}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              className="btn-primary order-1 w-full gap-2 justify-center disabled:pointer-events-none disabled:opacity-55 sm:order-none sm:w-auto"
              disabled={
                (step === 0 && !selectedServiceId) ||
                (step === 1 && (!selectedDate || !selectedSlot))
              }
              onClick={() => {
                if (step === 2) {
                  continueFromDetails();
                } else {
                  setStep((current) => current + 1);
                }
              }}
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href="/services"
              className="btn-secondary order-1 w-full justify-center sm:order-none sm:w-auto"
            >
              Review Services
            </Link>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text.trim()) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("The server returned an invalid response. Please try again.");
  }
}

function ProgressIndicator({ currentStep }: { currentStep: number }) {
  const progressWidth = `${((currentStep + 1) / steps.length) * 100}%`;

  return (
    <div className="mx-auto mt-6 max-w-4xl sm:mt-10">
      <div className="rounded-lg border border-[color:var(--border)] bg-white/85 p-3 shadow-sm sm:hidden">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase text-[color:var(--sunrise-orange)]">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-right text-sm font-semibold text-[color:var(--text-primary)]">
            {steps[currentStep]}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[color:var(--border)]">
          <div
            className="h-full rounded-full bg-[color:var(--sunrise-orange)] transition-all duration-500"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      <div className="hidden grid-cols-4 gap-2 sm:grid">
        {steps.map((label, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <div key={label} className="relative flex flex-col items-center text-center">
              {index < steps.length - 1 && (
                <span
                  className={`absolute left-1/2 top-5 h-px w-full ${
                    completed ? "bg-[color:var(--sunrise-orange)]" : "bg-[color:var(--border)]"
                  }`}
                />
              )}
              <span
                className={`relative z-[1] flex h-10 w-10 items-center justify-center rounded-full font-numeral text-sm transition-all ${
                  completed || active
                    ? "text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                    : "border border-[color:var(--border)] bg-white text-[color:var(--text-muted)]"
                }`}
                style={
                  completed || active
                    ? { background: "var(--sunrise-orange)" }
                    : undefined
                }
              >
                {completed ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span className="mt-3 text-xs font-medium text-[color:var(--text-secondary)]">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ServiceSelection({
  selectedServiceId,
  setSelectedServiceId,
}: {
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string) => void;
}) {
  return (
    <div>
      <StepTitle title="Choose Service" subtitle="Select one reading. You can review price and duration before payment." />
      <div className="mt-5 grid gap-3 sm:mt-8 md:grid-cols-2 xl:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = serviceIcons[service.icon];
          const selected = selectedServiceId === service.id;

          return (
            <button
              key={service.id}
              type="button"
              className={`group rounded-lg border p-4 text-left transition-all duration-300 sm:p-5 ${
                selected
                  ? "shadow-[0_16px_40px_rgba(249,115,22,0.15)]"
                  : "hover:border-[color:var(--sunrise-orange)]/30"
              }`}
              style={
                selected
                  ? { borderColor: 'var(--sunrise-orange)', background: 'var(--orange-pale)' }
                  : { borderColor: 'var(--border)', background: 'white' }
              }
              onClick={() => setSelectedServiceId(service.id)}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11" style={{ background: 'var(--white)', boxShadow: '0 0 16px rgba(249,115,22,0.08)' }}>
                  <Icon className="h-5 w-5 text-[color:var(--sunrise-orange)]" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl font-bold leading-tight text-[color:var(--text-primary)] sm:text-2xl">
                    {service.title}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="font-numeral text-sm font-semibold text-[color:var(--sunrise-orange)]">
                      {service.price}
                    </span>
                    <span className="rounded-full bg-[color:var(--ethereal-pearl)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--text-muted)]">
                      {service.duration}
                    </span>
                  </span>
                </span>
              </div>
              <p className="mt-3 hidden text-xs leading-5 text-[color:var(--text-secondary)] sm:block">
                {service.tagline}
              </p>
              <span className={`mt-4 inline-flex min-h-10 items-center rounded-full px-4 py-2 text-xs font-medium ${
                selected ? 'text-white' : 'text-[color:var(--text-secondary)]'
              }`} style={
                selected
                  ? { background: 'var(--sunrise-orange)' }
                  : { background: 'var(--ethereal-pearl)' }
              }>
                {selected ? "Selected" : "Select"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DateTimeStep({
  bookedSlots,
  holdExpiresAt,
  isHoldingSlot,
  selectedDate,
  selectedMode,
  selectedServiceId,
  selectedSlot,
  selectDate,
  selectSlot,
  setSelectedMode,
  setVisibleMonth,
  visibleMonth,
}: {
  bookedSlots: BookedSlot[];
  holdExpiresAt: string | null;
  isHoldingSlot: boolean;
  selectedDate: string | null;
  selectedMode: BookingMode;
  selectedServiceId: string;
  selectedSlot: string | null;
  selectDate: (date: Date) => void;
  selectSlot: (slot: string) => void;
  setSelectedMode: (mode: BookingMode) => void;
  setVisibleMonth: React.Dispatch<React.SetStateAction<Date>>;
  visibleMonth: Date;
}) {
  const days = buildCalendarDays(visibleMonth);
  const selectedDateSlots = selectedDate
    ? bookedSlots.filter(
        (slot) =>
          slot.date === selectedDate &&
          (!slot.service_id || slot.service_id === selectedServiceId),
      )
    : [];
  const unavailableSlots = new Set(selectedDateSlots.map((slot) => slot.time_slot));
  const availableSlots = timeSlots.filter((slot) => !unavailableSlots.has(slot));

  return (
    <div>
      <StepTitle title="Pick Date & Time" subtitle="Choose a date first, then tap the time slot that works best." />

      <div className="mt-5 grid gap-6 sm:mt-8 lg:grid-cols-[1fr_0.9fr] lg:gap-8">
        <div className="rounded-lg border border-[color:var(--border)] bg-white/70 p-3 sm:p-5">
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--text-secondary)]"
              onClick={() => setVisibleMonth((date) => addMonths(date, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="px-2 text-center font-display text-xl font-medium text-[color:var(--text-primary)] sm:text-2xl">
              {visibleMonth.toLocaleString("en-IN", { month: "long", year: "numeric" })}
            </h3>
            <button
              type="button"
              aria-label="Next month"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--text-secondary)]"
              onClick={() => setVisibleMonth((date) => addMonths(date, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium uppercase text-[color:var(--text-muted)] sm:mt-6 sm:gap-2 sm:text-xs">
            {[
              ["Sunday", "S"],
              ["Monday", "M"],
              ["Tuesday", "T"],
              ["Wednesday", "W"],
              ["Thursday", "T"],
              ["Friday", "F"],
              ["Saturday", "S"],
            ].map(([full, short]) => (
              <span key={full} aria-label={full}>{short}</span>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-2">
            {days.map((day, index) => {
              if (!day) {
                return <span key={`blank-${index}`} />;
              }

              const dateKey = formatDateKey(day);
              const disabled =
                isPastDate(day) || isFullyBooked(dateKey, bookedSlots, selectedServiceId);
              const selected = selectedDate === dateKey;

              return (
                <button
                  key={dateKey}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDate(day)}
                  className={`aspect-square min-h-10 rounded-lg text-sm transition ${
                    selected
                      ? "bg-[color:var(--sunrise-orange)] text-white"
                      : disabled
                        ? "cursor-not-allowed bg-[color:var(--border)] text-[color:var(--text-muted)] opacity-45"
                        : "bg-white hover:bg-[color:var(--orange-pale)] hover:text-[color:var(--sunrise-orange)]"
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-display text-xl font-medium text-[color:var(--text-primary)] sm:text-2xl">
              Available Slots
            </h3>
            {selectedDate && (
              <p className="mt-1 text-xs font-medium text-[color:var(--sunrise-orange)]">
                {formatDisplayDate(selectedDate)}
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              {(selectedDate ? availableSlots : []).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => selectSlot(slot)}
                  className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium transition sm:px-4 ${
                    selectedSlot === slot
                      ? "border-[color:var(--sunrise-orange)] bg-[color:var(--sunrise-orange)] text-white"
                      : "border-[color:var(--border)] bg-white text-[color:var(--text-secondary)] hover:border-[color:var(--sunrise-orange)]"
                  }`}
                >
                  {slot}
                </button>
              ))}
              {!selectedDate && (
                <p className="col-span-2 rounded-lg border border-dashed border-[color:var(--border)] bg-white/65 p-4 text-sm text-[color:var(--text-muted)]">
                  Select a date to see time slots.
                </p>
              )}
              {selectedDate && availableSlots.length === 0 && (
                <p className="col-span-2 rounded-lg border border-dashed border-[color:var(--border)] bg-white/65 p-4 text-sm text-[color:var(--text-muted)]">
                  This date is fully booked.
                </p>
              )}
            </div>
            {isHoldingSlot && (
              <p className="mt-3 flex items-center gap-2 text-xs text-[color:var(--text-muted)]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Holding your slot...
              </p>
            )}
            {holdExpiresAt && selectedSlot && (
              <p className="mt-3 text-xs text-[color:var(--teal)]">
                Slot held for 10 minutes, until {new Date(holdExpiresAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}.
              </p>
            )}
          </div>

          <div>
            <h3 className="font-display text-xl font-medium text-[color:var(--text-primary)] sm:text-2xl">
              Session Mode
            </h3>
            <div className="mt-4 grid gap-2 sm:gap-3">
              {modes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectedMode(mode)}
                  className={`min-h-12 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                    selectedMode === mode
                      ? "border-[color:var(--sunrise-orange)] bg-[color:var(--orange-pale)] text-[color:var(--sunrise-orange)]"
                      : "border-[color:var(--border)] bg-white text-[color:var(--text-secondary)]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailsStep({
  details,
  errors,
  setDetails,
  session,
  handleSignIn,
  profiles,
}: {
  details: ClientDetails;
  errors: Partial<Record<keyof ClientDetails, string>>;
  setDetails: React.Dispatch<React.SetStateAction<ClientDetails>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
  handleSignIn: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profiles: any[];
}) {
  const update = (field: keyof ClientDetails, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
  };
  const addFocusSuggestion = (suggestion: string) => {
    setDetails((current) => {
      const existing = current.focus.trim();

      if (existing.includes(suggestion)) {
        return current;
      }

      return {
        ...current,
        focus: existing ? `${existing}\n${suggestion}` : suggestion,
      };
    });
  };

  return (
    <div>
      <StepTitle title="Your Details" subtitle="Share the exact details Uma should use for your reading." />
      
      {session && profiles.length > 0 && (
        <div className="mt-5 rounded-lg border border-[#E8A020]/20 bg-white/70 p-4 shadow-sm sm:mt-6 sm:p-5">
          <h4 className="font-display text-lg font-bold text-slate-800 mb-3">Who is this booking for?</h4>
          <div className="grid gap-2 sm:flex sm:flex-wrap">
            {profiles.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setDetails(prev => ({
                  ...prev,
                  fullName: p.name || "",
                  dob: p.date_of_birth || "",
                  phone: p.phone || "",
                  email: p.email || session.user.email || ""
                }))}
                className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-[#E8A020] hover:bg-[#FFFDF9] hover:text-[#D4700A]"
              >
                {p.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setDetails({ fullName: "", dob: "", phone: "", email: session.user.email || "", focus: "", additional: "" })}
              className="min-h-11 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-100"
            >
              + Add Someone Else
            </button>
          </div>
        </div>
      )}

      {!session && (
        <div className="mt-5 items-center justify-between rounded-lg border border-[#E8A020]/20 bg-[#FFFDF9] p-4 shadow-sm sm:mt-6 sm:flex sm:p-5">
          <div>
            <h4 className="font-display text-lg font-bold text-slate-800">Save Your Booking History</h4>
            <p className="text-sm text-slate-600 mt-1">Sign in to track your upcoming sessions and access past reports.</p>
          </div>
          <button
            onClick={handleSignIn}
            className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 sm:mt-0 sm:w-auto"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2">
        <Field
          label="Full Name"
          error={errors.fullName}
          required
          hint="Enter the exact name used in daily life or official documents. For name correction, use the current spelling you want checked."
        >
          <input
            className="tool-input"
            value={details.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            autoComplete="name"
            placeholder="e.g. Priya Sharma"
          />
        </Field>
        <Field
          label="Date of Birth"
          error={errors.dob}
          required
          hint="Select from the calendar so the reading uses the correct birth date."
        >
          <input
            className="tool-input"
            type="date"
            value={details.dob}
            onChange={(event) => update("dob", event.target.value)}
            max={formatDateKey(new Date())}
          />
        </Field>
        <Field label="Phone Number" error={errors.phone} required>
          <input
            className="tool-input"
            inputMode="numeric"
            value={details.phone}
            onChange={(event) => update("phone", event.target.value)}
            autoComplete="tel"
            placeholder="WhatsApp mobile number"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            className="tool-input"
            type="email"
            value={details.email}
            onChange={(event) => update("email", event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </Field>
        <Field
          label="Your Main Question"
          className="md:col-span-2"
          hint="Choose a suggestion or write your own. Be specific about decisions, names, dates, relationships, business, career, or remedies."
        >
          <div className="booking-chip-row mb-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {focusSuggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => addFocusSuggestion(suggestion.text)}
                className="min-h-10 shrink-0 rounded-full border border-[color:var(--saffron-gold)]/20 bg-[color:var(--orange-pale)]/55 px-3 py-2 text-left text-xs font-medium leading-5 text-[color:var(--text-secondary)] transition hover:border-[color:var(--sunrise-orange)] hover:bg-[color:var(--orange-pale)] hover:text-[color:var(--sunrise-orange)]"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
          <textarea
            className="min-h-28 w-full rounded-[8px] border border-[color:var(--border)] bg-white/70 p-4 text-sm outline-none transition focus:border-[color:var(--sunrise-orange)] focus:shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
            value={details.focus}
            onChange={(event) => update("focus", event.target.value)}
            placeholder="Example: I want to understand which name spelling is better for my career and whether June is good for a launch."
          />
        </Field>
        <Field
          label="Other Names or Birth Dates"
          className="md:col-span-2"
          hint="Optional. Add partner, baby, business, vehicle, house, or alternate-name details only if they are relevant to this session."
        >
          <textarea
            className="min-h-24 w-full rounded-[8px] border border-[color:var(--border)] bg-white/70 p-4 text-sm outline-none transition focus:border-[color:var(--sunrise-orange)] focus:shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
            value={details.additional}
            onChange={(event) => update("additional", event.target.value)}
            placeholder="Example: Partner DOB 14/08/1996, baby name options, business name, vehicle number, house number..."
          />
        </Field>
      </div>
    </div>
  );
}

function PaymentStep({
  applyCoupon,
  coupon,
  couponInput,
  couponLoading,
  discount,
  paymentError,
  paymentLoading,
  payNow,
  selectedDate,
  selectedMode,
  selectedService,
  selectedSlot,
  setCouponInput,
  subtotal,
  tax,
  total,
}: {
  applyCoupon: () => void;
  coupon: CouponState | null;
  couponInput: string;
  couponLoading: boolean;
  discount: number;
  paymentError: string;
  paymentLoading: boolean;
  payNow: () => void;
  selectedDate: string;
  selectedMode: BookingMode;
  selectedService: NumerologyService;
  selectedSlot: string;
  setCouponInput: (value: string) => void;
  subtotal: number;
  tax: number;
  total: number;
}) {
  return (
    <div>
      <StepTitle title="Payment" subtitle="Review your booking summary and complete payment securely." />

      <div className="mt-5 grid gap-5 sm:mt-8 lg:grid-cols-[1fr_0.85fr] lg:gap-8">
        <div className="rounded-lg border border-[color:var(--border)] bg-white/70 p-4 sm:p-6">
          <h3 className="font-display text-xl font-medium text-[color:var(--text-primary)] sm:text-2xl">
            Booking Summary
          </h3>
          <dl className="mt-5 space-y-4 text-sm">
            <SummaryRow label="Service" value={selectedService.title} />
            <SummaryRow label="Date" value={formatDisplayDate(selectedDate)} />
            <SummaryRow label="Time" value={selectedSlot} />
            <SummaryRow label="Mode" value={selectedMode} />
          </dl>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <input
              className="tool-input"
              value={couponInput}
              onChange={(event) => setCouponInput(event.target.value)}
              placeholder="Apply Coupon"
            />
            <button
              type="button"
              onClick={applyCoupon}
              disabled={couponLoading}
              className="min-h-12 min-w-28 rounded-lg bg-[color:var(--text-primary)] px-5 text-sm font-medium text-white disabled:opacity-50 sm:min-h-0"
            >
              {couponLoading ? "Checking" : "Apply"}
            </button>
          </div>
          {coupon && (
            <p className={`mt-3 text-sm ${coupon.discount ? "text-[color:var(--teal)]" : "text-[color:var(--rose)]"}`}>
              {coupon.message}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center rounded-lg border border-[color:var(--orange-pale)] bg-[color:var(--orange-pale)]/45 p-4 sm:p-6">
          <h3 className="font-display text-xl font-medium text-[color:var(--text-primary)] w-full text-left mb-4 sm:text-2xl">
            Total Breakdown
          </h3>
          <div className="w-full space-y-3 text-sm text-[color:var(--text-secondary)] mb-6">
            <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
            <SummaryRow label="Coupon" value={`-${formatCurrency(discount)}`} />
            <SummaryRow label="GST (18%, if applicable)" value={formatCurrency(tax)} />
          </div>

          <div className="w-full border-t border-[color:var(--orange-pale)] pt-5 mb-6 text-center">
            <p className="font-numeral text-4xl font-semibold text-[color:var(--sunrise-orange)]">
              {formatCurrency(total)}
            </p>
          </div>

          <h3 className="font-display text-xl font-medium text-[color:var(--text-primary)] mb-2">
            Secure Payment
          </h3>
          <p className="text-sm text-[color:var(--text-secondary)] mb-4 text-center">
            Click the button below to complete your payment securely via Razorpay.
          </p>

          <button
            type="button"
            onClick={payNow}
            disabled={paymentLoading}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[color:var(--sunrise-orange)] px-6 text-sm font-medium text-white shadow-[0_16px_34px_rgba(249,115,22,0.15)] transition hover:bg-[#d95c11] disabled:opacity-55"
          >
            {paymentLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Pay via Razorpay
          </button>
          {paymentError && <p className="mt-3 text-sm text-[color:var(--rose)] text-center">{paymentError}</p>}
        </div>
      </div>
    </div>
  );
}

function StepTitle({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-medium leading-tight text-[color:var(--text-primary)] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
        {subtitle}
      </p>
    </div>
  );
}

function Field({
  children,
  className = "",
  error,
  hint,
  label,
  required,
}: {
  children: React.ReactNode;
  className?: string;
  error?: string;
  hint?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className={`block w-full min-w-0 ${className}`}>
      <span className="text-sm font-medium text-[color:var(--text-primary)]">
        {label}
        {required && <span className="text-[color:var(--rose)]"> *</span>}
      </span>
      {hint && (
        <span className="mt-1 block text-xs leading-5 text-[color:var(--text-muted)]">
          {hint}
        </span>
      )}
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-2 block text-xs text-[color:var(--rose)]">{error}</span>}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-5">
      <dt className="text-[color:var(--text-muted)]">{label}</dt>
      <dd className="text-right font-medium text-[color:var(--text-primary)]">{value}</dd>
    </div>
  );
}

function validateDetails(details: ClientDetails) {
  const errors: Partial<Record<keyof ClientDetails, string>> = {};
  const phoneDigits = details.phone.replace(/\D/g, "");

  if (!details.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  const normalizedDob = details.dob.trim();
  const dobTime = normalizedDob ? new Date(`${normalizedDob}T12:00:00`).getTime() : Number.NaN;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDob) || Number.isNaN(dobTime)) {
    errors.dob = "Select a valid date of birth.";
  } else if (dobTime > Date.now()) {
    errors.dob = "Date of birth cannot be in the future.";
  }

  if (phoneDigits.length !== 10) {
    errors.phone = "Phone number must be 10 digits.";
  }

  if (details.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

function buildCalendarDays(monthDate: Date) {
  const first = startOfMonth(monthDate);
  const daysInCurrentMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const blanks = Array.from<null>({ length: first.getDay() }).fill(null);
  const days = Array.from({ length: daysInCurrentMonth }, (_, index) => new Date(first.getFullYear(), first.getMonth(), index + 1));

  return [...blanks, ...days];
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function formatMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isPastDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const candidate = new Date(date);
  candidate.setHours(0, 0, 0, 0);
  return candidate < today;
}

function isFullyBooked(date: string, bookedSlots: BookedSlot[], serviceId: string | null) {
  const unavailable = bookedSlots.filter(
    (slot) => slot.date === date && (!slot.service_id || slot.service_id === serviceId),
  );

  return timeSlots.every((slot) => unavailable.some((booked) => booked.time_slot === slot));
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
