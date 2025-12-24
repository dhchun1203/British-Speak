"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "fade" | "up" | "down" | "left" | "right";
}

export default function ScrollAnimation({
  children,
  className = "",
  delay = 0,
  direction = "fade",
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const directionClasses = {
    fade: isVisible ? "opacity-100" : "opacity-0",
    up: isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
    down: isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8",
    left: isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
    right: isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${directionClasses[direction]} ${className}`}
    >
      {children}
    </div>
  );
}


