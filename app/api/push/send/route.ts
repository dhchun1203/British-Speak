import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import webpush from "web-push";

// POST: 푸시 알림 전송
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { title, body: messageBody, inquiryId } = body;

    if (!title || !messageBody) {
      return NextResponse.json(
        { error: "제목과 내용이 필요합니다." },
        { status: 400 }
      );
    }

    // VAPID 키 확인
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidEmail = process.env.VAPID_EMAIL || "mailto:admin@britishspeak.ac.kr";

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error("VAPID keys are not configured");
      return NextResponse.json(
        { error: "푸시 알림 설정이 완료되지 않았습니다." },
        { status: 500 }
      );
    }

    // web-push 설정
    webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

    // 모든 구독 정보 가져오기
    const { data: subscriptions, error: fetchError } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (fetchError) {
      console.error("Error fetching subscriptions:", fetchError);
      return NextResponse.json(
        { error: "구독 정보를 가져올 수 없습니다." },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: "구독자가 없습니다.",
        sent: 0,
      });
    }

    // 푸시 알림 전송
    let sentCount = 0;
    const errors: Array<{ endpoint: string; error: string }> = [];

    const payload = JSON.stringify({
      title,
      body: messageBody,
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      tag: "inquiry-notification",
      data: {
        url: "/admin/inquiries",
        inquiryId,
      },
    });

    await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh_key,
              auth: subscription.auth_key,
            },
          };

          await webpush.sendNotification(pushSubscription, payload);
          sentCount++;
        } catch (error: any) {
          console.error(`Failed to send notification to ${subscription.endpoint}:`, error);
          
          // 구독이 무효한 경우 (410, 404 등) 데이터베이스에서 삭제
          if (error.statusCode === 410 || error.statusCode === 404) {
            await supabase
              .from("push_subscriptions")
              .delete()
              .eq("endpoint", subscription.endpoint);
          }

          errors.push({
            endpoint: subscription.endpoint,
            error: error.message || "Unknown error",
          });
        }
      })
    );

    return NextResponse.json({
      message: "푸시 알림 전송이 완료되었습니다.",
      sent: sentCount,
      total: subscriptions.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Error in POST /api/push/send:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

