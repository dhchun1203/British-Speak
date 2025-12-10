import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET: 문의사항 목록 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * pageSize;

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

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    return NextResponse.json({
      inquiries: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages,
    });
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { name, email, phone, subject, message } = body;

    // 필수 필드 검증
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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

    // 푸시 알림 전송 (비동기로 실행, 실패해도 문의사항 저장은 성공 처리)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000';
      const pushUrl = `${baseUrl}/api/push/send`;
      
      await fetch(pushUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '새 문의사항이 등록되었습니다',
          body: `${name}님이 문의하셨습니다: ${subject}`,
          inquiryId: data.id,
        }),
      });
    } catch (pushError) {
      // 푸시 알림 실패는 로그만 남기고 사용자에게는 에러를 보여주지 않음
      console.error("Failed to send push notification:", pushError);
    }

    return NextResponse.json(
      {
        message: "문의사항이 성공적으로 전송되었습니다.",
        data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/inquiries:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

