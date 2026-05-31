"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { Session } from "@supabase/supabase-js";
import { 
  Sparkles, 
  LogOut, 
  Calendar, 
  Video, 
  Phone, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from "lucide-react";

interface Booking {
  id: string;
  booking_date: string;
  time_slot: string;
  mode: string;
  status: string;
  amount_paid: number;
  focus_areas: string | null;
  created_at: string;
  services: {
    name: string;
    duration_minutes: number;
  };
}

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
      if (session) {
        fetchBookingHistory(session.access_token);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingSession(false);
      if (session) {
        fetchBookingHistory(session.access_token);
      } else {
        setBookings([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchBookingHistory = async (token: string) => {
    setLoadingBookings(true);
    setBookingsError("");
    try {
      const res = await fetch("/api/user/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to load bookings.");
      }

      const data = await res.json();
      setBookings(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred loading your bookings.";
      setBookingsError(errorMessage);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      });
    } catch (err) {
      console.error("Sign in error:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hourStr, minute] = timeStr.split(":");
      const hour = Number(hourStr);
      const hour12 = hour % 12 || 12;
      const ampm = hour >= 12 ? "PM" : "AM";
      return `${hour12}:${minute} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const getModeDetails = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "whatsapp":
        return {
          icon: <Phone className="h-4 w-4" />,
          label: "WhatsApp Call",
          color: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
        };
      case "in_person":
        return {
          icon: <MapPin className="h-4 w-4" />,
          label: "In-Person",
          color: "bg-indigo-50 text-indigo-700 border-indigo-200/50",
        };
      default:
        return {
          icon: <Video className="h-4 w-4" />,
          label: "Video Call",
          color: "bg-amber-50 text-amber-700 border-amber-200/50",
        };
    }
  };

  const getStatusDetails = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
          label: "Confirmed",
          color: "bg-emerald-50/80 text-emerald-800 border-emerald-200",
        };
      case "cancelled":
        return {
          icon: <AlertTriangle className="h-4 w-4 text-rose-500" />,
          label: "Cancelled",
          color: "bg-rose-50/80 text-rose-800 border-rose-200",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-slate-500" />,
          label: "Pending",
          color: "bg-slate-100 text-slate-800 border-slate-200",
        };
    }
  };

  if (loadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDF9]">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8A020] border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Retrieving session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE2] pt-28 pb-16 px-4 md:px-8">
      {/* Film grain noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="mx-auto max-w-5xl">
        {!session ? (
          // UN-AUTHENTICATED STATE (Sign-In)
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E8A020]/16 border-t-2 border-t-[#E8A020]/60 bg-white/72 backdrop-blur-xl p-8 shadow-[0_24px_60px_rgba(232,160,32,0.08)] text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8A020]/8 border border-[#E8A020]/20 text-[#D4700A] mx-auto shadow-[0_8px_16px_rgba(232,160,32,0.05)]">
                <Sparkles className="h-6 w-6" strokeWidth={1.8} />
              </div>

              <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-slate-800">
                Access Cosmic Portal
              </h1>
              <p className="mt-2 text-[10px] uppercase tracking-[3px] text-[#D4700A] font-bold">
                ✦ Client Login ✦
              </p>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                Sign in with your Google account to access your personal profile, download diagnostic guides, and view appointment history.
              </p>

              <button
                onClick={handleSignIn}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-98"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        ) : (
          // AUTHENTICATED STATE
          <div className="space-y-8 animate-fadeIn">
            {/* Header Profile Card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-2xl border border-[#E8A020]/16 bg-white/70 backdrop-blur-md shadow-md">
              <div className="flex items-center gap-4.5">
                {session.user.user_metadata?.avatar_url ? (
                  <img
                    src={session.user.user_metadata.avatar_url}
                    alt={session.user.user_metadata.full_name || "Profile"}
                    className="h-16 w-16 rounded-full border border-[#E8A020]/30 shadow-sm"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8A020]/10 text-[#D4700A] font-semibold text-2xl border border-[#E8A020]/20">
                    {session.user.email?.[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="font-display text-2xl font-bold text-slate-800 leading-tight">
                    {session.user.user_metadata?.full_name || "Welcome Back"}
                  </h2>
                  <p className="text-sm text-slate-600 font-medium mt-1">
                    {session.user.email}
                  </p>
                  <span className="inline-flex mt-2 items-center gap-1 rounded-full bg-[#E8A020]/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D4700A]">
                    ✦ Active Portal User
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-50 px-4.5 py-2.5 text-sm font-semibold text-slate-600 transition-all active:scale-97"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>

            {/* Booking History Section */}
            <div className="rounded-2xl border border-[#E8A020]/12 bg-white/60 backdrop-blur-md p-6 md:p-8 shadow-sm">
              <h3 className="font-display text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
                🗓 Consultation Booking History
              </h3>

              {loadingBookings ? (
                // LOADING HISTORY
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#E8A020] border-t-transparent" />
                  <p className="text-sm text-slate-500 font-medium">Fetching history...</p>
                </div>
              ) : bookingsError ? (
                // ERROR RETRIEVING HISTORY
                <div className="my-6 rounded-xl bg-rose-50 border border-rose-200/50 p-4 text-center text-sm font-semibold text-rose-700">
                  {bookingsError}
                </div>
              ) : bookings.length === 0 ? (
                // EMPTY HISTORY STATE
                <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8A020]/6 border border-[#E8A020]/15 text-[#D4700A]/80 shadow-sm">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 font-display text-lg font-bold text-slate-800">
                    No Consultations Booked
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 max-w-sm">
                    We couldn&apos;t find any appointments linked to **{session.user.email}**. 
                    If you have already paid for a session, make sure you used this exact email at checkout.
                  </p>
                  <a
                    href="/services"
                    className="btn-primary mt-6 inline-flex items-center gap-2"
                    style={{ background: "linear-gradient(135deg, #1E0A3C, #0D0820)" }}
                  >
                    Explore Services & Book
                  </a>
                </div>
              ) : (
                // BOOKINGS LIST
                <div className="mt-6 space-y-4">
                  {bookings.map((booking) => {
                    const modeInfo = getModeDetails(booking.mode);
                    const statusInfo = getStatusDetails(booking.status);

                    return (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-100 bg-white/90 hover:border-[#E8A020]/30 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="space-y-2">
                          <h4 className="font-display text-lg font-bold text-slate-800">
                            {booking.services?.name || "Numerology Consultation"}
                          </h4>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <Calendar className="h-4 w-4 text-[#D4700A]/80" />
                              {formatDate(booking.booking_date)}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <Clock className="h-4 w-4 text-[#D4700A]/80" />
                              {formatTime(booking.time_slot)}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] uppercase font-bold tracking-wider ${modeInfo.color}`}>
                              {modeInfo.icon}
                              {modeInfo.label}
                            </span>
                          </div>

                          {booking.focus_areas && (
                            <p className="text-xs text-slate-600 italic mt-1 max-w-xl">
                              Focus Areas: {booking.focus_areas}
                            </p>
                          )}
                        </div>

                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-slate-100 pt-3.5 md:pt-0 shrink-0">
                          <span className="flex items-center gap-1 text-[#1E0A3C] font-semibold text-base font-numeral">
                            <CreditCard className="h-4 w-4 text-[#D4700A]/80" />
                            ₹{booking.amount_paid.toLocaleString("en-IN")}
                          </span>

                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
