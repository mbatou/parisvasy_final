import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const { bookingId, guestEmail } = await request.json();

    if (!bookingId || !guestEmail) {
      return NextResponse.json(
        { error: "bookingId and guestEmail are required" },
        { status: 400 }
      );
    }

    // Create or retrieve Stripe customer by email
    const existingCustomers = await stripe.customers.list({
      email: guestEmail,
      limit: 1,
    });

    let customer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: guestEmail,
      });
    }

    // Create SetupIntent for card warranty collection
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
      metadata: {
        bookingId,
      },
    });

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error("Error creating SetupIntent:", error);
    return NextResponse.json(
      { error: "Failed to create SetupIntent" },
      { status: 500 }
    );
  }
}
