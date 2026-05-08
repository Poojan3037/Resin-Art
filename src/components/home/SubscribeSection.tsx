"use client";

import { useState } from "react";
import FadeIn from "../FadeIn";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  return (
    <section className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blush-light text-center">
      <div className="max-w-180 mx-auto">
        <FadeIn>
          <span className="text-[12px] tracking-[0.2em] uppercase  text-gold-dark">
            Stay in the Loop
          </span>
          <h2 className=" text-[clamp(30px,3.5vw,46px)] font-semibold text-charcoal mt-3 mb-6">
            Join The Resin By Tanvi Community
          </h2>
          <ul className="text-gray text-[15px] leading-[1.8] mb-9 inline-flex flex-col items-start gap-2 text-left">
            <li>🎟️ Early workshop access</li>
            <li>🎨 Resin art inspiration &amp; tips</li>
            <li>💸 Exclusive discounts</li>
            <li>📍 Calgary &amp; High River event updates</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-0 max-w-110 mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3 text-[15px] bg-white text-charcoal outline-none border border-light-gray sm:border-r-0"
            />
            <button className="bg-charcoal text-gold-light border-none px-7 py-3 text-[14px] tracking-widest uppercase cursor-pointer font-extrabold whitespace-nowrap hover:bg-gold hover:text-white">
              Notify Me
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default SubscribeSection;
