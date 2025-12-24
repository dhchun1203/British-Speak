"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 헤더 높이 (대략 80px, sticky header 기준)
  const headerHeight = 80;

  useEffect(() => {
    const toggleVisibility = () => {
      // 헤더 높이 이상 스크롤되면 버튼 표시
      if (window.scrollY > headerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", toggleVisibility);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-20 sm:bottom-24 right-6 z-40 bg-sky-400 text-white rounded-full p-3 sm:p-4 shadow-lg hover:bg-sky-500 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="맨 위로 이동"
      style={{
        boxShadow: "0 4px 12px rgba(56, 189, 248, 0.3)",
      }}
    >
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}

