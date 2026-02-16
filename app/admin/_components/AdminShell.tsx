"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex min-h-0 flex-1 flex-col overflow-auto p-6 pb-10">{children}</main>
      </div>
    </div>
  );
}
