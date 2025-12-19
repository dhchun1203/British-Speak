"use client";

import { useI18n } from "@/lib/i18n/context";

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 bg-white scroll-mt-20 sm:scroll-mt-24 md:scroll-mt-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
            {t.home.aboutTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary-600">
                {t.home.vision}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                {t.home.visionText}
              </p>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary-600 mt-6 sm:mt-8">
                {t.home.philosophy}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {t.home.philosophyText}
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 sm:p-8 rounded-lg">
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">
                {t.home.features}
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>{t.home.feature1}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>{t.home.feature2}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>{t.home.feature3}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>{t.home.feature4}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

