"use client";

import { useEffect, useState } from "react";
import HeroSectionWorkshopCard from "./HeroSectionWorkshopCard";
import { motion } from "framer-motion";
import { Workshop } from "@/types/workshop";

type PropsType = {
  data: Workshop[];
};

const WorkshopCardCarousel = ({ data }: PropsType) => {
  const [{ active, previousActive }, setCarousel] = useState({
    active: 0,
    previousActive: 0,
  });
  const total = data.length;

  const setActiveCard = (nextActive: number) => {
    setCarousel((current) => {
      if (current.active === nextActive) {
        return current;
      }

      return {
        active: nextActive,
        previousActive: current.active,
      };
    });
  };

  /* Auto-advance every 3.8 s */
  useEffect(() => {
    const id = setInterval(() => {
      setCarousel((current) => ({
        active: (current.active + 1) % total,
        previousActive: current.active,
      }));
    }, 3800);

    return () => clearInterval(id);
  }, [total]);

  return (
    <div className="shrink-0 w-full lg:w-136 flex flex-col items-center">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6 self-start lg:self-center">
        <div className="h-px w-8 bg-gold-light" />
        <span className="text-[11px] tracking-widest uppercase text-gold-light">
          Upcoming Workshops
        </span>
      </div>

      {/* 3-D carousel viewport */}
      <div
        className="relative w-full h-120"
        style={{ perspective: "1100px", perspectiveOrigin: "50% 35%" }}
      >
        {data.map((workshop, index) => {
          const rawOffset = (index - active + total) % total;
          const previousRawOffset = (index - previousActive + total) % total;

          return (
            <HeroSectionWorkshopCard
              key={workshop.title}
              workshop={workshop}
              rawOffset={rawOffset}
              previousRawOffset={previousRawOffset}
              total={total}
              accentIdx={index}
              onClick={() => {
                if (rawOffset !== 0) setActiveCard(index);
              }}
            />
          );
        })}
      </div>

      {/* Dot indicators + manual nav */}
      <div className="flex items-center gap-3 mt-6">
        {data.map((w, i) => (
          <motion.button
            key={w.title}
            onClick={() => setActiveCard(i)}
            animate={{
              width: i === active ? 20 : 8,
              opacity: i === active ? 1 : 0.35,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="h-2 rounded-full bg-gold"
          />
        ))}
      </div>

      <p className="mt-3 text-[10px] tracking-widest uppercase text-white/30">
        Click a card to focus · auto-advances
      </p>
    </div>
  );
};

export default WorkshopCardCarousel;
