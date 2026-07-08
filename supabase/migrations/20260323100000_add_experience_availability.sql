-- Add availability date range to Experience table
-- Experiences with NULL availableFrom/availableTo are always available.

ALTER TABLE "Experience"
  ADD COLUMN IF NOT EXISTS "availableFrom" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "availableTo"   TIMESTAMP(3);

-- Index for availability filtering
CREATE INDEX IF NOT EXISTS "Experience_availability_idx"
  ON "Experience" ("availableFrom", "availableTo");
