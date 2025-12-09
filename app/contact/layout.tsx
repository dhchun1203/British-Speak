import { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기 | 영국 스피킹 아카데미",
  description: "영국 스피킹 아카데미에 문의하세요. 전화, 이메일, 방문 상담을 통해 자세한 정보를 받아보실 수 있습니다.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


