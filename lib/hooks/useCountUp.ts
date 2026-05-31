"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, duration: number = 500): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setCurrent(target);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return current;
}
