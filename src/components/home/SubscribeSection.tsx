"use client";

import { useState } from "react";
import FadeIn from "../FadeIn";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  return (
    <section className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blush-light text-center">
      <div className="max-w-140 mx-auto">
        <FadeIn>
          <span className="text-[12px] tracking-[0.2em] uppercase  text-gold-dark">
            Stay in the Loop
          </span>
          <h2 className=" text-[clamp(30px,3.5vw,46px)] font-semibold text-charcoal mt-3 mb-4">
            Subscribe for Exclusive Updates
          </h2>
          <p className="text-gray text-[15px] leading-[1.8] mb-9 ">
            Get Early Access to Resin Workshops — Join our community and be the
            first to hear about new workshop dates, limited seats, and creative
            events.
          </p>
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
