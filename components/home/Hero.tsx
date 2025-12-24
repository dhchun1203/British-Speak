"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import ScrollAnimation from "@/components/common/ScrollAnimation";

export default function Hero() {
  const { t } = useI18n();

  const handleScrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const headerHeight = 80; // 헤더 높이 (모바일 기준)
      const yOffset = -headerHeight;
      const y = aboutSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 sm:py-24 md:py-36 overflow-hidden">
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* 그리드 패턴 배경 */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollAnimation direction="fade" delay={0}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-dancing-script), cursive' }}>
                British Speak
              </span>
            </h1>
          </ScrollAnimation>
          <ScrollAnimation direction="fade" delay={200}>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 text-primary-50 px-4 leading-relaxed">
              {t.home.subtitle}
            </p>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center px-4">
              <a
                href="#about"
                onClick={handleScrollToAbout}
                className="group bg-white text-primary-600 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-semibold hover:bg-primary-50 hover:scale-105 active:scale-95 transition-all duration-300 text-base sm:text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
              >
                <span>{t.home.about}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <Link
                href="/contact"
                className="group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 hover:border-white hover:scale-105 active:scale-95 transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span>{t.home.contact}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}

