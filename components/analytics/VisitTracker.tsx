"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISIT_KEY = "visit_recorded";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;
    if (pathname.startsWith("/admin")) return;
    if (sessionStorage.getItem(VISIT_KEY)) return;

    fetch("/api/analytics/visit", { method: "POST", keepalive: true })
      .then(() => sessionStorage.setItem(VISIT_KEY, "1"))
      .catch(() => {});
  }, [pathname]);

  return null;
}
