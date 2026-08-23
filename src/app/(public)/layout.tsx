import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <div className="overflow-x-clip flex-1 flex flex-col">
        {children}
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
