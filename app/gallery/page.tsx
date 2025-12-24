"use client";

import { useState } from "react";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import CategoryFilter from "@/components/gallery/CategoryFilter";
import { useI18n } from "@/lib/i18n/context";

export default function GalleryPage() {
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>(t.gallery.all);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8 text-gray-800 dark:text-white">
          {t.gallery.title}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto">
          {t.gallery.subtitle}
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

