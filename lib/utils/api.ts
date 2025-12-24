import { NextResponse } from "next/server";

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

/**
 * API 에러 응답 생성 유틸리티
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage: string = "서버 오류가 발생했습니다.",
  defaultStatus: number = 500
): NextResponse {
  console.error("API Error:", error);

  // Supabase 환경 변수 누락 체크
  if (error instanceof Error && error.message?.includes("Missing Supabase")) {
    return NextResponse.json(
      { error: "Supabase is not configured. Please check SUPABASE_SETUP.md" },
      { status: 503 }
    );
  }

  // 에러 객체인 경우
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message || defaultMessage },
      { status: defaultStatus }
    );
  }

  // 기본 에러 응답
  return NextResponse.json(
    { error: defaultMessage },
    { status: defaultStatus }
  );
}

/**
 * 성공 응답 생성 유틸리티
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * 페이지네이션 파라미터 파싱
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaultPage: number = 1,
  defaultPageSize: number = 10
) {
  const page = Math.max(1, parseInt(searchParams.get("page") || String(defaultPage), 10));
  const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get("pageSize") || String(defaultPageSize), 10)));
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
}

/**
 * 페이지네이션 응답 생성
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
) {
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}






