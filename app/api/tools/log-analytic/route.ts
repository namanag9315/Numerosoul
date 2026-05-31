import { NextRequest, NextResponse } from "next/server";
import { insertToolAnalytic, hasSupabaseAdmin } from "@/lib/server/supabase";

export async function POST(request: NextRequest) {
  try {
    if (!hasSupabaseAdmin()) {
      return NextResponse.json(
        { message: "Supabase connection not configured." },
        { status: 503 }
      );
    }

    const { toolName } = await request.json();
    if (!toolName || typeof toolName !== "string") {
      return NextResponse.json(
        { message: "Invalid toolName provided." },
        { status: 400 }
      );
    }

    const id = await insertToolAnalytic(toolName);
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to log tool analytic:", error);
    const message = error instanceof Error ? error.message : "Failed to log analytic.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
