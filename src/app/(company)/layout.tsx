import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { CompanyTabBar } from "@/components/public/CompanyTabBar";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-pv-black">
      <Navbar />
      {/* Tab bar positioned below the main navbar */}
      <div className="fixed top-[56px] z-40 w-full bg-[rgba(10,10,10,0.92)] backdrop-blur-[24px] border-b border-white/[0.06]">
        <CompanyTabBar />
      </div>
      <main className="flex-1 pt-[100px]">{children}</main>
      <Footer />
    </div>
  );
}
