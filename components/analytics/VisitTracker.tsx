"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISIT_KEY = "visit_recorded";

function getDeviceType(): "desktop" | "mobile" | "tablet" | "unknown" {
  if (typeof navigator === "undefined" || !navigator.userAgent) return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;
    if (pathname.startsWith("/admin")) return;
    if (sessionStorage.getItem(VISIT_KEY)) return;

    const device = getDeviceType();
    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device }),
      keepalive: true,
    })
      .then(() => sessionStorage.setItem(VISIT_KEY, "1"))
      .catch(() => {});
  }, [pathname]);

  return null;
}
