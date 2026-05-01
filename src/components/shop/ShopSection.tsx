"use client";

import { useState } from "react";
import FadeIn from "../FadeIn";
import { PRODUCTS } from "@/constants/shop";

type Product = {
  name: string;
  price: string;
  img: string;
  tag: string;
};

const ShopSection = () => {
  const [cart, setCart] = useState<Product[]>([]);

  return (
    <div>
      <div className="bg-cream py-14 sm:py-18 px-4 sm:px-8 text-center">
        <span className="text-gold text-[12px] tracking-[0.2em] uppercase">
          Handcrafted with Love
        </span>
        <h1 className="text-[clamp(36px,5vw,72px)] font-semibold text-charcoal mt-3">
          The Art Shop
        </h1>
        <p className="text-gray text-[15px] sm:text-[16px] mt-4 max-w-110 mx-auto">
          Original resin artworks and handcrafted pieces, each one unique
        </p>
      </div>

      <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
        {cart.length > 0 && (
          <div className="bg-tealPale border border-teal py-4 px-6 mb-8 flex justify-between items-center">
            <span className="text-teal text-[15px]">
              🛒 {cart.length} item{cart.length > 1 ? "s" : ""} in cart
            </span>
            <button className="bg-teal text-white border-none px-6 py-2.5 text-[13px] tracking-widest uppercase cursor-pointer font-semibold">
              Checkout via Stripe
            </button>
          </div>
        )}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.08}>
              <div className="cursor-pointer">
                <div className="relative overflow-hidden mb-4 group">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-80 object-cover block transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  {p.tag && (
                    <span className="absolute top-4 left-4 bg-charcoal text-gold-light text-[10px] tracking-[0.14em] uppercase px-3 py-1.5">
                      {p.tag}
                    </span>
                  )}
                  <button
                    onClick={() => setCart((c) => [...c, p])}
                    className="absolute inset-x-0 bottom-0 bg-[rgba(26,39,68,0.9)] text-gold-light border-none py-3 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-[17px] font-medium text-charcoal">
                      {p.name}
                    </div>
                    <div className="text-[16px] text-gold mt-1 font-semibold">
                      {p.price}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopSection;
