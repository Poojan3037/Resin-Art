import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScrollProvider>
      <Navbar />
      {children}
      <Footer />
    </SmoothScrollProvider>
  );
}
