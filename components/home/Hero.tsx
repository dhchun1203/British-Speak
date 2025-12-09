"use client";

import { useI18n } from "@/lib/i18n/context";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 sm:py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            {t.home.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-primary-100 px-4">
            {t.home.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <a
              href="#about"
              className="bg-white text-primary-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-sm sm:text-base"
            >
              {t.home.about}
            </a>
            <a
              href="#contact"
              className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-sm sm:text-base"
            >
              {t.home.contact}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

