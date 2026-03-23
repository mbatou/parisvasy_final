"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CardWarrantyForm from "@/components/public/CardWarrantyForm";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

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
  const [stripeNotConfigured, setStripeNotConfigured] = useState(false);
  const [skipping, setSkipping] = useState(false);

  useEffect(() => {
    // If no publishable key, Stripe isn't configured on the frontend either
    if (!stripeKey) {
      setStripeNotConfigured(true);
      return;
    }

    async function createSetupIntent() {
      try {
        const res = await fetch("/api/stripe/setup-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, guestEmail }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          if (res.status === 503) {
            // Stripe not configured on backend
            setStripeNotConfigured(true);
            return;
          }
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

  const handleSkipWarranty = async () => {
    setSkipping(true);
    try {
      // Confirm booking without card warranty
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "confirmed",
        }),
      });

      router.push(`/booking/confirmation?bookingId=${bookingId}`);
    } catch {
      setError("Failed to confirm booking. Please contact support.");
      setSkipping(false);
    }
  };

  // Stripe not configured — show info and allow skipping
  if (stripeNotConfigured) {
    return (
      <div className="border border-gold/20 bg-pv-black-80 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <div>
            <h3 className="font-serif text-lg font-light text-white">
              Card warranty unavailable
            </h3>
            <p className="mt-2 text-sm text-white/50 font-light">
              Stripe payment integration is not configured yet. You can still confirm your booking without providing a card warranty.
            </p>
            <p className="mt-1 text-xs text-white/30">
              The hotel may contact you to collect payment details before check-in.
            </p>
          </div>
        </div>
        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={handleSkipWarranty}
          loading={skipping}
        >
          Confirm booking without card
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-900 bg-red-950 p-6">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 border border-white/[0.06] bg-pv-black-80 p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <p className="text-sm text-white/40">Setting up secure payment...</p>
      </div>
    );
  }

  return (
    <div className="border border-white/[0.06] bg-pv-black-80 p-6">
      <h3 className="mb-6 font-serif text-xl font-light text-white">Card warranty</h3>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "night",
            variables: {
              fontFamily: "Manrope, system-ui, sans-serif",
              colorPrimary: "#C9A84C",
              colorBackground: "#1a1a1a",
              colorText: "#ffffff",
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
