export default function Contact() {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 bg-gradient-to-r from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
          문의하기
        </h2>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary-600">
                  전화 문의
                </h3>
                <p className="text-sm sm:text-base text-gray-700 break-all">02-1234-5678</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  평일 09:00 - 18:00
                </p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-primary-600">
                  이메일 문의
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 break-all">info@britishspeak.ac.kr</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  24시간 접수 가능
                </p>
              </div>
            </div>
            <div className="border-t pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-primary-600">
                방문 상담
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                학원을 직접 방문하시면 더 자세한 상담을 받으실 수 있습니다.
                방문 전 전화 예약을 부탁드립니다.
              </p>
              <a
                href="#location"
                className="inline-block bg-primary-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm sm:text-base"
              >
                위치 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

