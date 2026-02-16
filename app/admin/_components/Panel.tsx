import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export default function Panel({ children, className }: PanelProps) {
  return (
    <div className={cn("rounded-2xl border border-neutral-200 bg-white shadow-sm", className)}>
      {children}
    </div>
  );
}
