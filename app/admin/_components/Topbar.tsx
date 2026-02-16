"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Topbar() {
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    async function fetchPending() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) return;
        const data = await res.json();
        setPendingCount(data.pendingInquiries ?? 0);
      } catch {
        // ignore
      }
    }
    fetchPending();
  }, []);

  return (
    <header className="flex h-16 items-center justify-end gap-4 border-b border-neutral-200 bg-white px-6">
      <Link
        href="/admin/inquiries?status=pending"
        className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-all duration-200 ease-out hover:scale-105 hover:border-neutral-300 hover:shadow-md hover:text-neutral-700"
        aria-label={`미처리 문의 ${pendingCount}건`}
      >
        <MessageCircle className="h-4 w-4" />
        {pendingCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-medium text-white">
            {pendingCount > 99 ? "99+" : pendingCount}
          </span>
        )}
      </Link>
    </header>
  );
}
