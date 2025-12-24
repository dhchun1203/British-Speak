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
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 via-blue-50/50 to-white",
      iconBg: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: t.home.program2,
      description: t.home.program2Desc,
      icon: "💬",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 via-emerald-50/50 to-white",
      iconBg: "bg-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      title: t.home.program3,
      description: t.home.program3Desc,
      icon: "🎤",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 via-purple-50/50 to-white",
      iconBg: "bg-purple-100",
      borderColor: "border-purple-200",
    },
    {
      title: t.home.program4,
      description: t.home.program4Desc,
      icon: "📝",
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 via-amber-50/50 to-white",
      iconBg: "bg-amber-100",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation direction="fade">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                {t.home.programs}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                다양한 수준과 목적에 맞춘 체계적인 영어 교육 프로그램을 제공합니다
              </p>
            </div>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {programs.map((program, index) => (
              <ScrollAnimation
                key={index}
                direction="up"
                delay={index * 100}
              >
                <div
                  className={`group relative bg-white p-6 sm:p-7 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full flex flex-col border-2 ${program.borderColor} hover:border-opacity-100 overflow-hidden`}
                >
                  {/* 카드 배경 그라데이션 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${program.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* 상단 장식 라인 */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${program.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                  
                  <div className="relative z-10">
                    {/* 아이콘 */}
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${program.iconBg} flex items-center justify-center mb-5 sm:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0 shadow-md group-hover:shadow-xl overflow-hidden`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <span className="relative text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-500 z-10">{program.icon}</span>
                    </div>
                    
                    {/* 제목 */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 group-hover:text-primary-600 transition-colors duration-300 flex-shrink-0">
                      {program.title}
                    </h3>
                    
                    {/* 설명 */}
                    <p className="text-gray-600 text-sm sm:text-base group-hover:text-gray-700 transition-colors duration-300 flex-grow leading-relaxed">
                      {program.description}
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

