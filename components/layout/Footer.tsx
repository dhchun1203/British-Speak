import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">영국 스피킹 아카데미</h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              아이들의 영어 실력 향상을 위한 전문 교육 기관입니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">빠른 링크</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="hover:text-white transition-colors"
                >
                  갤러리
                </Link>
              </li>
              <li>
                <Link
                  href="/notice"
                  className="hover:text-white transition-colors"
                >
                  공지사항
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">연락처</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
              <li className="break-all">전화: 02-1234-5678</li>
              <li className="break-all">이메일: info@britishspeak.ac.kr</li>
              <li>주소: 서울특별시 강남구 테헤란로 123</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2024 영국 스피킹 아카데미. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

