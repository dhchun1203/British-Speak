import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEVICE_VALUES = ["desktop", "mobile", "tablet", "unknown"] as const;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 현재 시각을 한국(Asia/Seoul) 기준 날짜로 YYYY-MM-DD */
function getVisitDateKST(): string {
  const now = new Date();
  const seoulMs = now.getTime() + KST_OFFSET_MS;
  const seoulDate = new Date(seoulMs);
  const y = seoulDate.getUTCFullYear();
  const m = String(seoulDate.getUTCMonth() + 1).padStart(2, "0");
  const d = String(seoulDate.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function POST(request: Request) {
  try {
    let device: string = "unknown";
    try {
      const body = await request.json();
      if (body?.device && DEVICE_VALUES.includes(body.device)) {
        device = body.device;
      }
    } catch {
      // body 없거나 JSON 아님 → device 기본값 유지
    }
    const visitDate = getVisitDateKST();
    const supabase = createServerClient();
    const { error } = await supabase.from("visits").insert({ device, visit_date: visitDate });
    if (error) {
      console.error("Visit record error:", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("Visit record error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
