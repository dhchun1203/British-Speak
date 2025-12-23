"use client";

import { useI18n } from "@/lib/i18n/context";
import ScrollAnimation from "@/components/common/ScrollAnimation";

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 bg-white scroll-mt-20 sm:scroll-mt-24 md:scroll-mt-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <ScrollAnimation direction="fade">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
              {t.home.aboutTitle}
            </h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <ScrollAnimation direction="right" delay={200}>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary-600 group">
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                    {t.home.vision}
                  </span>
                </h3>
                <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                  {t.home.visionText}
                </p>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary-600 mt-6 sm:mt-8 group">
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                    {t.home.philosophy}
                  </span>
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {t.home.philosophyText}
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="left" delay={400}>
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 sm:p-8 rounded-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">
                  {t.home.features}
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
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
                      <span className="text-accent-500 mr-2 text-lg group-hover/item:scale-125 transition-transform duration-200">
                        ✓
                      </span>
                      <span className="group-hover/item:text-primary-600 transition-colors duration-200">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}

