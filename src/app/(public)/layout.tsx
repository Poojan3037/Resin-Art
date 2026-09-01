import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { AuthProvider } from "@/context/AuthContext";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <SmoothScrollProvider>
        <Navbar />
        <div className="overflow-x-clip flex-1 flex flex-col">
          {children}
          <Footer />
        </div>
      </SmoothScrollProvider>
    </AuthProvider>
  );
}
