export default function Programs() {
  const programs = [
    {
      title: "기초 영어",
      description: "알파벳부터 시작하는 초보자를 위한 기초 과정",
      icon: "📚",
    },
    {
      title: "회화 중심",
      description: "실생활에서 바로 쓸 수 있는 실용 영어 회화",
      icon: "💬",
    },
    {
      title: "영어 발음",
      description: "정확한 발음과 억양을 익히는 전문 과정",
      icon: "🎤",
    },
    {
      title: "영어 시험 준비",
      description: "각종 영어 시험 대비 전문 반",
      icon: "📝",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
          주요 프로그램
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

