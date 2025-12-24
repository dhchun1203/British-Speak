"use client";

import { useI18n } from "@/lib/i18n/context";
import ScrollAnimation from "@/components/common/ScrollAnimation";

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 overflow-hidden scroll-mt-20 sm:scroll-mt-24 md:scroll-mt-28 transition-colors duration-300">
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
                {t.home.aboutTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
                {t.home.aboutSubtitle}
              </p>
            </div>
          </ScrollAnimation>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <ScrollAnimation direction="right" delay={200}>
              <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-2xl transition-all duration-500">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400 flex items-center gap-2 group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {t.home.vision}
                  </span>
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  {t.home.visionText}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-primary-600 flex items-center gap-2 group mt-8">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {t.home.philosophy}
                  </span>
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t.home.philosophyText}
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="left" delay={400}>
              <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-primary-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-2xl transition-all duration-500 overflow-hidden group relative">
                {/* 상단 장식 라인 */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600"></div>
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t.home.features}
                  </h3>
                <ul className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  {[
                    t.home.feature1,
                    t.home.feature2,
                    t.home.feature3,
                    t.home.feature4,
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start group/item"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mr-3 group-hover/item:bg-primary-600 dark:group-hover/item:bg-primary-500 group-hover/item:scale-110 transition-all duration-200 mt-0.5">
                        <svg className="w-4 h-4 text-primary-600 dark:text-primary-400 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors duration-200 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}

