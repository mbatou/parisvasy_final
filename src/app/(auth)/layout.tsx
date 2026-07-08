import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
          className="font-sans text-[15px] font-semibold tracking-[4px] text-gold transition-colors hover:text-gold-light"
        >
          PARISVASY
        </Link>
        <p className="mt-3 text-sm text-white/40 font-light">
          Staff portal &mdash; Back-office access
        </p>
      </div>
      <div className="w-full max-w-md bg-pv-black-80 border border-white/[0.06] p-8">
        {children}
      </div>
      <Link
        href="/"
        className="mt-6 flex items-center gap-1.5 text-sm text-white/40 font-light transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Return to website
      </Link>
    </div>
  );
}
