import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt } = body;

    if (!amount) {
      return NextResponse.json({ message: "Amount is required." }, { status: 400 });
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.replace(/^["']|["']$/g, '');
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.replace(/^["']|["']$/g, '');

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { message: "Razorpay keys are not configured in environment variables." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    
    // Razorpay SDK often throws an object with an 'error' property
    let errorMessage = "Failed to create order";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null && "error" in error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzpError = (error as any).error;
      if (rzpError && rzpError.description) {
        errorMessage = rzpError.description;
      }
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
