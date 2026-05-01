"use client";

import useInView from "@/hooks/useInView";
import { useRef } from "react";
import clsx from "clsx";

type PropsType = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

const FadeIn = ({ children, delay = 0, className }: PropsType) => {
  const ref = useRef(null);
  const visible = useInView(ref);

  const classes = clsx(
    className,
    "transition-opacity transition-transform duration-700 ease-in-out",
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7",
  );

  return (
    <div ref={ref} className={classes} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
};

export default FadeIn;
