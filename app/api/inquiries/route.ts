import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

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

