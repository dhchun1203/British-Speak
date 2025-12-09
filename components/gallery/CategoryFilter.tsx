"use client";

const categories = ["전체", "수업", "이벤트", "체험활동", "기타"];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
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

