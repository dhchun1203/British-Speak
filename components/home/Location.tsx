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
    <section id="location" className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <ScrollAnimation direction="fade">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
            {t.home.location}
          </h2>
        </ScrollAnimation>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <ScrollAnimation direction="right" delay={200}>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-primary-600 group">
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                    {t.home.address}
                  </span>
                </h3>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 whitespace-pre-line">
                  {t.home.addressText}
                </p>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-primary-600 group">
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                    {t.home.transportation}
                  </span>
                </h3>
                <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                  {[
                    t.home.transport1,
                    t.home.transport2,
                    t.home.transport3,
                  ].map((transport, index) => (
                    <li
                      key={index}
                      className="flex items-start group/item"
                    >
                      <span className="text-primary-600 mr-2 group-hover/item:scale-125 transition-transform duration-200">
                        •
                      </span>
                      <span className="group-hover/item:text-primary-600 transition-colors duration-200">
                        {transport}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="left" delay={400}>
              <div className="h-64 md:h-96 rounded-lg overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center hover:shadow-xl transition-shadow duration-300">
                <div id="map" className="w-full h-full"></div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}

