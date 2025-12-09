export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
            학원 소개
          </h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary-600">
                우리의 비전
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                영국 스피킹 아카데미는 아이들이 자신감 있게 영어로 소통할 수
                있도록 돕는 것을 목표로 합니다. 실용적인 영어 교육을 통해
                글로벌 인재로 성장할 수 있는 기반을 마련합니다.
              </p>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary-600 mt-6 sm:mt-8">
                교육 철학
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                단순 암기가 아닌 실제 상황에서 사용할 수 있는 영어 실력을
                기르는 것에 중점을 둡니다. 체계적인 커리큘럼과 경험 많은 강사진을
                통해 최고의 교육을 제공합니다.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 sm:p-8 rounded-lg">
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">
                주요 특징
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>소규모 그룹 수업으로 개별 맞춤 지도</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>원어민 강사와의 직접 대화 기회</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>체계적인 레벨별 커리큘럼</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent-500 mr-2">✓</span>
                  <span>정기적인 학습 진도 및 평가</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

