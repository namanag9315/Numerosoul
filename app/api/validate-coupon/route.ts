import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type CouponRecord = {
  code: string;
  discount_flat?: number | null;
  discount_percent?: number | null;
  is_active?: boolean | null;
  max_uses?: number | null;
  used_count?: number | null;
  valid_until?: string | null;
};

const localCoupons: Record<string, { discountAmount?: number; discountPercent?: number }> = {
  NUMERA500: { discountAmount: 500 },
  SOUL10: { discountPercent: 10 },
};

export async function POST(request: NextRequest) {
  const body = await readRequestJson(request);
  const code = String(body.code ?? "").trim().toUpperCase();
  const subtotal = Number(body.subtotal ?? 0);

  if (!code || subtotal <= 0) {
    return NextResponse.json({ message: "Coupon code and subtotal are required." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const url = new URL("/rest/v1/coupons", supabaseUrl);
    url.searchParams.set("select", "code,discount_flat,discount_percent,is_active,valid_until,max_uses,used_count");
    url.searchParams.set("code", `eq.${code}`);
    url.searchParams.set("limit", "1");

    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      next: { revalidate: 0 },
    });

    if (response.ok) {
      const records = await readResponseJson<CouponRecord[]>(response, []);
      const coupon = records[0];

      if (
        !coupon ||
        coupon.is_active === false ||
        isExpired(coupon.valid_until) ||
        hasReachedMaxUses(coupon)
      ) {
        return NextResponse.json({ valid: false, message: "Coupon is invalid or expired." });
      }

      return NextResponse.json({
        discount: calculateDiscount(subtotal, coupon.discount_flat, coupon.discount_percent),
        message: "Coupon applied.",
        valid: true,
      });
    }
  }

  const localCoupon = localCoupons[code];

  if (!localCoupon) {
    return NextResponse.json({ valid: false, message: "Coupon not found." });
  }

  return NextResponse.json({
    discount: calculateDiscount(subtotal, localCoupon.discountAmount, localCoupon.discountPercent),
    message: "Coupon applied.",
    source: "local-fallback",
    valid: true,
  });
}

async function readRequestJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function readResponseJson<T>(response: Response, fallback: T): Promise<T> {
  const text = await response.text();

  if (!text.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

function calculateDiscount(
  subtotal: number,
  discountAmount?: number | null,
  discountPercent?: number | null,
) {
  if (discountAmount) {
    return Math.min(Math.round(discountAmount), subtotal);
  }

  if (discountPercent) {
    return Math.min(Math.round((subtotal * discountPercent) / 100), subtotal);
  }

  return 0;
}

function isExpired(expiresAt?: string | null) {
  return Boolean(expiresAt && new Date(expiresAt).getTime() < Date.now());
}

function hasReachedMaxUses(coupon: CouponRecord) {
  return Boolean(
    typeof coupon.max_uses === "number" &&
      typeof coupon.used_count === "number" &&
      coupon.used_count >= coupon.max_uses,
  );
}
