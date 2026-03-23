"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreditCard, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

interface CardWarrantyFormProps {
  onSuccess: (cardData: { cardNumber: string; cardExpiry: string; cardCvc: string; cardHolder: string }) => void;
  bookingId: string;
}

export default function CardWarrantyForm({
  onSuccess,
  bookingId,
}: CardWarrantyFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Format expiry as MM/YY
  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    } else {
      setCardExpiry(digits);
    }
  };

  // Detect card brand from number
  const getCardBrand = (num: string): string => {
    const d = num.replace(/\s/g, "");
    if (/^4/.test(d)) return "visa";
    if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "mastercard";
    if (/^3[47]/.test(d)) return "amex";
    if (/^6(?:011|5)/.test(d)) return "discover";
    return "unknown";
  };

  const rawDigits = cardNumber.replace(/\s/g, "");
  const cardBrand = getCardBrand(rawDigits);
  const isComplete =
    cardHolder.trim().length >= 2 &&
    rawDigits.length >= 15 &&
    cardExpiry.length === 5 &&
    cardCvc.length >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isComplete) {
      setError("Please fill in all card details.");
      return;
    }

    // Basic expiry validation
    const [mm, yy] = cardExpiry.split("/");
    const month = parseInt(mm, 10);
    const year = parseInt(yy, 10) + 2000;
    const now = new Date();
    if (month < 1 || month > 12) {
      setError("Invalid expiry month.");
      return;
    }
    if (new Date(year, month) < new Date(now.getFullYear(), now.getMonth() + 1)) {
      setError("Card has expired.");
      return;
    }

    setLoading(true);
    try {
      onSuccess({
        cardNumber: rawDigits,
        cardExpiry,
        cardCvc,
        cardHolder: cardHolder.trim(),
      });
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-pv-black-90 p-4">
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

      {/* Card Holder */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white">Cardholder name</label>
        <input
          type="text"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          placeholder="John Doe"
          required
          className="h-10 border border-white/[0.06] bg-pv-black-80 px-4 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 font-light"
        />
      </div>

      {/* Card Number */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-sm font-medium text-white">
          <CreditCard className="h-4 w-4" />
          Card number
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={cardNumber}
            onChange={(e) => handleCardNumberChange(e.target.value)}
            placeholder="4242 4242 4242 4242"
            required
            className={cn(
              "h-10 w-full border bg-pv-black-80 px-4 pr-20 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 font-light font-mono tracking-wider",
              error ? "border-red-500" : "border-white/[0.06]"
            )}
          />
          {cardBrand !== "unknown" && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wide font-semibold text-gold/60">
              {cardBrand}
            </span>
          )}
        </div>
      </div>

      {/* Expiry & CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white">Expiry</label>
          <input
            type="text"
            inputMode="numeric"
            value={cardExpiry}
            onChange={(e) => handleExpiryChange(e.target.value)}
            placeholder="MM/YY"
            required
            className="h-10 border border-white/[0.06] bg-pv-black-80 px-4 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 font-light font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white">CVC</label>
          <input
            type="text"
            inputMode="numeric"
            value={cardCvc}
            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="123"
            required
            className="h-10 border border-white/[0.06] bg-pv-black-80 px-4 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 font-light font-mono"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Booking ID Reference */}
      <p className="text-xs text-white/30">
        Booking reference: {bookingId}
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isComplete || loading}
        className={cn(
          "flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-pv-black transition-colors",
          "bg-gold hover:bg-gold/90",
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
