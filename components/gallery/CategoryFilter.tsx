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
    <div className="flex flex-nowrap sm:flex-wrap gap-1.5 sm:gap-3 justify-center mb-8 sm:mb-12 overflow-x-auto pb-2 sm:pb-0">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-2.5 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold transition-colors text-xs sm:text-base whitespace-nowrap flex-shrink-0 ${
            selectedCategory === category
              ? "bg-primary-600 dark:bg-primary-500 text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

