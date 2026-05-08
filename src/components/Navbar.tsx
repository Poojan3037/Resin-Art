"use client";

import { NAV_LINKS } from "@/constants/routes";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathName = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-xl border-b border-light-gray">
      <div className="hidden sm:block  bg-charcoal text-gold-light text-center text-[11px] sm:text-[12px] tracking-widest-[0.12em] py-2 px-4">
        ✦ Hands-on Resin Art Workshops in Calgary, Alberta ✦
      </div>

      <div className=" sm:hidden bg-charcoal text-gold-light flex items-center justify-between  py-2 px-4">
        <span className="text-[11px] sm:text-[12px] tracking-widest-[0.12em]">
          ✦ Workshops Available ✦
        </span>
        <Link href="/workshops">
          <button className="bg-gold text-charcoal px-2 py-1 border-none text-[14px] tracking-widest-[0.12em] uppercase cursor-pointer font-semibold hover:bg-charcoal hover:text-white">
            Book Your Seat
          </button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
        {/* Logo */}

        <Link href="/">
          <Image src="/images/logo.png" alt="logo" width={50} height={50} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <Link
              href={link.path}
              key={link.path}
              className={clsx(
                "text-[15px] tracking-widest uppercase cursor-pointer pb-0.5 transition-all duration-200 font-medium hover:text-gold border-b border-transparent",
                pathName === link.path
                  ? "text-gold border-gold"
                  : "text-charcoal",
              )}
            >
              {link.title}
            </Link>
          ))}
          <Link href="/workshops">
            <button className="bg-charcoal text-gold-light px-5 py-2.5 border-none text-[14px] tracking-widest-[0.12em] uppercase cursor-pointer font-semibold hover:bg-gold hover:text-white">
              Book Your Seat
            </button>
          </Link>
        </div>

        {/* Hamburger button */}
        <div className="lg:hidden flex justify-center items-center gap-2">
          <button
            className=" flex flex-col justify-center items-center w-9 h-9 gap-1.5 cursor-pointer"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span
              className={clsx(
                "block w-6 h-0.5 bg-charcoal transition-transform duration-300",
                menuOpen && "translate-y-2 rotate-45",
              )}
            />
            <span
              className={clsx(
                "block w-6 h-0.5 bg-charcoal transition-opacity duration-300",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={clsx(
                "block w-6 h-0.5 bg-charcoal transition-transform duration-300",
                menuOpen && "-translate-y-2 -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "lg:hidden overflow-hidden transition-all duration-300",
          menuOpen ? "max-h-125 border-t border-light-gray" : "max-h-0",
        )}
      >
        <div className="flex flex-col px-4 sm:px-6 py-4 gap-1 bg-white">
          {NAV_LINKS.map((link) => (
            <Link
              href={link.path}
              key={link.path}
              onClick={() => setMenuOpen(false)}
              className={clsx(
                "text-[14px] tracking-widest uppercase cursor-pointer py-3 px-2 border-b border-light-gray font-medium transition-colors duration-200 hover:text-gold last:border-0",
                pathName === link.path ? "text-gold" : "text-charcoal",
              )}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
