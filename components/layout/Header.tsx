"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import Breadcrumb from "./Breadcrumb";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useI18n();
  const pathname = usePathname();

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Desktop: Logo on left, Menu on right */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 hover:gap-3 transition-all duration-300"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* 모던한 영국 상징 - 간결한 크라운 실루엣 */}
                    <path d="M5 4h14M5 8h14M7 4v16M17 4v16M5 20h14"/>
                    <path d="M9 4l2 4 2-4M9 20l2-4 2 4" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:via-primary-800 group-hover:to-primary-700 transition-all duration-300 leading-tight" style={{ fontFamily: 'var(--font-dancing-script), cursive' }}>
                  British Speak
                </span>
                <span className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wider uppercase opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                  English Academy
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="flex items-center space-x-1">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {t.nav.home}
              </Link>
              <Link
                href="/gallery"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/gallery')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {t.nav.gallery}
              </Link>
              <Link
                href="/notice"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/notice')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {t.nav.notice}
              </Link>
              <Link
                href="/contact"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive('/contact')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {t.nav.contact}
              </Link>
              
              {/* Language Toggle Button */}
              <div className="ml-2 pl-2 border-l border-gray-200">
                <button
                  onClick={toggleLanguage}
                  className="px-3 py-2 rounded-lg font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 group"
                  aria-label="언어 변경"
                >
                  <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className={`text-sm ${language === 'ko' ? 'font-semibold text-primary-600' : 'text-gray-500'}`}>
                    한
                  </span>
                  <span className="text-gray-300">/</span>
                  <span className={`text-sm ${language === 'en' ? 'font-semibold text-primary-600' : 'text-gray-500'}`}>
                    EN
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile: Logo and Hamburger on left, Language toggle on right */}
          <div className="md:hidden flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {/* Logo - 아이콘만 */}
              <Link
                href="/"
                className="group flex items-center"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* 모던한 영국 상징 - 간결한 크라운 실루엣 */}
                    <path d="M5 4h14M5 8h14M7 4v16M17 4v16M5 20h14"/>
                    <path d="M9 4l2 4 2-4M9 20l2-4 2 4" strokeWidth="2"/>
                  </svg>
                </div>
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                className="text-gray-700 relative w-6 h-6"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="메뉴 열기"
              >
                <svg
                  className={`w-6 h-6 absolute inset-0 transition-opacity duration-200 ease-out ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                  style={{ willChange: 'opacity' }}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`w-6 h-6 absolute inset-0 transition-opacity duration-200 ease-out ${
                    isMenuOpen ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ willChange: 'opacity' }}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Language Toggle Button (Mobile) */}
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded transition-colors"
              aria-label="언어 변경"
            >
              {language === 'ko' ? 'EN' : '한'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu - Left Slide */}
      <div className="md:hidden">
        {/* Overlay with blur effect */}
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100 z-[60]' : 'opacity-0 pointer-events-none z-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Side Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="px-6 pt-6 pb-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="group flex items-center gap-2.5"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* 모던한 영국 상징 - 간결한 크라운 실루엣 */}
                    <path d="M5 4h14M5 8h14M7 4v16M17 4v16M5 20h14"/>
                    <path d="M9 4l2 4 2-4M9 20l2-4 2 4" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent leading-tight" style={{ fontFamily: 'var(--font-dancing-script), cursive' }}>
                    British Speak
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                    English Academy
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="메뉴 닫기"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-4 py-6 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">{t.nav.home}</span>
            </Link>
            <Link
              href="/gallery"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{t.nav.gallery}</span>
            </Link>
            <Link
              href="/notice"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">{t.nav.notice}</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{t.nav.contact}</span>
            </Link>
          </div>

          {/* Menu Footer */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all duration-200 font-medium"
              aria-label="언어 변경"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>{language === 'ko' ? 'English' : '한국어'}</span>
            </button>
          </div>
        </div>
      </div>

      <Breadcrumb />
    </header>
  );
}

