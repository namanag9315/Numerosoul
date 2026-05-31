import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Missing or invalid authorization token." }, { status: 401 });
    }

    const accessToken = authHeader.substring(7);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return NextResponse.json(
        { message: "Supabase integration not fully configured." },
        { status: 503 }
      );
    }

    // Verify user JWT token with Supabase Auth Server
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.warn("Supabase auth verification failed:", errorText);
      return NextResponse.json({ message: "Invalid session or user not authenticated." }, { status: 401 });
    }

    const userData = await authResponse.json();
    const email = userData.email;

    if (!email) {
      return NextResponse.json({ message: "User email not found in authentication profile." }, { status: 400 });
    }

    // Fetch user bookings filtering by client email
    const dbResponse = await fetch(
      `${supabaseUrl}/rest/v1/bookings?select=id,booking_date,time_slot,mode,status,amount_paid,focus_areas,created_at,services(id,name,slug,duration_minutes),clients!inner(email)&clients.email=eq.${encodeURIComponent(email)}&order=booking_date.desc,time_slot.asc`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        next: { revalidate: 0 },
      }
    );

    if (!dbResponse.ok) {
      const dbError = await dbResponse.text();
      throw new Error(`Failed to query database bookings: ${dbError}`);
    }

    const bookings = await dbResponse.json();
    return NextResponse.json(bookings);
  } catch (error: unknown) {
    console.error("User bookings fetch error:", error);
    const message = error instanceof Error ? error.message : "Failed to load booking history.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
