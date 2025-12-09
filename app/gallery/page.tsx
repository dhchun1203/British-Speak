"use client";

import { useState } from "react";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import CategoryFilter from "@/components/gallery/CategoryFilter";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          갤러리
        </h1>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
          아이들의 다양한 활동 모습을 확인하세요
        </p>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <GalleryGrid selectedCategory={selectedCategory} />
      </div>
    </div>
  );
}

