"use client";

import { useI18n } from "@/lib/i18n/context";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { t } = useI18n();
  
  const categories = [
    t.gallery.all,
    t.gallery.category1,
    t.gallery.category2,
    t.gallery.category3,
    t.gallery.category4,
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-12">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-colors text-sm sm:text-base ${
            selectedCategory === category
              ? "bg-primary-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

