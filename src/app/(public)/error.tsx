"use client";

import Button from "@/components/Button";
import { useEffect } from "react";

/**
 * Boundary for every public route. Without it a thrown server component drops
 * a visitor onto the unstyled Next.js error screen, outside the site chrome.
 */
const PublicErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error("[public] route error:", error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 sm:py-28 text-center">
      <span className="block text-[11px] tracking-[0.2em] uppercase text-gold mb-3">
        Something went wrong
      </span>
      <h2 className="text-[30px] sm:text-[36px] text-charcoal font-semibold">
        This page didn&apos;t load
      </h2>
      <p className="text-gray mt-3 max-w-md mx-auto leading-[1.8]">
        It&apos;s not you — something broke on our side. Try again, and if it
        keeps happening, get in touch and we&apos;ll sort it out.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button onClick={reset}>Try again</Button>
        <a
          href="/contact"
          className="inline-flex items-center py-3.5 px-6 text-[14px] border border-light-gray text-charcoal no-underline transition-all duration-300 hover:border-gold hover:text-gold"
        >
          Contact us
        </a>
      </div>
    </div>
  );
};

export default PublicErrorPage;
