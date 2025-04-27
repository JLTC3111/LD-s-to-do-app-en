import { useEffect } from "react";
import { gsap } from "gsap";

export function useGsapFadeIn(selector, options = {}) {
  useEffect(() => {
    gsap.from(selector, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out",
      ...options,
    });
  }, [selector]);
}
