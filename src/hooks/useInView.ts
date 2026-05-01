"use client";

import { useEffect, useState } from "react";

type PropsType = React.RefObject<HTMLElement | null>;

const useInView = (ref: PropsType) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (ref?.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);

  return visible;
};

export default useInView;
