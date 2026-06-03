import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { hasSupabaseAdmin } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

// GET all services
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

    const res = await fetch(`${supabaseUrl}/rest/v1/services?select=*&order=name.asc`, {
      headers: {
        apikey: serviceRoleKey!,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch services: ${res.statusText}`);
    }

    const services = await res.json();
    return NextResponse.json(services);
  } catch (error: unknown) {
    console.error("Fetch services error:", error);
    const message = error instanceof Error ? error.message : "Failed to load services.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

// PUT to edit a service's configurations
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { id, name, priceMin, priceMax, durationMinutes, description, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Service ID is required." },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, string | number | boolean | null> = {};
    if (name !== undefined) updatePayload.name = name;
    if (priceMin !== undefined) updatePayload.price_min = Number(priceMin);
    if (priceMax !== undefined) updatePayload.price_max = Number(priceMax);
    if (durationMinutes !== undefined) updatePayload.duration_minutes = Number(durationMinutes);
    if (description !== undefined) updatePayload.description = description || null;
    if (isActive !== undefined) updatePayload.is_active = Boolean(isActive);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^["']|["']$/g, '');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const res = await fetch(`${supabaseUrl}/rest/v1/services?id=eq.${id}`, {
      body: JSON.stringify(updatePayload),
      headers: {
        apikey: serviceRoleKey!,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      method: "PATCH",
    });

    if (!res.ok) {
      throw new Error(`Failed to update service: ${res.statusText}`);
    }

    const updatedRows = await res.json();
    return NextResponse.json({ success: true, service: updatedRows[0] });
  } catch (error: unknown) {
    console.error("Update service error:", error);
    const message = error instanceof Error ? error.message : "Failed to update service.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
