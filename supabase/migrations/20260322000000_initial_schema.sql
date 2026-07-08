-- PARISVASY Initial Schema Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ─── ENUMS ───

DO $$ BEGIN
  CREATE TYPE "UserRole" AS ENUM ('super_admin', 'hotel_manager', 'finance_manager', 'front_desk', 'customer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ExperienceCategory" AS ENUM ('cruise', 'gastronomy', 'culture', 'wellness', 'adventure', 'nightlife');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "RoomType" AS ENUM ('classic', 'superior', 'deluxe', 'suite', 'penthouse');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── TABLES ───

CREATE TABLE IF NOT EXISTS "Hotel" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'France',
  "description" TEXT,
  "stars" INTEGER NOT NULL DEFAULT 4,
  "coverImage" TEXT,
  "images" TEXT[] DEFAULT '{}',
  "phone" TEXT,
  "email" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Hotel_slug_key" ON "Hotel"("slug");

CREATE TABLE IF NOT EXISTS "Room" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "hotelId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" "RoomType" NOT NULL,
  "description" TEXT,
  "size" INTEGER NOT NULL,
  "maxGuests" INTEGER NOT NULL DEFAULT 2,
  "amenities" TEXT[] DEFAULT '{}',
  "images" TEXT[] DEFAULT '{}',
  "pricePerNight" DECIMAL(10, 2) NOT NULL,
  "totalRooms" INTEGER NOT NULL DEFAULT 1,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Room_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Room_hotelId_idx" ON "Room"("hotelId");

CREATE TABLE IF NOT EXISTS "Experience" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "hotelId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" "ExperienceCategory" NOT NULL,
  "description" TEXT,
  "location" TEXT NOT NULL,
  "duration" TEXT NOT NULL,
  "maxGroup" INTEGER NOT NULL DEFAULT 10,
  "inclusions" TEXT[] DEFAULT '{}',
  "images" TEXT[] DEFAULT '{}',
  "coverImage" TEXT,
  "isFlash" BOOLEAN NOT NULL DEFAULT false,
  "flashStart" TIMESTAMP(3),
  "flashEnd" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Experience_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Experience_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Experience_slug_key" ON "Experience"("slug");
CREATE INDEX IF NOT EXISTS "Experience_hotelId_idx" ON "Experience"("hotelId");
CREATE INDEX IF NOT EXISTS "Experience_category_idx" ON "Experience"("category");

CREATE TABLE IF NOT EXISTS "Guest" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "authUserId" TEXT,
  "email" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT,
  "nationality" TEXT,
  "idNumber" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Guest_authUserId_key" ON "Guest"("authUserId");
CREATE UNIQUE INDEX IF NOT EXISTS "Guest_email_key" ON "Guest"("email");

CREATE TABLE IF NOT EXISTS "Booking" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "reference" TEXT NOT NULL,
  "hotelId" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "experienceId" TEXT NOT NULL,
  "guestId" TEXT NOT NULL,
  "checkIn" TIMESTAMP(3) NOT NULL,
  "checkOut" TIMESTAMP(3) NOT NULL,
  "nights" INTEGER NOT NULL,
  "guestCount" INTEGER NOT NULL DEFAULT 2,
  "roomTotal" DECIMAL(10, 2) NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'pending',
  "stripeSetupIntentId" TEXT,
  "stripePaymentMethodId" TEXT,
  "cardLast4" TEXT,
  "cardBrand" TEXT,
  "warrantyCollected" BOOLEAN NOT NULL DEFAULT false,
  "checkedInAt" TIMESTAMP(3),
  "checkedInBy" TEXT,
  "checkedOutAt" TIMESTAMP(3),
  "checkedOutBy" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Booking_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON UPDATE CASCADE,
  CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON UPDATE CASCADE,
  CONSTRAINT "Booking_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON UPDATE CASCADE,
  CONSTRAINT "Booking_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Booking_reference_key" ON "Booking"("reference");
CREATE INDEX IF NOT EXISTS "Booking_hotelId_idx" ON "Booking"("hotelId");
CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking"("status");
CREATE INDEX IF NOT EXISTS "Booking_checkIn_idx" ON "Booking"("checkIn");
CREATE INDEX IF NOT EXISTS "Booking_guestId_idx" ON "Booking"("guestId");

CREATE TABLE IF NOT EXISTS "StaffAssignment" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "hotelId" TEXT NOT NULL,
  "role" "UserRole" NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "StaffAssignment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "StaffAssignment_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "StaffAssignment_userId_hotelId_key" ON "StaffAssignment"("userId", "hotelId");
CREATE INDEX IF NOT EXISTS "StaffAssignment_userId_idx" ON "StaffAssignment"("userId");
CREATE INDEX IF NOT EXISTS "StaffAssignment_hotelId_idx" ON "StaffAssignment"("hotelId");

-- ─── RLS (Row Level Security) ───
-- Enable RLS on all tables (policies can be added later)

ALTER TABLE "Hotel" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Room" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Experience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Guest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StaffAssignment" ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (used by server-side Prisma via service role key)
CREATE POLICY "service_role_all" ON "Hotel" FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON "Room" FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON "Experience" FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON "Guest" FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON "Booking" FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON "StaffAssignment" FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Public read access for hotels, rooms, and experiences (for the public website)
CREATE POLICY "public_read_hotels" ON "Hotel" FOR SELECT TO anon, authenticated USING ("isActive" = true);
CREATE POLICY "public_read_rooms" ON "Room" FOR SELECT TO anon, authenticated USING ("isActive" = true);
CREATE POLICY "public_read_experiences" ON "Experience" FOR SELECT TO anon, authenticated USING ("isActive" = true);
