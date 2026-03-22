import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    if (event.type === "setup_intent.succeeded") {
      const setupIntent = event.data.object as Stripe.SetupIntent;
      const bookingId = setupIntent.metadata?.bookingId;

      if (bookingId) {
        const supabase = createAdminClient();

        // Retrieve payment method details for card info
        const paymentMethodId =
          typeof setupIntent.payment_method === "string"
            ? setupIntent.payment_method
            : setupIntent.payment_method?.id;

        let cardLast4: string | undefined;
        let cardBrand: string | undefined;

        if (paymentMethodId) {
          const paymentMethod =
            await stripe.paymentMethods.retrieve(paymentMethodId);
          cardLast4 = paymentMethod.card?.last4;
          cardBrand = paymentMethod.card?.brand;
        }

        await supabase
          .from("Booking")
          .update({
            stripePaymentMethodId: paymentMethodId,
            cardLast4: cardLast4 ?? null,
            cardBrand: cardBrand ?? null,
            warrantyCollected: true,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", bookingId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
