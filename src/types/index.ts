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
  pricePerNight: number | string;
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
  roomTotal: number | string;
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
  cruise: "bg-blue-500/15 text-blue-400",
  gastronomy: "bg-orange-500/15 text-orange-400",
  culture: "bg-purple-500/15 text-purple-400",
  wellness: "bg-green-500/15 text-green-400",
  adventure: "bg-red-500/15 text-red-400",
  nightlife: "bg-indigo-500/15 text-indigo-400",
};

export const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  confirmed: "bg-blue-500/15 text-blue-400",
  checked_in: "bg-green-500/15 text-green-400",
  checked_out: "bg-white/10 text-white/50",
  cancelled: "bg-red-500/15 text-red-400",
  no_show: "bg-red-500/15 text-red-400",
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  checked_out: "Checked Out",
  cancelled: "Cancelled",
  no_show: "No Show",
};
