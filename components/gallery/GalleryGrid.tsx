"use client";

import { useState, useEffect } from "react";
import ImageModal from "./ImageModal";
import { GalleryItem } from "@/types/gallery";
import Image from "next/image";

interface GalleryGridProps {
  selectedCategory: string;
}

export default function GalleryGrid({ selectedCategory }: GalleryGridProps) {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        const response = await fetch("/api/gallery");
        
        if (!response.ok) {
          throw new Error("갤러리 이미지를 불러오는데 실패했습니다");
        }
        
        const data = await response.json();
        setImages(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching gallery:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
        // 에러가 발생해도 빈 배열로 설정하여 UI가 깨지지 않도록
        setImages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  const filteredImages =
    selectedCategory === "전체"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">이미지를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-2">오류가 발생했습니다</p>
        <p className="text-gray-500 text-sm">{error}</p>
        <p className="text-gray-400 text-xs mt-4">
          Supabase 설정이 필요할 수 있습니다. docs/SUPABASE_SETUP.md를 확인하세요.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-gray-200"
            onClick={() => setSelectedImage(image)}
          >
            {/* 실제 이미지 또는 placeholder */}
            {image.image_url && image.image_url.startsWith('http') ? (
              <Image
                src={image.image_url}
                alt={image.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm text-center px-2">{image.title}</span>
              </div>
            )}
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold px-4 text-center">
                {image.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 이미지가 없을 때 */}
      {filteredImages.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {selectedCategory === "전체"
              ? "갤러리에 이미지가 없습니다"
              : `${selectedCategory} 카테고리에 이미지가 없습니다`}
          </p>
        </div>
      )}

      {/* 이미지 상세 모달 */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}

