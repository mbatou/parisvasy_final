import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/" className="font-serif text-3xl text-vermillion">
          PARISVASY
        </Link>
        <p className="mt-2 text-sm text-ink-300">
          Book a room, live an experience
        </p>
      </div>
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
