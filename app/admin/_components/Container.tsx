import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-6 md:px-10 lg:px-14", className)}>
      {children}
    </div>
  );
}
