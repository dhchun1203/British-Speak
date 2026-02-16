"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Image, Megaphone, MessageSquare, LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/gallery", label: "갤러리 관리", icon: Image },
  { href: "/admin/notices", label: "공지사항 관리", icon: Megaphone },
  { href: "/admin/inquiries", label: "문의 관리", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAdminAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <aside className="flex h-full w-[260px] flex-shrink-0 flex-col bg-neutral-900 text-neutral-200">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-white">
          BS
        </div>
        <div>
          <p className="text-sm font-semibold text-white">British Speak</p>
          <p className="text-xs text-neutral-400">Admin Panel</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-neutral-700 px-4 py-2.5 mx-3 mb-2">
        <User className="h-4 w-4 flex-shrink-0 text-neutral-400" />
        <span className="truncate text-sm text-neutral-300">{user?.email || "관리자"}</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
                isActive
                  ? "bg-neutral-800/60 text-white"
                  : "text-neutral-300 hover:bg-neutral-800/40 hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-neutral-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between rounded-xl border border-neutral-700 px-4 py-3 text-sm text-neutral-200 hover:border-neutral-500 hover:text-white"
        >
          로그아웃
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
