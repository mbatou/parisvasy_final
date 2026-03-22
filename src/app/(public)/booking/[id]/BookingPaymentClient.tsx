"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CardWarrantyForm from "@/components/public/CardWarrantyForm";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface BookingPaymentClientProps {
  bookingId: string;
  guestEmail: string;
}

export default function BookingPaymentClient({
  bookingId,
  guestEmail,
}: BookingPaymentClientProps) {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function createSetupIntent() {
      try {
        const res = await fetch("/api/stripe/setup-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, guestEmail }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          setError(body?.error ?? "Failed to initialize payment form.");
          return;
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch {
        setError("An unexpected error occurred. Please try again.");
      }
    }

    createSetupIntent();
  }, [bookingId, guestEmail]);

  const handleSuccess = async (paymentMethodId: string) => {
    try {
      // Update booking with payment method info
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "confirmed",
          stripePaymentMethodId: paymentMethodId,
          warrantyCollected: true,
        }),
      });

      router.push(`/booking/confirmation?bookingId=${bookingId}`);
    } catch {
      setError("Failed to confirm booking. Please contact support.");
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-cream-300 bg-white p-12">
        <Loader2 className="h-8 w-8 animate-spin text-vermillion" />
        <p className="text-sm text-ink-300">Setting up secure payment...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-6">
      <h3 className="mb-6 font-serif text-xl text-navy">Card warranty</h3>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              fontFamily: "Manrope, system-ui, sans-serif",
              colorPrimary: "#E63946",
            },
          },
        }}
      >
        <CardWarrantyForm
          clientSecret={clientSecret}
          onSuccess={handleSuccess}
          bookingId={bookingId}
        />
      </Elements>
    </div>
  );
}
