import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { hasSupabaseAdmin } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^["']|["']$/g, '');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Helper for Supabase requests
    const dbFetch = async (path: string, options: RequestInit = {}) => {
      const res = await fetch(`${supabaseUrl}${path}`, {
        ...options,
        headers: {
          apikey: serviceRoleKey!,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          ...(options.headers ?? {}),
        },
        next: { revalidate: 0 },
      });
      if (!res.ok) {
        throw new Error(`Supabase query failed: ${res.statusText}`);
      }
      return res.json();
    };

    // Run queries in parallel
    const [
      bookingsList,
      clientsList,
      couponsList,
      recentBookings,
      analyticsList,
    ] = await Promise.all([
      dbFetch("/rest/v1/bookings?select=amount_paid,status,booking_date"),
      dbFetch("/rest/v1/clients?select=id"),
      dbFetch("/rest/v1/coupons?select=id&is_active=eq.true"),
      dbFetch(
        "/rest/v1/bookings?select=id,booking_date,time_slot,status,amount_paid,clients(name),services(name)&order=created_at.desc&limit=5"
      ),
      dbFetch("/rest/v1/tool_analytics?select=tool_name"),
    ]);

    // 1. Calculate Revenue (only from confirmed/completed bookings)
    let totalRevenue = 0;
    const totalBookings = bookingsList.length;

    bookingsList.forEach((b: { status: string; amount_paid: number | null }) => {
      if (b.status === "confirmed" || b.status === "completed") {
        totalRevenue += b.amount_paid ?? 0;
      }
    });

    // 2. Client count
    const totalClients = clientsList.length;

    // 3. Coupon count
    const activeCoupons = couponsList.length;

    // 4. Booking Trends (last 14 days)
    const trendsMap: { [key: string]: number } = {};
    // Seed the map with the last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      trendsMap[dateStr] = 0;
    }

    bookingsList.forEach((b: { status: string; booking_date: string }) => {
      if (b.booking_date in trendsMap && b.status !== "cancelled") {
        trendsMap[b.booking_date]++;
      }
    });

    const bookingTrends = Object.keys(trendsMap).map((date) => ({
      date,
      count: trendsMap[date],
    }));

    // 5. Tool Analytics distribution
    const toolCountsMap: { [key: string]: number } = {
      "Life Path": 0,
      "Name Number": 0,
      "Vehicle Vibration": 0,
      "Psychic Number": 0,
      "Personal Year": 0,
    };

    analyticsList.forEach((a: { tool_name: string }) => {
      if (a.tool_name in toolCountsMap) {
        toolCountsMap[a.tool_name]++;
      }
    });

    const toolUsage = Object.keys(toolCountsMap).map((toolName) => ({
      name: toolName,
      count: toolCountsMap[toolName],
    }));

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalBookings,
        totalClients,
        activeCoupons,
      },
      recentBookings: recentBookings.map((b: {
        id: string;
        booking_date: string;
        time_slot: string;
        status: string;
        amount_paid: number;
        clients: { name: string } | null;
        services: { name: string } | null;
      }) => ({
        id: b.id,
        date: b.booking_date,
        time: b.time_slot,
        status: b.status,
        amount: b.amount_paid,
        clientName: b.clients?.name ?? "Client",
        serviceName: b.services?.name ?? "Numerology Session",
      })),
      bookingTrends,
      toolUsage,
    });
  } catch (error: unknown) {
    console.error("Dashboard stats aggregation error:", error);
    const message = error instanceof Error ? error.message : "Failed to load dashboard statistics.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
