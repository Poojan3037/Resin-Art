"use client";
import { useEffect, useState } from "react";

const useScrollY = () => {
  const [y, setY] = useState(0);

  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return y;
};

export default useScrollY;
