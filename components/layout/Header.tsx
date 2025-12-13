"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import Breadcrumb from "./Breadcrumb";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600"
          >
            <span className="hidden sm:inline">{t.home.title}</span>
            <span className="sm:hidden">{language === 'ko' ? '브리티시 스픽' : 'British Speak'}</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/gallery"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t.nav.gallery}
            </Link>
            <Link
              href="/notice"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t.nav.notice}
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t.nav.contact}
            </Link>
            
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 border border-gray-300 rounded-md hover:border-primary-600 transition-colors flex items-center gap-2"
              aria-label="언어 변경"
            >
              <span className={language === 'ko' ? 'font-bold text-primary-600' : 'text-gray-500'}>
                한글
              </span>
              <span className="text-gray-300">|</span>
              <span className={language === 'en' ? 'font-bold text-primary-600' : 'text-gray-500'}>
                English
              </span>
            </button>
          </div>

          {/* Mobile Menu Button and Language Toggle */}
          <div className="md:hidden flex items-center gap-3">
            {/* Language Toggle Button (Mobile) */}
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs font-medium text-gray-700 border border-gray-300 rounded transition-colors"
              aria-label="언어 변경"
            >
              {language === 'ko' ? 'EN' : '한'}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="text-gray-700 relative w-6 h-6"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="메뉴 열기"
            >
              <svg
                className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                }`}
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
                className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                  isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                }`}
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

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 mt-4 pb-4"
              : "max-h-0 opacity-0 mt-0 pb-0"
          }`}
        >
          <div className="space-y-2">
            <Link
              href="/"
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/gallery"
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.gallery}
            </Link>
            <Link
              href="/notice"
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.notice}
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </nav>
      <Breadcrumb />
    </header>
  );
}

