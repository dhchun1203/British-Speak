"use client";

import { useI18n } from "@/lib/i18n/context";
import ScrollAnimation from "@/components/common/ScrollAnimation";

export default function Programs() {
  const { t } = useI18n();

  const programs = [
    {
      title: t.home.program1,
      description: t.home.program1Desc,
      icon: "📚",
      color: "from-blue-50 to-blue-100",
    },
    {
      title: t.home.program2,
      description: t.home.program2Desc,
      icon: "💬",
      color: "from-green-50 to-green-100",
    },
    {
      title: t.home.program3,
      description: t.home.program3Desc,
      icon: "🎤",
      color: "from-purple-50 to-purple-100",
    },
    {
      title: t.home.program4,
      description: t.home.program4Desc,
      icon: "📝",
      color: "from-orange-50 to-orange-100",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <ScrollAnimation direction="fade">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
            {t.home.programs}
          </h2>
        </ScrollAnimation>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {programs.map((program, index) => (
            <ScrollAnimation
              key={index}
              direction="up"
              delay={index * 100}
            >
              <div
                className="bg-white p-5 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer h-full flex flex-col"
              >
                <div className={`text-3xl sm:text-4xl mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0`}>
                  {program.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 group-hover:text-primary-600 transition-colors duration-300 flex-shrink-0">
                  {program.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm group-hover:text-gray-700 transition-colors duration-300 flex-grow">
                  {program.description}
                </p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}

