"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}

export default function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
        </div>
        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
