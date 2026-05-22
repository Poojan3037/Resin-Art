import AdminNavbar from "@/components/admin/AdminNavbar";
import { Toaster } from "sonner";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <AdminNavbar />
      <main className="flex-1">{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
