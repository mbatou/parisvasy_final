import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Hotel
  const hotel = await prisma.hotel.upsert({
    where: { slug: "maison-etoile" },
    update: {},
    create: {
      name: "Maison Étoile",
      slug: "maison-etoile",
      address: "12 Rue de Rivoli",
      city: "Paris",
      country: "France",
      description:
        "A charming 4-star boutique hotel in the heart of Paris, steps from the Louvre and the Seine. Maison Étoile blends classic Parisian elegance with modern comfort, offering guests an unforgettable stay enriched with curated local experiences.",
      stars: 4,
      coverImage: "/images/hotel-cover.jpg",
      images: [
        "/images/hotel-1.jpg",
        "/images/hotel-2.jpg",
        "/images/hotel-3.jpg",
      ],
      phone: "+33 1 42 60 00 00",
      email: "bonjour@maison-etoile.fr",
      isActive: true,
    },
  });

  console.log(`✅ Hotel created: ${hotel.name}`);

  // Create Rooms
  const rooms = await Promise.all([
    prisma.room.upsert({
      where: { id: "room-classic" },
      update: {},
      create: {
        id: "room-classic",
        hotelId: hotel.id,
        name: "Classic",
        type: "classic",
        description:
          "A cozy room with city views, perfect for a romantic Parisian getaway. Features elegant décor, a plush queen bed, and all modern amenities.",
        size: 25,
        maxGuests: 2,
        amenities: ["wifi", "minibar", "air_conditioning", "safe", "city_view"],
        images: ["/images/room-classic-1.jpg", "/images/room-classic-2.jpg"],
        pricePerNight: 149,
        totalRooms: 8,
        isActive: true,
      },
    }),
    prisma.room.upsert({
      where: { id: "room-superior" },
      update: {},
      create: {
        id: "room-superior",
        hotelId: hotel.id,
        name: "Superior",
        type: "superior",
        description:
          "A spacious room with a private balcony overlooking Parisian rooftops. Enjoy premium bedding, a sitting area, and curated minibar selections.",
        size: 32,
        maxGuests: 2,
        amenities: [
          "wifi",
          "minibar",
          "air_conditioning",
          "safe",
          "balcony",
          "bathtub",
          "nespresso",
        ],
        images: [
          "/images/room-superior-1.jpg",
          "/images/room-superior-2.jpg",
        ],
        pricePerNight: 189,
        totalRooms: 5,
        isActive: true,
      },
    }),
    prisma.room.upsert({
      where: { id: "room-suite" },
      update: {},
      create: {
        id: "room-suite",
        hotelId: hotel.id,
        name: "Suite Eiffel",
        type: "suite",
        description:
          "Our signature suite with breathtaking Eiffel Tower views. Features a separate living area, king bed, luxury bathroom with rain shower and freestanding tub, and a private terrace.",
        size: 45,
        maxGuests: 3,
        amenities: [
          "wifi",
          "minibar",
          "air_conditioning",
          "safe",
          "eiffel_view",
          "balcony",
          "bathtub",
          "rain_shower",
          "nespresso",
          "living_area",
        ],
        images: ["/images/room-suite-1.jpg", "/images/room-suite-2.jpg"],
        pricePerNight: 289,
        totalRooms: 3,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${rooms.length} rooms created`);

  // Create Experiences
  const experiences = await Promise.all([
    prisma.experience.upsert({
      where: { slug: "sunset-seine-cruise" },
      update: {},
      create: {
        hotelId: hotel.id,
        title: "Sunset Seine Cruise",
        slug: "sunset-seine-cruise",
        category: "cruise",
        description:
          "Glide along the Seine as the sun sets over Paris, passing illuminated landmarks from Notre-Dame to the Eiffel Tower. Enjoy champagne and live acoustic music aboard a private boat, creating memories that will last a lifetime.",
        location: "Port de la Bourdonnais",
        duration: "2h",
        maxGroup: 12,
        inclusions: [
          "Champagne toast",
          "Live acoustic music",
          "Expert commentary",
          "Blankets provided",
        ],
        images: ["/images/exp-cruise-1.jpg", "/images/exp-cruise-2.jpg"],
        coverImage: "/images/exp-cruise-cover.jpg",
        isFlash: false,
        isActive: true,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "montmartre-wine-cheese" },
      update: {},
      create: {
        hotelId: hotel.id,
        title: "Montmartre Wine & Cheese",
        slug: "montmartre-wine-cheese",
        category: "gastronomy",
        description:
          "Discover the hidden gems of Montmartre with a local sommelier. Visit artisan fromageries, taste five exceptional French wines paired with handpicked cheeses, and learn the art of French dégustation in one of Paris's most charming neighbourhoods.",
        location: "Rue Lepic, Montmartre",
        duration: "3h",
        maxGroup: 8,
        inclusions: [
          "5 wine tastings",
          "Artisan cheese selection",
          "Expert sommelier guide",
          "Montmartre walking tour",
        ],
        images: [
          "/images/exp-gastronomy-1.jpg",
          "/images/exp-gastronomy-2.jpg",
        ],
        coverImage: "/images/exp-gastronomy-cover.jpg",
        isFlash: false,
        isActive: true,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "private-louvre-guided-tour" },
      update: {},
      create: {
        hotelId: hotel.id,
        title: "Private Louvre Guided Tour",
        slug: "private-louvre-guided-tour",
        category: "culture",
        description:
          "Skip the queues and explore the world's greatest museum with an expert art historian. From the Mona Lisa to the Venus de Milo, discover masterpieces and hidden corners most visitors never see.",
        location: "Musée du Louvre",
        duration: "2.5h",
        maxGroup: 6,
        inclusions: [
          "Skip-the-line entry",
          "Expert art historian guide",
          "Personal audio headset",
          "Museum map & guide book",
        ],
        images: ["/images/exp-culture-1.jpg", "/images/exp-culture-2.jpg"],
        coverImage: "/images/exp-culture-cover.jpg",
        isFlash: false,
        isActive: true,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "hammam-spa-ritual" },
      update: {},
      create: {
        hotelId: hotel.id,
        title: "Hammam & Spa Ritual",
        slug: "hammam-spa-ritual",
        category: "wellness",
        description:
          "Escape into a world of relaxation at an authentic Moroccan hammam in Le Marais. Enjoy a traditional steam bath, followed by a rejuvenating 30-minute massage with essential oils, finished with refreshing mint tea.",
        location: "Le Marais, Paris",
        duration: "1.5h",
        maxGroup: 4,
        inclusions: [
          "Traditional steam bath",
          "30-minute full body massage",
          "Refreshing mint tea",
          "Organic skincare products",
        ],
        images: ["/images/exp-wellness-1.jpg", "/images/exp-wellness-2.jpg"],
        coverImage: "/images/exp-wellness-cover.jpg",
        isFlash: false,
        isActive: true,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "midnight-eiffel-picnic" },
      update: {},
      create: {
        hotelId: hotel.id,
        title: "Midnight Eiffel Picnic",
        slug: "midnight-eiffel-picnic",
        category: "culture",
        description:
          "Watch the Eiffel Tower sparkle at midnight from the best spot on the Champ de Mars. A gourmet picnic basket, fine champagne, and cozy blankets await you under the Parisian stars. A truly magical experience.",
        location: "Champ de Mars",
        duration: "2h",
        maxGroup: 10,
        inclusions: [
          "Gourmet picnic basket",
          "Cozy blankets & cushions",
          "Bottle of champagne",
          "Macarons from Ladurée",
        ],
        images: ["/images/exp-picnic-1.jpg", "/images/exp-picnic-2.jpg"],
        coverImage: "/images/exp-picnic-cover.jpg",
        isFlash: true,
        flashStart: new Date("2026-03-15"),
        flashEnd: new Date("2026-04-30"),
        isActive: true,
      },
    }),
    prisma.experience.upsert({
      where: { slug: "left-bank-cooking-class" },
      update: {},
      create: {
        hotelId: hotel.id,
        title: "Left Bank Cooking Class",
        slug: "left-bank-cooking-class",
        category: "gastronomy",
        description:
          "Learn to cook classic French dishes from a Michelin-trained chef in a beautiful Saint-Germain kitchen. From croissants to coq au vin, master the techniques that make French cuisine legendary. Take home your recipes and skills.",
        location: "Saint-Germain-des-Prés",
        duration: "3h",
        maxGroup: 8,
        inclusions: [
          "Professional chef instruction",
          "All ingredients provided",
          "Recipe book to take home",
          "Glass of wine during class",
        ],
        images: ["/images/exp-cooking-1.jpg", "/images/exp-cooking-2.jpg"],
        coverImage: "/images/exp-cooking-cover.jpg",
        isFlash: false,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ ${experiences.length} experiences created`);

  // Create a default super admin guest record
  const adminGuest = await prisma.guest.upsert({
    where: { email: "admin@parisvasy.com" },
    update: {},
    create: {
      email: "admin@parisvasy.com",
      firstName: "Admin",
      lastName: "PARISVASY",
      phone: "+33 1 00 00 00 00",
    },
  });

  console.log(`✅ Admin guest created: ${adminGuest.email}`);

  // Create sample bookings
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const sampleGuest = await prisma.guest.upsert({
    where: { email: "jean.dupont@example.com" },
    update: {},
    create: {
      email: "jean.dupont@example.com",
      firstName: "Jean",
      lastName: "Dupont",
      phone: "+33 6 12 34 56 78",
      nationality: "French",
    },
  });

  const sampleGuest2 = await prisma.guest.upsert({
    where: { email: "emily.smith@example.com" },
    update: {},
    create: {
      email: "emily.smith@example.com",
      firstName: "Emily",
      lastName: "Smith",
      phone: "+44 7700 900000",
      nationality: "British",
    },
  });

  await prisma.booking.upsert({
    where: { reference: "PVS-2026-4821" },
    update: {},
    create: {
      reference: "PVS-2026-4821",
      hotelId: hotel.id,
      roomId: rooms[1].id,
      experienceId: experiences[0].id,
      guestId: sampleGuest.id,
      checkIn: today,
      checkOut: dayAfter,
      nights: 2,
      guestCount: 2,
      roomTotal: 378,
      status: "confirmed",
      warrantyCollected: true,
      cardLast4: "4242",
      cardBrand: "visa",
    },
  });

  await prisma.booking.upsert({
    where: { reference: "PVS-2026-3195" },
    update: {},
    create: {
      reference: "PVS-2026-3195",
      hotelId: hotel.id,
      roomId: rooms[2].id,
      experienceId: experiences[2].id,
      guestId: sampleGuest2.id,
      checkIn: tomorrow,
      checkOut: new Date(tomorrow.getTime() + 3 * 24 * 60 * 60 * 1000),
      nights: 3,
      guestCount: 2,
      roomTotal: 867,
      status: "pending",
      warrantyCollected: false,
    },
  });

  console.log("✅ Sample bookings created");
  console.log("\n🎉 Seed completed successfully!");
  console.log("\nDefault admin email: admin@parisvasy.com");
  console.log(
    "Note: Create this user in Supabase Auth, then add a StaffAssignment with role super_admin"
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
