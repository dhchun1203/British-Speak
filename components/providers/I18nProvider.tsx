"use client";

import { I18nProvider as BaseI18nProvider } from "@/lib/i18n/context";
import { useEffect } from "react";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 초기 언어 설정에 따라 HTML lang 속성 설정
    const savedLanguage = localStorage.getItem('language') || 'ko';
    document.documentElement.lang = savedLanguage;
  }, []);

  return <BaseI18nProvider>{children}</BaseI18nProvider>;
}





