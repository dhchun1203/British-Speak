import { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 | 영국 스피킹 아카데미",
  description: "관리자 페이지",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}






