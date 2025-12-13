import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// 동적 import로 코드 스플리팅
const Header = dynamic(() => import("@/components/layout/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: true });
const ScrollToTop = dynamic(() => import("@/components/layout/ScrollToTop"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "브리티시 스픽",
  description: "브리티시 스픽 공식 웹사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <I18nProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <ScrollToTop />
        </I18nProvider>
      </body>
    </html>
  );
}




