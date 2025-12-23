"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import ScrollAnimation from "@/components/common/ScrollAnimation";

export default function Contact() {
  const { t } = useI18n();

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 bg-gradient-to-r from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4">
        <ScrollAnimation direction="fade">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
            {t.home.contactTitle}
          </h2>
        </ScrollAnimation>
        <div className="max-w-2xl mx-auto">
          <ScrollAnimation direction="up" delay={200}>
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div className="group">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary-600 group-hover:scale-105 transition-transform duration-200">
                    {t.home.phone}
                  </h3>
                  <a
                    href={`tel:${t.home.phoneNumber.replace(/-/g, '')}`}
                    className="text-sm sm:text-base text-gray-700 break-all hover:text-primary-600 transition-colors duration-200 block"
                  >
                    {t.home.phoneNumber}
                  </a>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {t.home.phoneHours}
                  </p>
                </div>
                <div className="group">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary-600 group-hover:scale-105 transition-transform duration-200">
                    {t.home.email}
                  </h3>
                  <a
                    href={`mailto:${t.home.emailAddress}`}
                    className="text-xs sm:text-sm text-gray-700 break-all hover:text-primary-600 transition-colors duration-200 block"
                  >
                    {t.home.emailAddress}
                  </a>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {t.home.emailHours}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary-600">
                  {t.home.visit}
                </h3>
                <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                  {t.home.visitText}
                </p>
                <div className="flex justify-center">
                  <Link
                    href="/contact"
                    className="inline-block bg-primary-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all duration-200 text-sm sm:text-base text-center shadow-md hover:shadow-lg"
                  >
                    {t.home.contact}
                  </Link>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}

