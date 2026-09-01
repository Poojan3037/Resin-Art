"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import Skeleton from "@/components/skeleton/Skeleton";
import UserIcon from "@/components/icons/UserIcon";
import { USER_MENU_LINKS } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { userLogoutAction } from "@/actions/user-auth";

const UserMenu = () => {
  const { user, loading, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close on route change. Adjusted during render (not an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-state-based-on-a-prop-change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleLogout = async () => {
    await userLogoutAction();
    setUser(null);
    setOpen(false);
    router.refresh();
  };

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm">
          Login
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-light-gray bg-white text-charcoal hover:border-gold transition-colors cursor-pointer"
      >
        <UserIcon />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 bg-white border border-light-gray shadow-lg z-55 py-1"
        >
          {USER_MENU_LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[13px] tracking-wide text-charcoal hover:bg-cream transition-colors"
            >
              {link.title}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-[13px] tracking-wide text-charcoal hover:bg-cream transition-colors cursor-pointer border-none bg-none"
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default UserMenu;
