"use client";

import React, { useState } from "react";
import FadeIn from "../FadeIn";
import { INQUIRY_DATA, WORKSHOPS_DATA } from "@/constants/workshops";

type Workshop = (typeof WORKSHOPS_DATA)[number];

interface Form {
  name: string;
  email: string;
  phone: string;
  seats: number;
}

const WorkshopsSection = () => {
  const [selected, setSelected] = useState<Workshop | null>(null);
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    phone: "",
    seats: 1,
  });

  return (
    <div>
      {/* Header */}
      <div className="bg-charcoal py-14 sm:py-18 px-4 sm:px-8 text-center">
        <span className="text-[12px] tracking-[0.2em] uppercase text-gold">
          Upcoming Sessions
        </span>
        <h1 className="text-[clamp(36px,5vw,72px)] font-semibold text-white mt-3">
          Workshops &amp; Booking
        </h1>
      </div>

      <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
        {/* Workshop cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 sm:mb-20">
          {WORKSHOPS_DATA.map((w, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="border  border-light-gray bg-white p-8 transition-all hover:border-gold h-full">
                <div className="flex justify-between items-center mb-5">
                  <span
                    className={
                      w.seats <= 3
                        ? "bg-amber-100 text-amber-700 text-[11px] px-3 py-1 uppercase tracking-widest  font-semibold"
                        : "bg-teal-50 text-teal text-[11px] px-3 py-1 uppercase tracking-widest  font-semibold"
                    }
                  >
                    {w.seats} seats left
                  </span>
                  <span className="text-gold text-[24px] font-extrabold">
                    {w.price}
                  </span>
                </div>
                <h3 className=" text-[22px] font-semibold text-charcoal mb-4 leading-[1.3]">
                  {w.title}
                </h3>
                <div className="flex flex-col gap-2 mb-7">
                  {[
                    ["📅", w.date],
                    ["🕐", w.time],
                    ["📍", w.location],
                  ].map(([ic, val]) => (
                    <div key={val} className="flex gap-2.5 items-center">
                      <span className="text-[13px]">{ic}</span>
                      <span className="text-[14px] text-gray ">{val}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelected(w)}
                  className="w-full bg-charcoal text-gold-light border-none py-3.5  text-[14px] tracking-[0.12em] uppercase cursor-pointer font-extrabold hover:bg-gold hover:text-white"
                >
                  Book Now
                </button>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Booking modal */}
        {selected && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white max-w-120 w-full p-8 sm:p-12 sm:px-10 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-5 right-6 bg-none border-none text-[24px] cursor-pointer text-gray"
              >
                ×
              </button>
              <h3 className=" text-[28px] font-semibold text-charcoal mb-2">
                Reserve Your Seat
              </h3>
              <p className="text-gold text-[14px] mb-8 ">
                {selected.title} — {selected.date}
              </p>
              {(() => {
                type InputKey = Exclude<keyof Form, "seats">;
                const inputFields: [string, InputKey, string][] = [
                  ["Full Name", "name", "text"],
                  ["Email Address", "email", "email"],
                  ["Phone Number", "phone", "tel"],
                ];

                return inputFields.map(([label, field, type]) => (
                  <div key={field} className="mb-5">
                    <label className="block text-[12px] tracking-widest uppercase text-gray mb-2 ">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={form[field]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setForm((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-light-gray text-[15px]  outline-none box-border"
                    />
                  </div>
                ));
              })()}
              <div className="mb-7">
                <label className="block text-[12px] tracking-widest uppercase text-gray mb-2 ">
                  Number of Seats
                </label>
                <select
                  value={form.seats}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      seats: Number(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-3 border border-light-gray text-[15px]  outline-none bg-white"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} seat{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <button className="w-full bg-gold text-white border-none py-4  text-[16px] tracking-[0.12em] uppercase cursor-pointer font-extrabold hover:bg-charcoal hover:text-gold-light">
                Proceed to Payment — {selected.price}
              </button>
              <p className="text-center text-gray text-[12px] mt-4 ">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        )}

        {/* Inquiry sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
          {INQUIRY_DATA.map((item, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="bg-cream p-12 border border-light-gray h-full">
                <span className="text-[11px] tracking-[0.18em] uppercase  text-gold">
                  {item.tag}
                </span>
                <h3 className=" text-[28px] font-semibold text-charcoal mt-3 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray leading-[1.8] text-[15px] mb-7 ">
                  {item.desc}
                </p>
                <button className="border border-charcoal bg-transparent px-7 py-3  text-[13px] tracking-[0.12em] uppercase cursor-pointer font-semibold hover:bg-charcoal hover:text-gold-light">
                  Send Inquiry
                </button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkshopsSection;
