import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// POST: 푸시 알림 구독 저장
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { subscription, userId } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "구독 정보가 필요합니다." },
        { status: 400 }
      );
    }

    // Supabase에 구독 정보 저장
    // inquiries_subscriptions 테이블을 생성해야 합니다
    const { data, error } = await supabase
      .from("push_subscriptions")
      .insert([
        {
          user_id: userId || null,
          endpoint: subscription.endpoint,
          p256dh_key: subscription.keys.p256dh,
          auth_key: subscription.keys.auth,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      // 이미 존재하는 경우 업데이트
      if (error.code === "23505") {
        // unique constraint violation
        const { data: updatedData, error: updateError } = await supabase
          .from("push_subscriptions")
          .update({
            p256dh_key: subscription.keys.p256dh,
            auth_key: subscription.keys.auth,
            updated_at: new Date().toISOString(),
          })
          .eq("endpoint", subscription.endpoint)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating subscription:", updateError);
          return NextResponse.json(
            { error: "구독 정보 업데이트에 실패했습니다." },
            { status: 500 }
          );
        }

        return NextResponse.json({
          message: "구독 정보가 업데이트되었습니다.",
          data: updatedData,
        });
      }

      console.error("Error inserting subscription:", error);
      return NextResponse.json(
        { error: "구독 정보 저장에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "푸시 알림 구독이 완료되었습니다.",
        data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/push/subscribe:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET: 구독 목록 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return NextResponse.json(
        { error: "구독 목록 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscriptions: data || [] });
  } catch (error: any) {
    console.error("Error in GET /api/push/subscribe:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

