"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{t.footer.title}</h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-white transition-colors"
                >
                  {t.nav.gallery}
                </Link>
              </li>
              <li>
                <Link
                  href="/notice"
                  className="hover:text-white transition-colors"
                >
                  {t.nav.notice}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{t.footer.contact}</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
              <li className="break-all">{t.footer.phone}: 02-1234-5678</li>
              <li className="break-all">{t.footer.email}: info@britishspeak.ac.kr</li>
              <li>{t.footer.address}: {t.footer.addressText}</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

