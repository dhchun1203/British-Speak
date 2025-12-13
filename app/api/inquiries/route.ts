import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createErrorResponse, createSuccessResponse, parsePaginationParams, createPaginatedResponse } from "@/lib/utils/api";

// GET: 문의사항 목록 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    
    const { page, pageSize, offset } = parsePaginationParams(searchParams, 1, 20);
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    // 검색 쿼리 빌더
    let query = supabase
      .from('inquiries')
      .select('*', { count: 'exact' });

    // 상태 필터
    if (status) {
      query = query.eq('status', status);
    }

    // 검색어가 있으면 제목, 이름, 이메일에서 검색
    if (search) {
      query = query.or(`subject.ilike.%${search}%,name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // 최신순 정렬
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return createSuccessResponse(
      createPaginatedResponse(data || [], count || 0, page, pageSize)
    );
  } catch (error) {
    return createErrorResponse(error, 'Failed to fetch inquiries');
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { name, email, phone, subject, message } = body;

    // 필수 필드 검증
    const { validateRequiredFields, isValidEmail } = await import('@/lib/utils/validation');
    const { isValid, missingFields } = validateRequiredFields(body, ['name', 'email', 'subject', 'message']);
    
    if (!isValid) {
      return NextResponse.json(
        { error: `필수 항목을 모두 입력해주세요: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다." },
        { status: 400 }
      );
    }

    // 문의사항 저장
    const { data, error } = await supabase
      .from("inquiries")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          subject,
          message,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting inquiry:", error);
      return NextResponse.json(
        { error: "문의사항 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    return createSuccessResponse(
      {
        message: "문의사항이 성공적으로 전송되었습니다.",
        data,
      },
      201
    );
  } catch (error) {
    return createErrorResponse(error, "서버 오류가 발생했습니다.");
  }
}

