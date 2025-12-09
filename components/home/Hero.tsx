export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 sm:py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            영국 스피킹 아카데미
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-primary-100 px-4">
            아이들의 영어 실력 향상을 위한 전문 교육 기관
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <a
              href="#about"
              className="bg-white text-primary-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-sm sm:text-base"
            >
              학원 소개
            </a>
            <a
              href="#contact"
              className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-sm sm:text-base"
            >
              문의하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

