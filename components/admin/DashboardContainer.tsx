"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  calculatePsychicNumber,
  calculateDestinyNumber,
} from "@/lib/numerology";
import { AdminNumerologyWorkspace } from "./AdminNumerologyWorkspace";
import { ClientReportModal } from "./ClientReportModal";
import { getAdminPath } from "@/lib/admin-path";
import {
  BarChart3,
  Calendar,
  Users,
  Settings2,
  Megaphone,
  Receipt,
  LogOut,
  TrendingUp,
  Search,
  Edit2,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Sparkles,
  Info,
  Send,
  FileText,
} from "lucide-react";

const getAdminVideoLink = (url?: string | null) => {
  if (!url) return "";
  if (url.includes("/session/")) {
    const roomId = url.split("/session/")[1];
    const safeRoomId = roomId.replace(/[^a-zA-Z0-9-]/g, "");
    return `https://meet.jit.si/NumeroSoul-Session-${safeRoomId}`;
  }
  return url;
};

type Booking = {
  id: string;
  booking_date: string;
  time_slot: string;
  mode: string;
  status: string;
  amount_paid: number;
  focus_areas: string | null;
  additional_dobs: string | null;
  invoice_number?: string | null;
  video_conference_url?: string | null;
  session_notes?: string | null;
  report_url?: string | null;
  follow_up_at?: string | null;
  follow_up_sent_at?: string | null;
  created_at: string;
  clients: {
    id: string;
    name: string;
    email: string;
    phone: string;
    date_of_birth: string | null;
    notes: string | null;
  } | null;
  services: {
    id: string;
    name: string;
    slug: string;
    duration_minutes: number;
  } | null;
};

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  date_of_birth: string | null;
  notes: string | null;
};

type Service = {
  id: string;
  name: string;
  slug: string;
  price_min: number;
  price_max: number;
  duration_minutes: number;
  description: string | null;
  is_active: boolean;
};

type DashboardStats = {
  summary: {
    totalRevenue: number;
    totalBookings: number;
    totalClients: number;
    activeCoupons: number;
  };
  recentBookings: Array<{
    id: string;
    date: string;
    time: string;
    status: string;
    amount: number;
    clientName: string;
    serviceName: string;
  }>;
  bookingTrends: Array<{ date: string; count: number }>;
  toolUsage: Array<{ name: string; count: number }>;
};

type DashboardTab =
  | "overview"
  | "bookings"
  | "clients"
  | "services"
  | "marketing"
  | "billing"
  | "analysis";

const dashboardTabs: Array<{
  id: DashboardTab;
  label: string;
  icon: typeof BarChart3;
}> = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "clients", label: "Clients", icon: Users },
  { id: "analysis", label: "Workspace", icon: Sparkles },
  { id: "services", label: "Services", icon: Settings2 },
  { id: "marketing", label: "Campaigns", icon: Megaphone },
  { id: "billing", label: "Invoices", icon: Receipt },
];

