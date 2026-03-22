import type { Decimal } from "@prisma/client/runtime/library";

export type UserRole =
  | "super_admin"
  | "hotel_manager"
  | "finance_manager"
  | "front_desk"
  | "customer";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "no_show";

export type ExperienceCategory =
  | "cruise"
  | "gastronomy"
  | "culture"
  | "wellness"
  | "adventure"
  | "nightlife";

export type RoomType = "classic" | "superior" | "deluxe" | "suite" | "penthouse";

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  description: string | null;
  stars: number;
  coverImage: string | null;
  images: string[];
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  rooms?: Room[];
  experiences?: Experience[];
  bookings?: Booking[];
  staff?: StaffAssignment[];
  _count?: {
    rooms: number;
    experiences: number;
    bookings: number;
  };
}

export interface Room {
  id: string;
  hotelId: string;
  hotel?: Hotel;
  name: string;
  type: RoomType;
  description: string | null;
  size: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
  pricePerNight: Decimal | number | string;
  totalRooms: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  bookings?: Booking[];
}

export interface Experience {
  id: string;
  hotelId: string;
  hotel?: Hotel;
  title: string;
  slug: string;
  category: ExperienceCategory;
  description: string | null;
  location: string;
  duration: string;
  maxGroup: number;
  inclusions: string[];
  images: string[];
  coverImage: string | null;
  isFlash: boolean;
  flashStart: Date | null;
  flashEnd: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  bookings?: Booking[];
}

export interface Booking {
  id: string;
  reference: string;
  hotelId: string;
  hotel?: Hotel;
  roomId: string;
  room?: Room;
  experienceId: string;
  experience?: Experience;
  guestId: string;
  guest?: Guest;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guestCount: number;
  roomTotal: Decimal | number | string;
  status: BookingStatus;
  stripeSetupIntentId: string | null;
  stripePaymentMethodId: string | null;
  cardLast4: string | null;
  cardBrand: string | null;
  warrantyCollected: boolean;
  checkedInAt: Date | null;
  checkedInBy: string | null;
  checkedOutAt: Date | null;
  checkedOutBy: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guest {
  id: string;
  authUserId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  nationality: string | null;
  idNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  bookings?: Booking[];
}

export interface StaffAssignment {
  id: string;
  userId: string;
  hotelId: string;
  hotel?: Hotel;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

export interface BookingFormData {
  experienceId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const CATEGORY_LABELS: Record<ExperienceCategory, string> = {
  cruise: "Cruises",
  gastronomy: "Gastronomy",
  culture: "Culture",
  wellness: "Wellness",
  adventure: "Adventure",
  nightlife: "Nightlife",
};

export const CATEGORY_COLORS: Record<ExperienceCategory, string> = {
  cruise: "bg-blue-100 text-blue-800",
  gastronomy: "bg-orange-100 text-orange-800",
  culture: "bg-purple-100 text-purple-800",
  wellness: "bg-green-100 text-green-800",
  adventure: "bg-red-100 text-red-800",
  nightlife: "bg-indigo-100 text-indigo-800",
};

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  checked_in: "bg-green-100 text-green-800",
  checked_out: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-red-100 text-red-800",
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
  no_show: "No Show",
};
