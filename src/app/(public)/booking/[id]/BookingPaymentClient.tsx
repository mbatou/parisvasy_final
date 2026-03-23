"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CardWarrantyForm from "@/components/public/CardWarrantyForm";

interface BookingPaymentClientProps {
  bookingId: string;
  guestEmail: string;
}

export default function BookingPaymentClient({
  bookingId,
}: BookingPaymentClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async (cardData: {
    cardNumber: string;
    cardExpiry: string;
    cardCvc: string;
    cardHolder: string;
  }) => {
    try {
      // Extract last 4 digits and card brand
      const last4 = cardData.cardNumber.slice(-4);
      const brand = detectBrand(cardData.cardNumber);

      // Save card info + confirm booking
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "confirmed",
          cardLast4: last4,
          cardBrand: brand,
          cardHolder: cardData.cardHolder,
          cardExpiry: cardData.cardExpiry,
          warrantyCollected: true,
        }),
      });

      if (!res.ok) {
        setError("Failed to confirm booking. Please try again.");
        return;
      }

      router.push(`/booking/confirmation?bookingId=${bookingId}`);
    } catch {
      setError("Failed to confirm booking. Please contact support.");
    }
  };

  if (error) {
    return (
      <div className="border border-red-900 bg-red-950 p-6">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="border border-white/[0.06] bg-pv-black-80 p-6">
      <h3 className="mb-6 font-serif text-xl font-light text-white">Card warranty</h3>
      <CardWarrantyForm
        onSuccess={handleSuccess}
        bookingId={bookingId}
      />
    </div>
  );
}

function detectBrand(num: string): string {
  if (/^4/.test(num)) return "visa";
  if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return "mastercard";
  if (/^3[47]/.test(num)) return "amex";
  if (/^6(?:011|5)/.test(num)) return "discover";
  return "card";
}