export function DashboardContainer() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  const [selectedBookingForReport, setSelectedBookingForReport] = useState<Booking | null>(null);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Search & filter states
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [clientSearch, setClientSearch] = useState("");

  // Edit Modals states
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [bookingEditDate, setBookingEditDate] = useState("");
  const [bookingEditTime, setBookingEditTime] = useState("");
  const [bookingEditStatus, setBookingEditStatus] = useState("");
  const [postSessionNotes, setPostSessionNotes] = useState("");
  const [postSessionReportUrl, setPostSessionReportUrl] = useState("");
  const [postSessionFollowUpAt, setPostSessionFollowUpAt] = useState("");
  const [postSessionSending, setPostSessionSending] = useState(false);

  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [editingClientNotes, setEditingClientNotes] = useState("");

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceEditMin, setServiceEditMin] = useState(0);
  const [serviceEditMax, setServiceEditMax] = useState(0);
  const [serviceEditDuration, setServiceEditDuration] = useState(0);
  const [serviceEditDesc, setServiceEditDesc] = useState("");
  const [serviceEditName, setServiceEditName] = useState("");
  const [serviceEditActive, setServiceEditActive] = useState(true);

  // Marketing states
  type MarketingResult = {
    success: boolean;
    sentCount: number;
    simulated: boolean;
    message?: string;
    recipients?: Array<{ name: string; email: string | null; phone: string }>;
  };

  const [marketingCohort, setMarketingCohort] = useState("all");
  const [marketingChannel, setMarketingChannel] = useState("email");
  const [marketingSubject, setMarketingSubject] = useState("");
  const [marketingMessage, setMarketingMessage] = useState("");
  const [marketingSending, setMarketingSending] = useState(false);
  const [marketingResult, setMarketingResult] = useState<MarketingResult | null>(null);

  // Billing states
  const [selectedBookingForBill, setSelectedBookingForBill] = useState<Booking | null>(null);

  // Load Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, clientsRes, servicesRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/bookings"),
        fetch("/api/admin/clients"),
        fetch("/api/admin/services"),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (clientsRes.ok) setClients(await clientsRes.json());
      if (servicesRes.ok) setServices(await servicesRes.json());
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    const { supabase } = await import("@/lib/supabase-client");
    await supabase.auth.signOut();
    router.replace(getAdminPath());
    router.refresh();
  };

  // Reschedule/Edit Booking Submit
  const handleUpdateBooking = async () => {
    if (!editingBooking) return;
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingBooking.id,
          date: bookingEditDate,
          timeSlot: bookingEditTime,
          status: bookingEditStatus,
        }),
      });

      if (res.ok) {
        setEditingBooking(null);
        fetchData(); // reload
      } else {
        alert("Failed to update booking.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendPostSession = async () => {
    if (!editingBooking) return;
    setPostSessionSending(true);
    try {
      const res = await fetch("/api/admin/post-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: editingBooking.id,
          followUpAt: postSessionFollowUpAt || null,
          reportUrl: postSessionReportUrl,
          sessionNotes: postSessionNotes,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setBookingEditStatus("completed");
        setEditingBooking(null);
        fetchData();
      } else {
        alert(data.message || "Failed to send post-session details.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send post-session details.");
    } finally {
      setPostSessionSending(false);
    }
  };

  // Update Client Notes
  const handleUpdateClientNotes = async () => {
    if (!viewingClient) return;
    try {
      const res = await fetch("/api/admin/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: viewingClient.id,
          notes: editingClientNotes,
        }),
      });

      if (res.ok) {
        setViewingClient(null);
        fetchData();
      } else {
        alert("Failed to update client notes.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Service Settings
  const handleUpdateService = async () => {
    if (!editingService) return;
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingService.id,
          name: serviceEditName,
          priceMin: serviceEditMin,
          priceMax: serviceEditMax,
          durationMinutes: serviceEditDuration,
          description: serviceEditDesc,
          isActive: serviceEditActive,
        }),
      });

      if (res.ok) {
        setEditingService(null);
        fetchData();
      } else {
        alert("Failed to update service details.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run Marketing Campaign
  const handleSendMarketing = async () => {
    if (!marketingMessage.trim()) return;
    setMarketingSending(true);
    setMarketingResult(null);
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cohort: marketingCohort,
          channel: marketingChannel,
          subject: marketingSubject,
          message: marketingMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMarketingResult(data);
        setMarketingMessage("");
        setMarketingSubject("");
      } else {
        alert(data.message || "Failed to broadcast marketing messages.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMarketingSending(false);
    }
  };

  // Helper: Status Pill Styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-3.5 w-3.5" /> Confirmed
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
            <CheckCircle className="h-3.5 w-3.5" /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
            <XCircle className="h-3.5 w-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5" /> Pending
          </span>
        );
    }
  };

  // Filtering Bookings
  const filteredBookings = bookings.filter((b) => {
    const nameMatch = b.clients?.name.toLowerCase().includes(bookingSearch.toLowerCase()) ?? false;
    const phoneMatch = b.clients?.phone.includes(bookingSearch) ?? false;
    const serviceMatch = b.services?.name.toLowerCase().includes(bookingSearch.toLowerCase()) ?? false;
    const searchMatches = bookingSearch === "" || nameMatch || phoneMatch || serviceMatch;

    const statusMatches = bookingStatusFilter === "all" || b.status === bookingStatusFilter;
    return searchMatches && statusMatches;
  });

  // Filtering Clients
  const filteredClients = clients.filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(clientSearch.toLowerCase());
    const emailMatch = c.email?.toLowerCase().includes(clientSearch.toLowerCase()) ?? false;
    const phoneMatch = c.phone.includes(clientSearch);
    return clientSearch === "" || nameMatch || emailMatch || phoneMatch;
  });

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="sticky top-0 z-20 -mx-4 mb-6 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              <h1 className="font-sans text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">
                NumeroSoul Admin
              </h1>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Professional numerology operations workspace
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-950 active:scale-[0.99]"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <nav className="mb-6 overflow-x-auto border-b border-slate-200" aria-label="Admin sections">
        <div className="flex min-w-max gap-1" role="tablist">
          {dashboardTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedBookingForBill(null);
                }}
                className={`inline-flex min-h-11 items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "border-slate-950 bg-white text-slate-950"
                    : "border-transparent text-slate-600 hover:bg-white hover:text-slate-950"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-blue-700" : "text-slate-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {loading && (
        <div
          className="flex h-80 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
            <p className="text-sm font-semibold text-slate-600">Loading admin data...</p>
          </div>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && stats && (
            <div className="grid gap-6">
              {/* KPI Cards */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue */}
                <div className="relative overflow-hidden rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(232,160,32,0.06)] hover:-translate-y-1">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-[#E8A020]" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
                      Total Revenue
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <TrendingUp className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <p className="mt-4 font-numeral text-3xl font-bold text-slate-800">
                    ₹{stats.summary.totalRevenue.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400 font-medium">From confirmed appointments</p>
                </div>

                {/* Total Bookings */}
                <div className="relative overflow-hidden rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(232,160,32,0.06)] hover:-translate-y-1">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D4700A] to-[#E8A020]" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
                      Total Bookings
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-[#D4700A]">
                      <Calendar className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <p className="mt-4 font-numeral text-3xl font-bold text-slate-800">
                    {stats.summary.totalBookings}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400 font-medium">All registered slots</p>
                </div>

                {/* Clients CRM */}
                <div className="relative overflow-hidden rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(232,160,32,0.06)] hover:-translate-y-1">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
                      Clients CRM
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <p className="mt-4 font-numeral text-3xl font-bold text-slate-800">
                    {stats.summary.totalClients}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400 font-medium">Registered profiles</p>
                </div>

                {/* Active Coupons */}
                <div className="relative overflow-hidden rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(232,160,32,0.06)] hover:-translate-y-1">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
                      Active Coupons
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <p className="mt-4 font-numeral text-3xl font-bold text-slate-800">
                    {stats.summary.activeCoupons}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400 font-medium">Active discount codes</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* 1. SVG Weekly Trend Line Chart */}
                <div className="rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)]">
                  <h3 className="font-display text-lg font-semibold text-slate-800">
                    Booking Trends (Last 14 Days)
                  </h3>
                  <div className="relative mt-8 h-48 w-full">
                    {/* SVG Line representation */}
                    <svg className="h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(232,160,32,0.08)" strokeWidth="0.5" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(232,160,32,0.08)" strokeWidth="0.5" />
                      <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(232,160,32,0.08)" strokeWidth="0.5" />
                      
                      {/* Polyline Path */}
                      <polyline
                        fill="none"
                        stroke="#D4700A"
                        strokeWidth="2.5"
                        points={stats.bookingTrends
                          .map((t, idx) => {
                            const x = (idx / 13) * 100;
                            // Scale Y. Max out at 5 for nice display.
                            const maxVal = Math.max(...stats.bookingTrends.map((d) => d.count), 4);
                            const y = 90 - (t.count / maxVal) * 80;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                      />
                    </svg>
                  </div>
                  <div className="mt-4 flex justify-between text-[10px] text-slate-400 font-semibold font-numeral">
                    <span>{stats.bookingTrends[0]?.date}</span>
                    <span>{stats.bookingTrends[13]?.date}</span>
                  </div>
                </div>

                {/* 2. Horizontal Bar Chart for Tool Popularity */}
                <div className="rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)]">
                  <h3 className="font-display text-lg font-semibold text-slate-800">
                    Popular Calculator Tools
                  </h3>
                  <div className="mt-6 space-y-4">
                    {stats.toolUsage.map((t) => {
                      const maxCount = Math.max(...stats.toolUsage.map((o) => o.count), 1);
                      const percent = (t.count / maxCount) * 100;
                      return (
                        <div key={t.name} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-slate-700">{t.name}</span>
                            <span className="font-numeral text-slate-500 font-semibold">{t.count} hits</span>
                          </div>
                          <div className="h-3 w-full rounded-full bg-[#E8A020]/10 overflow-hidden">
                            <div
                              style={{ width: `${percent}%` }}
                              className="h-full rounded-full bg-[#E8A020] transition-all duration-300"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Booking Activity */}
              <div className="rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)]">
                <h3 className="font-display text-lg font-semibold text-slate-800 mb-4">
                  Recent Booking Activity
                </h3>
                <div className="overflow-x-auto rounded-xl border border-[#E8A020]/12">
                  <table className="min-w-full divide-y divide-[#E8A020]/12">
                    <thead className="bg-[#E8A020]/5">
                      <tr>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                          Client
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                          Service
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                          Date & Time
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                          Price Paid
                        </th>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8A020]/10 bg-white/50">
                      {stats.recentBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#E8A020]/4 transition-colors">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800">
                            {b.clientName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 font-medium">
                            {b.serviceName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 font-medium">
                            {b.date} at {b.time}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-800 font-numeral">
                            ₹{b.amount}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            {getStatusBadge(b.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="font-display text-xl font-semibold text-slate-800">
                  Consultation Bookings ({filteredBookings.length})
                </h3>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search name, phone, service..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="min-h-10 pl-9 pr-4 rounded-xl border border-[#E8A020]/20 bg-white/75 backdrop-blur-sm text-sm outline-none transition-all duration-200 focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 shadow-sm"
                    />
                  </div>

                  {/* Status filter */}
                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 backdrop-blur-sm text-sm outline-none transition-all duration-200 focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 shadow-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[#E8A020]/12">
                <table className="min-w-full divide-y divide-[#E8A020]/12">
                  <thead className="bg-[#E8A020]/5">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Client
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Service
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Schedule
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Details
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Fee Paid
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8A020]/10 bg-white/50">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#E8A020]/4 transition-colors">
                        <td className="px-6 py-4 text-sm">
                          <p className="font-semibold text-slate-800">{b.clients?.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{b.clients?.phone}</p>
                          <p className="text-xs text-slate-400 font-medium">{b.clients?.email}</p>
                          {(() => {
                            if (!b.clients?.date_of_birth) return null;
                            try {
                              const p = calculatePsychicNumber(b.clients.date_of_birth);
                              const d = calculateDestinyNumber(b.clients.date_of_birth);
                              return (
                                <span className="inline-block mt-1.5 text-[10px] font-bold bg-[#E8A020]/10 border border-[#E8A020]/20 text-[#D4700A] px-2 py-0.5 rounded font-numeral">
                                  P: {p} | D: {d}
                                </span>
                              );
                            } catch {
                              return null;
                            }
                          })()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                          {b.services?.name ?? "Numerology Session"}
                          <span className="block text-xs text-slate-400 mt-0.5">Mode: {b.mode}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <p className="font-semibold">{b.booking_date}</p>
                          <p className="text-xs font-numeral text-slate-400 font-semibold">{b.time_slot}</p>
                        </td>
                        <td className="px-6 py-4 text-sm max-w-xs overflow-hidden text-ellipsis">
                          {b.focus_areas && (
                            <p className="text-xs text-slate-600">
                              <strong>Focus:</strong> {b.focus_areas}
                            </p>
                          )}
                          {b.additional_dobs && (
                            <p className="text-xs text-slate-400 mt-1">
                              <strong>DOBs:</strong> {b.additional_dobs}
                            </p>
                          )}
                          {b.video_conference_url && (
                            <a
                              href={getAdminVideoLink(b.video_conference_url)}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 block truncate text-xs font-semibold text-[#D4700A]"
                            >
                              Video link ready
                            </a>
                          )}
                          {b.invoice_number && (
                            <a
                              href={`/invoice/${b.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 block truncate text-xs font-semibold text-slate-500"
                            >
                              Invoice {b.invoice_number}
                            </a>
                          )}
                          {!b.focus_areas && !b.additional_dobs && !b.video_conference_url && !b.invoice_number && (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-800 font-numeral">
                          ₹{b.amount_paid}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {getStatusBadge(b.status)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold space-x-2">
                          <button
                            onClick={() => {
                              setEditingBooking(b);
                              setBookingEditDate(b.booking_date);
                              setBookingEditTime(b.time_slot.slice(0, 5));
                              setBookingEditStatus(b.status);
                              setPostSessionNotes(b.session_notes || "");
                              setPostSessionReportUrl(b.report_url || "");
                              setPostSessionFollowUpAt(b.follow_up_at ? b.follow_up_at.slice(0, 16) : "");
                            }}
                            className="inline-flex items-center gap-1 text-[#D4700A] hover:text-[#E8A020] transition-colors"
                          >
                            <Edit2 className="h-4 w-4" /> Manage
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBookingForReport(b);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-purple-600" /> Generate Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CLIENTS CRM */}
          {activeTab === "clients" && (
            <div className="rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="font-display text-xl font-semibold text-slate-800">
                  Client Database CRM ({filteredClients.length})
                </h3>

                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, email..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="min-h-10 pl-9 pr-4 rounded-xl border border-[#E8A020]/20 bg-white/75 backdrop-blur-sm text-sm outline-none transition-all duration-200 focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 shadow-sm"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-[#E8A020]/12">
                <table className="min-w-full divide-y divide-[#E8A020]/12">
                  <thead className="bg-[#E8A020]/5">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Name
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Phone
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Email
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Date of Birth
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Consultation Notes
                      </th>
                      <th className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-[1px] text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8A020]/10 bg-white/50">
                    {filteredClients.map((c) => (
                      <tr key={c.id} className="hover:bg-[#E8A020]/4 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800">
                          {c.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 font-medium">
                          {c.phone}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 font-medium">
                          {c.email || <span className="text-xs text-slate-400">—</span>}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 font-medium">
                          {c.date_of_birth || <span className="text-xs text-slate-400">—</span>}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 max-w-sm truncate">
                          {c.notes || <span className="text-xs text-slate-400 italic">No notes added. Click manage to write notes.</span>}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-semibold">
                          <button
                            onClick={() => {
                              setViewingClient(c);
                              setEditingClientNotes(c.notes || "");
                            }}
                            className="inline-flex items-center gap-1 text-[#D4700A] hover:text-[#E8A020] transition-colors"
                          >
                            <Edit2 className="h-4 w-4" /> Notes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SERVICE PRICING EDITOR */}
          {activeTab === "services" && (
            <div className="rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)]">
              <div className="mb-6">
                <h3 className="font-display text-xl font-semibold text-slate-800">
                  Manage Services & Pricing
                </h3>
                <p className="mt-1 text-sm text-slate-500 font-medium">
                  Toggle services, adjust duration, and set minimum/maximum consultation price bounds.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-2xl border p-5 shadow-sm transition-all duration-200 ${
                      s.is_active
                        ? "border-[#E8A020]/20 bg-white/80"
                        : "border-dashed border-[#E8A020]/25 bg-slate-50/50 opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-display text-lg font-semibold text-slate-800">
                        {s.name}
                      </h4>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] ${
                          s.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                            : "bg-slate-100 text-slate-500 border border-slate-200/50"
                        }`}
                      >
                        {s.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500 line-clamp-2 h-8 font-medium leading-relaxed">
                      {s.description || "No description provided."}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[#E8A020]/12 pt-4 text-sm font-medium">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-[0.5px]">
                          Duration
                        </span>
                        <p className="font-semibold text-slate-800">{s.duration_minutes} Mins</p>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-[0.5px]">
                          Price Bounds
                        </span>
                        <p className="font-bold text-slate-800 font-numeral">
                          ₹{s.price_min} - ₹{s.price_max}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button
                        onClick={() => {
                          setEditingService(s);
                          setServiceEditName(s.name);
                          setServiceEditMin(s.price_min);
                          setServiceEditMax(s.price_max);
                          setServiceEditDuration(s.duration_minutes);
                          setServiceEditDesc(s.description || "");
                          setServiceEditActive(s.is_active);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8A020]/25 bg-white/85 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-[#E8A020]/10 hover:text-slate-800 transition-all"
                      >
                        <Settings2 className="h-3.5 w-3.5" /> Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CAMPAIGNS MANAGER */}
          {activeTab === "marketing" && (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Campaign Editor Form */}
              <div className="lg:col-span-2 rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)]">
                <h3 className="font-display text-xl font-semibold text-slate-800 mb-4">
                  Create Marketing Campaign
                </h3>

                <div className="space-y-4">
                  {/* Select Cohort */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                      Target Client Cohort
                    </label>
                    <select
                      value={marketingCohort}
                      onChange={(e) => setMarketingCohort(e.target.value)}
                      className="w-full min-h-11 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 backdrop-blur-sm text-sm outline-none transition-all duration-200 focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 shadow-sm"
                    >
                      <option value="all">All Registered Clients (Leads & Booked)</option>
                      <option value="active">Active Consulted Clients (At least 1 booking)</option>
                      <option value="leads">Unconverted Leads (0 bookings)</option>
                    </select>
                  </div>

                  {/* Channel selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                      Delivery Channel
                    </label>
                    <select
                      value={marketingChannel}
                      onChange={(e) => setMarketingChannel(e.target.value)}
                      className="w-full min-h-11 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 backdrop-blur-sm text-sm outline-none transition-all duration-200 focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 shadow-sm"
                    >
                      <option value="email">Brevo Email Broadcast</option>
                      <option value="whatsapp">WhatsApp Business Broadcast</option>
                    </select>
                  </div>

                  {/* Subject (Email only) */}
                  {marketingChannel === "email" && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                        Email Subject
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ✦ Exclusive Numerology Forecast & Corrections"
                        value={marketingSubject}
                        onChange={(e) => setMarketingSubject(e.target.value)}
                        className="w-full min-h-11 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 backdrop-blur-sm text-sm outline-none transition-all duration-200 focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 shadow-sm"
                      />
                    </div>
                  )}

                  {/* Message body */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                      Message Body
                    </label>
                    <textarea
                      rows={8}
                      placeholder={
                        marketingChannel === "email"
                          ? "Write your campaign email body..."
                          : "Write your WhatsApp message copy..."
                      }
                      value={marketingMessage}
                      onChange={(e) => setMarketingMessage(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 backdrop-blur-sm text-sm outline-none transition-all duration-200 focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 font-medium leading-relaxed shadow-sm"
                    />
                  </div>

                  <button
                    onClick={handleSendMarketing}
                    disabled={!marketingMessage.trim() || marketingSending}
                    className="w-full min-h-11 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1E0A3C] to-[#0D0820] text-white font-semibold transition hover:shadow-md hover:shadow-indigo-950/20 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {marketingSending ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Megaphone className="h-4.5 w-4.5" /> Broadcast Campaign
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status & Simulation Log Panel */}
              <div className="rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)] h-fit">
                <h3 className="font-display text-lg font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Info className="h-4.5 w-4.5 text-[#D4700A]" /> Broadcast Status
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Third-party marketing services are optional. If WhatsApp Business or Brevo keys are not set up in your `.env.local` file, the portal automatically triggers a simulation listing which clients would receive the message.
                </p>

                {marketingResult && (
                  <div className="mt-5 rounded-xl border border-[#E8A020]/25 bg-white/95 p-4 shadow-sm">
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                      {marketingResult.simulated ? "📢 Broadcast Simulated" : "✅ Campaign Dispatched"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">
                      {marketingResult.simulated
                        ? `A simulated campaign was broadcasted to ${marketingResult.sentCount} recipients.`
                        : `Delivered to ${marketingResult.sentCount} active contacts.`}
                    </p>

                    {marketingResult.recipients && (
                      <div className="mt-3 max-h-40 overflow-y-auto space-y-2 border-t border-[#E8A020]/12 pt-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-slate-400">
                          Recipients List:
                        </p>
                        {marketingResult.recipients.map((c: { name: string; email: string | null; phone: string }, i: number) => (
                          <div key={i} className="text-xs border-b border-[#E8A020]/5 pb-1">
                            <p className="font-semibold text-slate-700">{c.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {marketingChannel === "email" ? c.email : c.phone}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: INVOICING / RECEIPTS */}
          {activeTab === "billing" && (
            <div>
              {!selectedBookingForBill ? (
                <div className="rounded-2xl border border-[#E8A020]/16 bg-white/72 backdrop-blur-md p-6 shadow-[0_10px_30px_rgba(232,160,32,0.02)]">
                  <h3 className="font-display text-xl font-semibold text-slate-800 mb-4">
                    Select Consultation to Generate Invoice
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-[#E8A020]/12">
                    <table className="min-w-full divide-y divide-[#E8A020]/12">
                      <thead className="bg-[#E8A020]/5">
                        <tr>
                          <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                            Client
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                            Service
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                            Schedule
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-500">
                            Amount Paid
                          </th>
                          <th className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-[1px] text-slate-500">
                            Billing
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8A020]/10 bg-white/50">
                        {bookings
                          .filter((b) => b.status === "confirmed" || b.status === "completed")
                          .map((b) => (
                            <tr key={b.id} className="hover:bg-[#E8A020]/4 transition-colors">
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-800">
                                {b.clients?.name}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 font-medium">
                                {b.services?.name}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 font-numeral font-semibold">
                                {b.booking_date}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-800 font-numeral">
                                ₹{b.amount_paid}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                <button
                                  onClick={() => setSelectedBookingForBill(b)}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8A020]/8 border border-[#E8A020]/16 px-3.5 py-2 text-xs font-bold text-[#D4700A] hover:bg-[#E8A020] hover:text-white transition-all duration-200"
                                >
                                  <Receipt className="h-3.5 w-3.5" /> Generate Invoice
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-4">
                  {/* Actions column */}
                  <div className="lg:col-span-1 space-y-4 print:hidden">
                    <button
                      onClick={() => setSelectedBookingForBill(null)}
                      className="w-full min-h-10 inline-flex items-center justify-center gap-2 rounded-full border border-[#E8A020]/25 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-[#E8A020]/10 hover:text-slate-800 transition active:scale-95"
                    >
                      Back to list
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="w-full min-h-11 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1E0A3C] to-[#0D0820] text-white font-semibold shadow-md hover:shadow-lg hover:shadow-indigo-950/20 transition active:scale-95"
                    >
                      <Printer className="h-4 w-4" /> Print / Save PDF
                    </button>
                  </div>

                  {/* Printable Invoice Page */}
                  <div className="lg:col-span-3 rounded-2xl border border-[#E8A020]/16 border-t-4 border-t-[#E8A020]/80 bg-white p-8 shadow-[0_10px_30px_rgba(232,160,32,0.02)] print:border-none print:shadow-none print:p-0 print:absolute print:inset-0 print:z-[9999]">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between border-b border-[#E8A020]/12 pb-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#E8A020]" />
                          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-800">
                            NumeroSoul
                          </h2>
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-[3px] text-[#D4700A] mt-1.5">
                          ✦ Professional Numerology Consultant ✦
                        </p>
                        <p className="text-xs text-slate-400 font-semibold mt-1.5">
                          Badaun, Uttar Pradesh, India
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <h3 className="font-display text-xl font-bold text-slate-800 uppercase tracking-wide">
                          Invoice
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-semibold font-numeral">
                          Invoice #: {selectedBookingForBill.invoice_number ?? selectedBookingForBill.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-500 font-semibold font-numeral">
                          Date: {selectedBookingForBill.booking_date}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-400">
                          Billed To
                        </p>
                        <p className="mt-1 font-semibold text-slate-800">
                          {selectedBookingForBill.clients?.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Phone: {selectedBookingForBill.clients?.phone}
                        </p>
                        {selectedBookingForBill.clients?.email && (
                          <p className="text-xs text-slate-500 font-medium">
                            Email: {selectedBookingForBill.clients?.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-400">
                          Consultant
                        </p>
                        <p className="mt-1 font-semibold text-slate-800">Uma Rastogi</p>
                        <p className="text-xs text-slate-500 font-medium">Badaun, Uttar Pradesh, India</p>
                        <p className="text-xs text-slate-500 font-medium">Email: numerosoul6@gmail.com</p>
                      </div>
                    </div>

                    {/* Items table */}
                    <table className="mt-10 min-w-full divide-y divide-[#E8A020]/12">
                      <thead>
                        <tr>
                          <th className="py-3 text-left text-xs font-bold uppercase tracking-[1px] text-slate-400">
                            Service Item Description
                          </th>
                          <th className="py-3 text-center text-xs font-bold uppercase tracking-[1px] text-slate-400">
                            Duration
                          </th>
                          <th className="py-3 text-right text-xs font-bold uppercase tracking-[1px] text-slate-400">
                            Amount Paid
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8A020]/10">
                        <tr>
                          <td className="py-4 text-sm font-semibold text-slate-800">
                            {selectedBookingForBill.services?.name ?? "Numerology Consultation"}
                            <span className="block text-xs text-slate-400 font-medium mt-1">
                              Client DOB: {selectedBookingForBill.clients?.date_of_birth ?? "N/A"}
                            </span>
                          </td>
                          <td className="py-4 text-center text-sm font-numeral font-semibold text-slate-500">
                            {selectedBookingForBill.services?.duration_minutes ?? "N/A"} Mins
                          </td>
                          <td className="py-4 text-right text-sm font-bold font-numeral text-slate-800">
                            ₹{selectedBookingForBill.amount_paid}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mt-8 border-t border-[#E8A020]/12 pt-6 flex flex-col items-end">
                      <div className="w-full sm:w-64 space-y-2 text-sm text-slate-600 font-medium">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-numeral">₹{selectedBookingForBill.amount_paid}</span>
                        </div>
                        <div className="flex justify-between border-t border-[#E8A020]/12 pt-2 text-base font-bold text-slate-800">
                          <span>Total Paid:</span>
                          <span className="font-numeral">₹{selectedBookingForBill.amount_paid}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 text-center text-xs text-slate-400 font-semibold border-t border-[#E8A020]/12 pt-6">
                      Thank you for trusting NumeroSoul. Guided cycles & alignments.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: NUMEROLOGY WORKSPACE */}
          {activeTab === "analysis" && (
            <AdminNumerologyWorkspace bookings={bookings} />
          )}
        </div>
      )}

      {/* 3. MODALS SECTION */}

      {/* Modal A: Reschedule/Manage Booking */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E8A020]/20 border-t-2 border-t-[#E8A020]/60 bg-white/92 backdrop-blur-xl p-6 shadow-[0_24px_60px_rgba(232,160,32,0.12)]">
            <h3 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              Manage Consultation
            </h3>

            <div className="space-y-4">
              <div className="rounded-xl bg-[#E8A020]/5 border border-[#E8A020]/12 p-4 space-y-3">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-[1px]">
                    Client Name
                  </span>
                  <p className="text-sm font-semibold text-slate-800">{editingBooking.clients?.name}</p>
                </div>

                <div className="border-t border-[#E8A020]/10 pt-2.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-[1px]">
                    Service Requested
                  </span>
                  <p className="text-sm text-slate-600 font-semibold">{editingBooking.services?.name}</p>
                </div>
                {(editingBooking.video_conference_url || editingBooking.invoice_number) && (
                  <div className="grid gap-3 border-t border-[#E8A020]/10 pt-2.5 sm:grid-cols-2">
                    {editingBooking.video_conference_url && (
                      <a
                        href={getAdminVideoLink(editingBooking.video_conference_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 truncate text-xs font-bold text-[#D4700A]"
                      >
                        <FileText className="h-3.5 w-3.5" /> Open video link
                      </a>
                    )}
                    {editingBooking.invoice_number && (
                      <a
                        href={`/invoice/${editingBooking.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 truncate text-xs font-bold text-slate-600"
                      >
                        <Receipt className="h-3.5 w-3.5" /> Open invoice
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Edit Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                  Reschedule Date
                </label>
                <input
                  type="date"
                  value={bookingEditDate}
                  onChange={(e) => setBookingEditDate(e.target.value)}
                  className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40"
                />
              </div>

              {/* Edit Time */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                  Time Slot
                </label>
                <input
                  type="time"
                  value={bookingEditTime}
                  onChange={(e) => setBookingEditTime(e.target.value)}
                  className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40"
                />
              </div>

              {/* Edit Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                  Update Status
                </label>
                <select
                  value={bookingEditStatus}
                  onChange={(e) => setBookingEditStatus(e.target.value)}
                  className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 animate-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="rounded-xl border border-[#E8A020]/16 bg-[#E8A020]/5 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Send className="h-4 w-4 text-[#D4700A]" />
                  <h4 className="text-sm font-bold text-slate-800">Post-session care</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                      Session Notes For Customer
                    </label>
                    <textarea
                      rows={4}
                      value={postSessionNotes}
                      onChange={(e) => setPostSessionNotes(e.target.value)}
                      placeholder="Write the summary, remedies, lucky dates, corrected spellings, and next action steps..."
                      className="w-full p-3.5 rounded-xl border border-[#E8A020]/20 bg-white/80 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 font-medium leading-relaxed"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                        Report Link
                      </label>
                      <input
                        type="url"
                        value={postSessionReportUrl}
                        onChange={(e) => setPostSessionReportUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/80 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                        Follow-up Reminder
                      </label>
                      <input
                        type="datetime-local"
                        value={postSessionFollowUpAt}
                        onChange={(e) => setPostSessionFollowUpAt(e.target.value)}
                        className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/80 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendPostSession}
                    disabled={postSessionSending || (!postSessionNotes.trim() && !postSessionReportUrl.trim())}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#E8A020] px-5 text-xs font-bold text-white shadow-sm transition hover:bg-[#D4700A] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                  >
                    {postSessionSending ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" /> Send Notes & Mark Complete
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8A020]/12">
                <button
                  onClick={() => setEditingBooking(null)}
                  className="rounded-full border border-[#E8A020]/25 bg-white/60 backdrop-blur-sm px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-[#E8A020]/10 hover:text-slate-800 transition-all duration-200 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBooking}
                  className="rounded-full bg-gradient-to-r from-[#1E0A3C] to-[#0D0820] text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-lg hover:shadow-indigo-950/20 transition-all duration-200 active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal B: Edit Client Notes */}
      {viewingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#E8A020]/20 border-t-2 border-t-[#E8A020]/60 bg-white/92 backdrop-blur-xl p-6 shadow-[0_24px_60px_rgba(232,160,32,0.12)]">
            <h3 className="font-display text-2xl font-semibold text-slate-800 mb-1">
              Client Profile Details
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-semibold">
              Manage information and consultation logs.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#E8A020]/5 border border-[#E8A020]/12 p-4">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-[1px]">
                    Name
                  </span>
                  <p className="text-sm font-semibold text-slate-800">{viewingClient.name}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-[1px]">
                    Phone
                  </span>
                  <p className="text-sm text-slate-700 font-semibold">{viewingClient.phone}</p>
                </div>
                <div className="border-t border-[#E8A020]/10 pt-2.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-[1px]">
                    Email
                  </span>
                  <p className="text-sm text-slate-600 font-semibold truncate">{viewingClient.email || "—"}</p>
                </div>
                <div className="border-t border-[#E8A020]/10 pt-2.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-[1px]">
                    Date of birth
                  </span>
                  <p className="text-sm text-slate-700 font-numeral font-bold">
                    {viewingClient.date_of_birth || "—"}
                  </p>
                </div>
              </div>

              {/* Consultation Notes Textarea */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                  Private Consulting Notes
                </label>
                <textarea
                  rows={6}
                  value={editingClientNotes}
                  onChange={(e) => setEditingClientNotes(e.target.value)}
                  placeholder="Add details, recurring life path observations, recommended name corrections, or vehicle number advice..."
                  className="w-full p-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 font-medium leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8A020]/12">
                <button
                  onClick={() => setViewingClient(null)}
                  className="rounded-full border border-[#E8A020]/25 bg-white/60 backdrop-blur-sm px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-[#E8A020]/10 hover:text-slate-800 transition-all duration-200 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateClientNotes}
                  className="rounded-full bg-gradient-to-r from-[#1E0A3C] to-[#0D0820] text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-lg hover:shadow-indigo-950/20 transition-all duration-200 active:scale-95"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal C: Configure Service Pricing */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#E8A020]/20 border-t-2 border-t-[#E8A020]/60 bg-white/92 backdrop-blur-xl p-6 shadow-[0_24px_60px_rgba(232,160,32,0.12)]">
            <h3 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              Configure Service Details
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                  Service Name
                </label>
                <input
                  type="text"
                  value={serviceEditName}
                  onChange={(e) => setServiceEditName(e.target.value)}
                  className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40"
                />
              </div>

              {/* Pricing Bounds */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                    Min Price (₹)
                  </label>
                  <input
                    type="number"
                    value={serviceEditMin}
                    onChange={(e) => setServiceEditMin(Number(e.target.value))}
                    className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none font-numeral transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                    Max Price (₹)
                  </label>
                  <input
                    type="number"
                    value={serviceEditMax}
                    onChange={(e) => setServiceEditMax(Number(e.target.value))}
                    className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none font-numeral transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={serviceEditDuration}
                  onChange={(e) => setServiceEditDuration(Number(e.target.value))}
                  className="w-full min-h-10 px-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none font-numeral transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[1.5px] text-[#D4700A] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={serviceEditDesc}
                  onChange={(e) => setServiceEditDesc(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[#E8A020]/20 bg-white/75 text-sm outline-none transition focus:border-[#E8A020]/60 focus:bg-white focus:ring-1 focus:ring-[#E8A020]/40 font-medium leading-relaxed"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between border-t border-[#E8A020]/12 pt-4">
                <span className="text-sm font-semibold text-slate-700">Service Active</span>
                <input
                  type="checkbox"
                  checked={serviceEditActive}
                  onChange={(e) => setServiceEditActive(e.target.checked)}
                  className="h-5 w-5 rounded border-[#E8A020]/20 text-[#D4700A] focus:ring-[#E8A020] cursor-pointer"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8A020]/12">
                <button
                  onClick={() => setEditingService(null)}
                  className="rounded-full border border-[#E8A020]/25 bg-white/60 backdrop-blur-sm px-5 py-2.5 text-xs font-semibold text-slate-500 hover:bg-[#E8A020]/10 transition-all duration-200 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateService}
                  className="rounded-full bg-gradient-to-r from-[#1E0A3C] to-[#0D0820] text-white px-5 py-2.5 text-xs font-semibold hover:shadow-md transition-all duration-200 active:scale-95"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedBookingForReport && (
        <ClientReportModal
          booking={selectedBookingForReport}
          onClose={() => setSelectedBookingForReport(null)}
        />
      )}
    </div>
  );
}
