import type { Metadata } from "next";
import { Nanum_Gothic, Dancing_Script } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// 동적 import로 코드 스플리팅
const Header = dynamic(() => import("@/components/layout/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: true });
const ScrollToTop = dynamic(() => import("@/components/layout/ScrollToTop"), { ssr: false });

const nanumGothic = Nanum_Gothic({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-nanum-gothic",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: "swap",
});

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
    <html lang="ko" suppressHydrationWarning>
      <body className={`${nanumGothic.className} ${dancingScript.variable}`}>
        <ThemeProvider>
          <I18nProvider>
            <Header />
            <main className="min-h-screen overflow-x-hidden">{children}</main>
            <Footer />
            <ScrollToTop />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}




