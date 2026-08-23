"use client";

import { NAV_LINKS } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import InstagramIcon from "./icons/InstagramIcon";
import FacebookIcon from "./icons/FacebookIcon";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-[rgba(255,255,255,0.7)]">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 sm:pb-12 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
        {/* Brand */}
        <div>
          <Image src="/images/logo-3.png" alt="logo" width={70} height={70} />
          <p className="text-[14px] leading-[1.8] text-[rgba(255,255,255,0.5)] max-w-55 mt-3">
            Calgary&apos;s premier hands-on resin art studio. Creating beauty,
            one pour at a time.
          </p>
          {/* Social Links */}
          <div className="flex items-center gap-3 mt-6">
            <a
              href="https://www.instagram.com/resinbytanvi"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-[rgba(255,255,255,0.5)] hover:text-gold transition-colors duration-200"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.facebook.com/resinbytanvi"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-[rgba(255,255,255,0.5)] hover:text-gold transition-colors duration-200"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-[13px] tracking-[0.18em] uppercase text-gold-light mb-6 font-semibold">
            Quick Links
          </h4>
          {NAV_LINKS.map((link) => (
            <div key={link.path} className="mb-3">
              <Link
                href={link.path}
                className="text-[15px] text-[rgba(255,255,255,0.6)] cursor-pointer transition-colors duration-200 hover:text-gold"
              >
                {link.title}
              </Link>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-[13px] tracking-[0.18em] uppercase text-gold-light mb-6 font-semibold">
            Contact Us
          </h4>
          <ul className="space-y-3 text-[14px] text-[rgba(255,255,255,0.5)] leading-[1.7]">
            <li className="flex items-start gap-2">
              <span>📍</span>
              <span>Calgary &amp; High River, Alberta</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span>
              <a
                href="tel:+14035550192"
                className="hover:text-gold transition-colors duration-200"
              >
                +1 (403) 555-0192
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span>📧</span>
              <a
                href="mailto:hello@resinbytanvi.ca"
                className="hover:text-gold transition-colors duration-200"
              >
                hello@resinbytanvi.ca
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[rgba(255,255,255,0.1)] py-6 px-4 sm:px-8 text-center">
        <span className="text-[13px] text-[rgba(255,255,255,0.35)] tracking-[0.06em]">
          © 2025 Resin Art by Tanvi. All rights reserved. Calgary, High River.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
