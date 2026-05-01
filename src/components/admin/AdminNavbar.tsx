"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const ADMIN_NAV_LINKS = [
  { title: "Dashboard", path: "/admin/dashboard" },
  { title: "Products", path: "/admin/products" },
  { title: "Orders", path: "/admin/orders" },
  { title: "Workshops", path: "/admin/workshops" },
];

const AdminNavbar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-charcoal shadow-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link
          href="/admin/dashboard"
          className="cursor-pointer flex flex-col leading-[1.1]"
        >
          <Image src="/images/logo-4.png" alt="logo" width={50} height={50} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {ADMIN_NAV_LINKS.map((link) => (
            <Link
              href={link.path}
              key={link.path}
              className={clsx(
                "text-[13px] tracking-widest uppercase cursor-pointer pb-0.5 transition-all duration-200 font-medium border-b",
                pathName === link.path
                  ? "text-gold border-gold"
                  : "text-gold-light/70 border-transparent hover:text-gold hover:border-gold/50",
              )}
            >
              {link.title}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="bg-transparent text-gold-light border border-gold/40 px-5 py-2 text-[13px] tracking-[0.12em] uppercase cursor-pointer font-semibold hover:bg-gold hover:text-charcoal hover:border-gold transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 cursor-pointer"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle admin menu"
        >
          <span
            className={clsx(
              "block w-6 h-0.5 bg-gold-light transition-transform duration-300",
              menuOpen && "translate-y-2 rotate-45",
            )}
          />
          <span
            className={clsx(
              "block w-6 h-0.5 bg-gold-light transition-opacity duration-300",
              menuOpen && "opacity-0",
            )}
          />
          <span
            className={clsx(
              "block w-6 h-0.5 bg-gold-light transition-transform duration-300",
              menuOpen && "-translate-y-2 -rotate-45",
            )}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "lg:hidden overflow-hidden transition-all duration-300",
          menuOpen ? "max-h-96 border-t border-white/10" : "max-h-0",
        )}
      >
        <div className="flex flex-col px-4 sm:px-6 py-4 gap-1 bg-charcoal">
          {ADMIN_NAV_LINKS.map((link) => (
            <Link
              href={link.path}
              key={link.path}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "text-[13px] tracking-widest uppercase cursor-pointer py-3 px-2 border-b border-white/10 font-medium transition-colors duration-200",
                pathName === link.path
                  ? "text-gold"
                  : "text-gold-light/70 hover:text-gold",
              )}
            >
              {link.title}
            </Link>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="mt-3 w-full bg-transparent text-gold-light border border-gold/40 py-3 text-[13px] tracking-[0.12em] uppercase cursor-pointer font-semibold hover:bg-gold hover:text-charcoal hover:border-gold transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
