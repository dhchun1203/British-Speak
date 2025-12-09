"use client";

import { useI18n } from "@/lib/i18n/context";

export default function Programs() {
  const { t } = useI18n();

  const programs = [
    {
      title: t.home.program1,
      description: t.home.program1Desc,
      icon: "📚",
    },
    {
      title: t.home.program2,
      description: t.home.program2Desc,
      icon: "💬",
    },
    {
      title: t.home.program3,
      description: t.home.program3Desc,
      icon: "🎤",
    },
    {
      title: t.home.program4,
      description: t.home.program4Desc,
      icon: "📝",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
          {t.home.programs}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{program.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">
                {program.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">{program.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

