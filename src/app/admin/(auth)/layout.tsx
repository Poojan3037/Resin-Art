import AdminNavbar from "@/components/admin/AdminNavbar";

export default async function AdminAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
