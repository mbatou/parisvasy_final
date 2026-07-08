-- Add cardholder name and expiry to Booking for manual card warranty storage
ALTER TABLE "Booking"
  ADD COLUMN IF NOT EXISTS "cardHolder" TEXT,
  ADD COLUMN IF NOT EXISTS "cardExpiry" TEXT;
