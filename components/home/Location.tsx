"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import ScrollAnimation from "@/components/common/ScrollAnimation";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Location() {
  const { t } = useI18n();

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    
    if (!apiKey) {
      console.warn("카카오맵 API 키가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_KAKAO_MAP_API_KEY를 추가하세요.");
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao) {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          if (container) {
            // 경기 화성시 동탄대로 636-14 상가동 A-206호 좌표
            // const options = {
            //   center: new window.kakao.maps.LatLng(37.2035, 127.0708), // 동탄대로 636-14 대략 좌표
            //   level: 3,
            // };
            // 서울특별시 강남구 역삼로3길 17-6 좌표
            // 정확한 좌표는 카카오맵에서 주소 검색 후 우클릭 → 좌표 복사로 확인 가능
            const options = {
              center: new window.kakao.maps.LatLng(37.5010, 127.0370), // 역삼로3길 17-6 대략 좌표
              level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);

            // 마커 생성
            // const markerPosition = new window.kakao.maps.LatLng(
            //   37.2035,
            //   127.0708
            // );
            const markerPosition = new window.kakao.maps.LatLng(
              37.5010,
              127.0370
            );
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(map);
          }
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <section id="location" className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 overflow-hidden transition-colors duration-300">
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation direction="fade">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                {t.home.location}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
                {t.home.locationSubtitle}
              </p>
            </div>
          </ScrollAnimation>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <ScrollAnimation direction="right" delay={200}>
              <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-2xl transition-all duration-500 h-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400 flex items-center gap-2 group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {t.home.address}
                  </span>
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 whitespace-pre-line leading-relaxed">
                  {t.home.addressText}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-primary-600 flex items-center gap-2 group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {t.home.transportation}
                  </span>
                </h3>
                <ul className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  {[
                    t.home.transport1,
                    t.home.transport2,
                    t.home.transport3,
                  ].map((transport, index) => (
                    <li
                      key={index}
                      className="flex items-start group/item"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center mr-3 group-hover/item:bg-primary-600 dark:group-hover/item:bg-primary-500 group-hover/item:scale-110 transition-all duration-200 mt-0.5">
                        <svg className="w-3 h-3 text-primary-600 dark:text-primary-400 group-hover/item:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors duration-200 leading-relaxed">
                        {transport}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="left" delay={400}>
              <div className="h-64 md:h-96 rounded-3xl overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 dark:border-gray-600 hover:border-primary-200 dark:hover:border-primary-700">
                <div id="map" className="w-full h-full"></div>
              </div>
            </ScrollAnimation>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

