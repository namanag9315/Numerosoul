import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { hasSupabaseAdmin, normalizeDate } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

// GET all clients
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

    const res = await fetch(`${supabaseUrl}/rest/v1/clients?select=*&order=name.asc`, {
      headers: {
        apikey: serviceRoleKey!,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch clients: ${res.statusText}`);
    }

    const clients = await res.json();
    return NextResponse.json(clients);
  } catch (error: unknown) {
    console.error("Fetch clients error:", error);
    const message = error instanceof Error ? error.message : "Failed to load clients.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

// PUT to edit client information/notes
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
    const { id, name, email, phone, dateOfBirth, notes } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Client ID is required." },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, string | null> = {};
    if (name !== undefined) updatePayload.name = name;
    if (email !== undefined) updatePayload.email = email || null;
    if (phone !== undefined) updatePayload.phone = phone;
    if (dateOfBirth !== undefined) updatePayload.date_of_birth = normalizeDate(dateOfBirth) ?? null;
    if (notes !== undefined) updatePayload.notes = notes || null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^["']|["']$/g, '');
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const res = await fetch(`${supabaseUrl}/rest/v1/clients?id=eq.${id}`, {
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
      throw new Error(`Failed to update client: ${res.statusText}`);
    }

    const updatedRows = await res.json();
    return NextResponse.json({ success: true, client: updatedRows[0] });
  } catch (error: unknown) {
    console.error("Update client error:", error);
    const message = error instanceof Error ? error.message : "Failed to update client.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
