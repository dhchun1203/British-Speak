"use client";

import { useI18n } from "@/lib/i18n/context";
import ScrollAnimation from "@/components/common/ScrollAnimation";

export default function Programs() {
  const { t } = useI18n();

  const programs = [
    {
      title: t.home.program1,
      description: t.home.program1Desc,
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 via-blue-50/50 to-white",
      iconBg: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: t.home.program2,
      description: t.home.program2Desc,
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 via-emerald-50/50 to-white",
      iconBg: "bg-emerald-100",
      borderColor: "border-emerald-200",
    },
    {
      title: t.home.program3,
      description: t.home.program3Desc,
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 via-purple-50/50 to-white",
      iconBg: "bg-purple-100",
      borderColor: "border-purple-200",
    },
    {
      title: t.home.program4,
      description: t.home.program4Desc,
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 via-amber-50/50 to-white",
      iconBg: "bg-amber-100",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 overflow-hidden transition-colors duration-300">
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation direction="fade">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                {t.home.programs}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
                {t.home.programsSubtitle}
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
                  className={`group relative bg-white dark:bg-gray-800 p-6 sm:p-7 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 h-full flex flex-col border-2 ${program.borderColor} dark:border-gray-700 hover:border-opacity-100 dark:hover:border-gray-600 overflow-hidden`}
                >
                  {/* 카드 배경 그라데이션 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${program.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* 상단 장식 라인 */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${program.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                  
                  <div className="relative z-10">
                    {/* 아이콘 */}
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${program.iconBg} dark:bg-gray-700 flex items-center justify-center mb-5 sm:mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 flex-shrink-0 shadow-md group-hover:shadow-xl overflow-hidden`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <div className="relative text-gray-700 dark:text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-500 z-10">
                        {program.icon}
                      </div>
                    </div>
                    
                    {/* 제목 */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 flex-shrink-0">
                      {program.title}
                    </h3>
                    
                    {/* 설명 */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 flex-grow leading-relaxed">
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

