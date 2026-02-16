import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export default function Section({ children, className }: SectionProps) {
  return (
    <section className={cn("flex min-h-0 flex-1 flex-col pt-6 pb-12 sm:pt-8 sm:pb-14 md:pt-10 md:pb-24", className)}>
      {children}
    </section>
  );
}
