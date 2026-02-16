import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** 상단에 표시할 뒤로가기 등 네비게이션 (제목 위 한 줄) */
  back?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({ title, description, back, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {back ? (
        <div className="flex items-center border-b border-neutral-100 pb-3">
          {back}
        </div>
      ) : null}
      <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between")}>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
          {description ? (
            <p className="text-sm text-neutral-500">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
