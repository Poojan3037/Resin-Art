"use client";

import { NAV_LINKS } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-charcoal text-[rgba(255,255,255,0.7)] pt-12 sm:pt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
        {/* Brand */}
        <div>
          <Image src="/images/logo-3.png" alt="logo" width={70} height={70} />

          <p className="text-[14px] leading-[1.8] text-[rgba(255,255,255,0.5)]  max-w-55">
            Calgary&apos;s premier hands-on resin art studio. Creating beauty,
            one pour at a time.
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-gold text-[13px] no-underline  tracking-widest"
          >
            📸 @resinartbytanvi
          </a>
        </div>

        {/* Quick links */}
        <div>
          <h4 className=" text-[13px] tracking-widest-[0.18em] uppercase text-gold-light mb-6 font-semibold">
            Quick Links
          </h4>
          {NAV_LINKS.map((link) => (
            <div key={link.path} className="mb-3">
              <Link
                href={link.path}
                className=" text-[15px] text-[rgba(255,255,255,0.6)] cursor-pointer transition-colors duration-200 hover:text-gold"
              >
                {link.title}
              </Link>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div>
          <h4 className=" text-[13px] tracking-widest-[0.18em] uppercase text-gold-light mb-6 font-semibold">
            Stay Connected
          </h4>
          <p className="text-[14px] leading-[1.7] text-[rgba(255,255,255,0.5)]  mb-5">
            Get workshop updates and creative inspiration.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.15)] border-r-0 text-white text-[14px]  outline-none"
            />
            <button className="bg-gold border-none px-4 py-2 text-white cursor-pointer text-[12px]  tracking-widest uppercase font-extrabold hover:bg-gold-dark">
              Go
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-[rgba(255,255,255,0.1)] py-6 px-4 sm:px-8 text-center">
        <span className="text-[13px] text-[rgba(255,255,255,0.35)]  tracking-widest-[0.06em]">
          © 2025 Resin Art by Tanvi. All rights reserved. Calgary, Alberta.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
