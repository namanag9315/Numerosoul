import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await readRequestJson(request);
  const { date, serviceId, timeSlot } = body as {
    date?: string;
    serviceId?: string;
    timeSlot?: string;
  };

  if (!date || !serviceId || !timeSlot) {
    return NextResponse.json({ message: "date, serviceId, and timeSlot are required." }, { status: 400 });
  }

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const edgeFunctionUrl = process.env.SUPABASE_EDGE_HOLD_SLOT_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (edgeFunctionUrl && supabaseKey) {
    const response = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        expires_at: expiresAt,
        service_id: serviceId,
        time_slot: timeSlot,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Could not hold this slot." }, { status: 409 });
    }

    const data = await readResponseJson<{
      expiresAt?: string;
      expires_at?: string;
      holdId?: string;
      id?: string;
    }>(response);
    return NextResponse.json({
      expiresAt: data.expiresAt ?? data.expires_at ?? expiresAt,
      holdId: data.holdId ?? data.id,
    });
  }

  return NextResponse.json({
    expiresAt,
    holdId: `hold_mock_${Date.now()}`,
    source: "local-fallback",
  });
}

async function readRequestJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function readResponseJson<T>(response: Response): Promise<Partial<T>> {
  const text = await response.text();

  if (!text.trim()) {
    return {};
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return {};
  }
}
