"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import ScrollAnimation from "@/components/common/ScrollAnimation";

export default function Contact() {
  const { t } = useI18n();

  return (
    <section id="contact" className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 overflow-hidden transition-colors duration-300">
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation direction="fade">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                {t.home.contactTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
                {t.home.contactSubtitle}
              </p>
            </div>
          </ScrollAnimation>
          <div className="max-w-2xl mx-auto">
            <ScrollAnimation direction="up" delay={200}>
              <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-primary-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-700 overflow-hidden group relative">
                {/* 상단 장식 라인 */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                <div className="relative z-10">
                  <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    <div className="group p-4 rounded-xl bg-gradient-to-br from-primary-50 dark:from-primary-900/30 to-transparent hover:from-primary-100 dark:hover:from-primary-900/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-primary-600 dark:text-primary-400">
                      {t.home.phone}
                    </h3>
                  </div>
                  <a
                    href={`tel:${t.home.phoneNumber.replace(/-/g, '')}`}
                    className="text-base sm:text-lg text-gray-800 dark:text-gray-200 break-all hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 block font-medium mb-1"
                  >
                    {t.home.phoneNumber}
                  </a>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {t.home.phoneHours}
                  </p>
                </div>
                <div className="group p-4 rounded-xl bg-gradient-to-br from-secondary-50 dark:from-secondary-900/30 to-transparent hover:from-secondary-100 dark:hover:from-secondary-900/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-primary-600 dark:text-primary-400">
                      {t.home.email}
                    </h3>
                  </div>
                  <a
                    href={`mailto:${t.home.emailAddress}`}
                    className="text-sm sm:text-base text-gray-800 dark:text-gray-200 break-all hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 block font-medium mb-1"
                  >
                    {t.home.emailAddress}
                  </a>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {t.home.emailHours}
                  </p>
                  </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h3 className="text-base sm:text-lg font-semibold text-primary-600 dark:text-primary-400">
                        {t.home.visit}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-line">
                      {t.home.visitText}
                    </p>
                <div className="flex justify-center">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 bg-primary-600 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-semibold hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all duration-300 text-base sm:text-lg text-center shadow-lg hover:shadow-xl"
                  >
                    <span>{t.home.contact}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  </div>
                </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}

