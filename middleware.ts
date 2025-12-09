import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // 관리자 페이지 접근 제어는 클라이언트 사이드에서 처리
  // middleware는 비활성화하고 클라이언트 사이드에서만 인증 확인
  // (로그인 직후 쿠키가 아직 설정되지 않을 수 있으므로)
  
  // 로그인 페이지는 항상 허용
  if (req.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // 다른 관리자 페이지는 클라이언트 사이드에서 인증 확인
  // middleware에서는 리다이렉트하지 않음
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

