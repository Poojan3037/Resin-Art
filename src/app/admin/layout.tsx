"use client";

import AdminNavbar from "@/components/admin/AdminNavbar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isLoginPage = pathname === "/admin/login";
    const auth = localStorage.getItem("admin_auth");
    let show = true;

    if (!auth && !isLoginPage) {
      router.replace("/admin/login");
      show = false;
    } else if (auth && isLoginPage) {
      router.replace("/admin/dashboard");
      show = false;
    }

    setChecked(show);
  }, [pathname, router]);

  // Show nothing while resolving auth redirect
  if (!checked) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <span className="text-[14px] tracking-[0.2em] uppercase text-gray">
          Loading…
        </span>
      </div>
    );
  }

  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {!isLoginPage && <AdminNavbar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
