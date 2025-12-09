"use client";

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";

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
            const options = {
              center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청 좌표 (실제 주소로 변경 필요)
              level: 3,
            };
            const map = new window.kakao.maps.Map(container, options);

            // 마커 생성
            const markerPosition = new window.kakao.maps.LatLng(
              37.5665,
              126.9780
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
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
          {t.home.location}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-primary-600">
                {t.home.address}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 whitespace-pre-line">
                {t.home.addressText}
              </p>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-primary-600">
                {t.home.transportation}
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                <li>• {t.home.transport1}</li>
                <li>• {t.home.transport2}</li>
                <li>• {t.home.transport3}</li>
              </ul>
            </div>
            <div className="h-64 md:h-96 rounded-lg overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center">
              {process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY ? (
                <div id="map" className="w-full h-full"></div>
              ) : (
                <div className="text-center text-gray-500 p-4">
                  <p className="mb-2">{t.home.mapPlaceholder}</p>
                  <p className="text-sm">{t.home.mapPlaceholder2}</p>
                  <p className="text-sm font-mono">{t.home.mapPlaceholder3}</p>
                  <p className="text-sm">{t.home.mapPlaceholder4}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

