"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { cn } from "@/lib/utils";
import { CreditCard, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

interface CardWarrantyFormProps {
  clientSecret: string;
  onSuccess: (paymentMethodId: string) => void;
  bookingId: string;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      fontFamily: "Manrope, system-ui, sans-serif",
      color: "#111110",
      "::placeholder": {
        color: "#A3A3A0",
      },
    },
    invalid: {
      color: "#DC2626",
      iconColor: "#DC2626",
    },
  },
};

export default function CardWarrantyForm({
  clientSecret,
  onSuccess,
  bookingId,
}: CardWarrantyFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: setupError, setupIntent } =
        await stripe.confirmCardSetup(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (setupError) {
        setError(
          setupError.message ?? "An error occurred while saving your card."
        );
        setLoading(false);
        return;
      }

      if (setupIntent?.payment_method) {
        const paymentMethodId =
          typeof setupIntent.payment_method === "string"
            ? setupIntent.payment_method
            : setupIntent.payment_method.id;
        onSuccess(paymentMethodId);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-xl bg-sage-50 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
        <div>
          <p className="text-sm font-semibold text-sage-500">
            No payment will be taken
          </p>
          <p className="mt-0.5 text-sm text-sage-400">
            Your card is held as a warranty only. You will not be charged unless
            the hotel&apos;s cancellation policy applies.
          </p>
        </div>
      </div>

      {/* Card Element */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-sm font-medium text-navy-500">
          <CreditCard className="h-4 w-4" />
          Card details
        </label>
        <div
          className={cn(
            "rounded-lg border bg-white px-4 py-3 transition-colors",
            error ? "border-red-500" : "border-navy-100"
          )}
        >
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => {
              setCardComplete(e.complete);
              if (e.error) {
                setError(e.error.message);
              } else {
                setError(null);
              }
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Booking ID Reference */}
      <p className="text-xs text-ink-200">
        Booking reference: {bookingId}
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || !cardComplete || loading}
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors",
          "bg-vermillion hover:bg-vermillion-600",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming...
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            Confirm card warranty
          </>
        )}
      </button>
    </form>
  );
}
