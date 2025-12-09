"use client";

import { useEffect } from "react";
import Image from "next/image";
import { GalleryItem } from "@/types/gallery";

interface ImageModalProps {
  image: GalleryItem;
  onClose: () => void;
}

export default function ImageModal({ image, onClose }: ImageModalProps) {
  useEffect(() => {
    // 모달이 열릴 때 body 스크롤 방지
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    // ESC 키로 모달 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          aria-label="닫기"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 이미지 컨테이너 */}
        <div className="bg-white rounded-lg overflow-hidden">
          {/* 이미지 */}
          {image.image_url && image.image_url.startsWith('http') ? (
            <div className="relative w-full aspect-video bg-gray-100">
              <Image
                src={image.image_url}
                alt={image.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
              <span className="text-gray-500 text-lg">{image.title}</span>
            </div>
          )}

          {/* 이미지 정보 */}
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
              {image.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>카테고리: {image.category}</span>
              <span>
                업로드일: {new Date(image.created_at).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

