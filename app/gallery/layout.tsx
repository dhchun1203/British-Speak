import { Metadata } from "next";

export const metadata: Metadata = {
  title: "갤러리 | 브리티시 스픽",
  description: "학원 활동 사진을 확인하세요",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}






