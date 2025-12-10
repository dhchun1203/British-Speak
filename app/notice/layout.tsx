import { Metadata } from "next";

export const metadata: Metadata = {
  title: "공지사항 | 브리티시 스픽",
  description: "학원 공지사항을 확인하세요",
};

export default function NoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}






