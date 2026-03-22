import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-pv-black px-4 py-12">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="font-sans text-[15px] font-semibold tracking-[4px] text-gold"
        >
          PARISVASY
        </Link>
        <p className="mt-3 text-sm text-white/40 font-light">
          Book a room, live an experience
        </p>
      </div>
      <div className="w-full max-w-md bg-pv-black-80 border border-white/[0.06] p-8">
        {children}
      </div>
    </div>
  );
}
