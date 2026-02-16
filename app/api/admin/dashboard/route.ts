import { createServerClient } from "@/lib/supabase/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils/api";
import { NextRequest } from "next/server";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 한국(Asia/Seoul) 기준 오늘 00:00 ~ 24:00 의 UTC 구간 [start, end) - Intl 없이 오프셋으로 계산 */
function getTodayRangeKST(): { startIso: string; endIso: string } {
  const now = new Date();
  const utcMs = now.getTime();
  const seoulMs = utcMs + KST_OFFSET_MS;
  const seoulDate = new Date(seoulMs);
  const y = seoulDate.getUTCFullYear();
  const m = seoulDate.getUTCMonth();
  const d = seoulDate.getUTCDate();
  const startUtc = Date.UTC(y, m, d) - KST_OFFSET_MS;
  const endUtc = startUtc + 24 * 60 * 60 * 1000;
  return {
    startIso: new Date(startUtc).toISOString(),
    endIso: new Date(endUtc).toISOString(),
  };
}

/** 한국 기준 오늘 날짜 문자열 YYYY-MM-DD */
function getTodayDateStrKST(): string {
  const now = new Date();
  const seoulMs = now.getTime() + KST_OFFSET_MS;
  const seoulDate = new Date(seoulMs);
  const y = seoulDate.getUTCFullYear();
  const m = String(seoulDate.getUTCMonth() + 1).padStart(2, "0");
  const d = String(seoulDate.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 한국 기준 오늘 + dayOffset 일의 날짜 문자열 YYYY-MM-DD */
function getDateStrKSTOffset(dayOffset: number): string {
  const now = new Date();
  const seoulMs = now.getTime() + KST_OFFSET_MS;
  const seoulDate = new Date(seoulMs);
  seoulDate.setUTCDate(seoulDate.getUTCDate() + dayOffset);
  const y = seoulDate.getUTCFullYear();
  const m = String(seoulDate.getUTCMonth() + 1).padStart(2, "0");
  const d = String(seoulDate.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();

    const { startIso: todayIso, endIso: todayEndIso } = getTodayRangeKST();
    const todayStrKst = getTodayDateStrKST();

    const { searchParams } = new URL(request.url);
    const paramStart = searchParams.get("startDate");
    const paramEnd = searchParams.get("endDate");
    const DEFAULT_DAYS = 7;
    let rangeStartDateStr: string;
    let rangeEndDateStr: string;
    if (paramStart && paramEnd && paramStart <= paramEnd) {
      rangeStartDateStr = paramStart;
      rangeEndDateStr = paramEnd;
      const daysDiff =
        (new Date(rangeEndDateStr).getTime() - new Date(rangeStartDateStr).getTime()) /
          (24 * 60 * 60 * 1000) +
        1;
      if (daysDiff > 90) {
        const end = new Date(rangeEndDateStr + "T00:00:00.000Z");
        end.setUTCDate(end.getUTCDate() - 89);
        rangeStartDateStr = end.toISOString().slice(0, 10);
      }
    } else {
      rangeEndDateStr = todayStrKst;
      rangeStartDateStr = getDateStrKSTOffset(-(DEFAULT_DAYS - 1));
    }
    const rangeStart = new Date(rangeStartDateStr + "T00:00:00.000Z");
    const rangeEnd = new Date(rangeEndDateStr + "T00:00:00.000Z");

    const [
      todayInquiriesResult,
      pendingInquiriesResult,
      uploadCountResult,
      totalVisitsResult,
      todayVisitsResult,
      visitsRawResult,
      recentNoticesResult,
      recentInquiriesResult,
    ] = await Promise.all([
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayIso)
        .lt("created_at", todayEndIso),
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("gallery")
        .select("id", { count: "exact", head: true }),
      supabase.from("visits").select("id", { count: "exact", head: true }),
      supabase
        .from("visits")
        .select("id", { count: "exact", head: true })
        .eq("visit_date", todayStrKst),
      supabase
        .from("visits")
        .select("visit_date,device")
        .gte("visit_date", rangeStartDateStr)
        .lte("visit_date", rangeEndDateStr),
      supabase
        .from("notices")
        .select("id,title,created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("inquiries")
        .select("id,subject,name,created_at,status")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    // visits 테이블이 없을 수 있으므로 에러 시 0으로 처리 (배포 서버에서는 Vercel 함수 로그에서 원인 확인 가능)
    if (totalVisitsResult.error || todayVisitsResult.error) {
      console.error("[dashboard] visits query failed:", {
        total: totalVisitsResult.error?.message ?? totalVisitsResult.error,
        today: todayVisitsResult.error?.message ?? todayVisitsResult.error,
        hint: "Vercel에서 방문자 수가 0이면 SUPABASE_SERVICE_ROLE_KEY가 Service Role 키인지 확인하세요.",
      });
    }
    const totalVisits = totalVisitsResult.error ? 0 : (totalVisitsResult.count ?? 0);
    let todayVisits = todayVisitsResult.error ? 0 : (todayVisitsResult.count ?? 0);

    // 일별 방문 수 (선택 기간, visit_date = 한국 기준 방문일)
    type DayRow = { date: string; count: number; cumulative: number; desktop: number; mobile: number; tablet: number; unknown: number };
    const visitsByDay: DayRow[] = [];
    const daysInRange: string[] = [];
    for (let t = rangeStart.getTime(); t <= rangeEnd.getTime(); t += 24 * 60 * 60 * 1000) {
      daysInRange.push(new Date(t).toISOString().slice(0, 10));
    }
    if (!visitsRawResult.error && visitsRawResult.data?.length) {
      const byDate: Record<string, { total: number; desktop: number; mobile: number; tablet: number; unknown: number }> = {};
      for (const row of visitsRawResult.data as { visit_date?: string; device?: string }[]) {
        const d = row.visit_date ?? "";
        if (!d) continue;
        if (!byDate[d]) byDate[d] = { total: 0, desktop: 0, mobile: 0, tablet: 0, unknown: 0 };
        byDate[d].total += 1;
        const dev = row.device ?? "unknown";
        if (dev === "desktop") byDate[d].desktop += 1;
        else if (dev === "mobile") byDate[d].mobile += 1;
        else if (dev === "tablet") byDate[d].tablet += 1;
        else byDate[d].unknown += 1;
      }
      let runningCumulative = 0;
      for (const dateStr of daysInRange) {
        const b = byDate[dateStr] ?? { total: 0, desktop: 0, mobile: 0, tablet: 0, unknown: 0 };
        runningCumulative += b.total;
        visitsByDay.push({
          date: dateStr,
          count: b.total,
          cumulative: runningCumulative,
          desktop: b.desktop,
          mobile: b.mobile,
          tablet: b.tablet,
          unknown: b.unknown,
        });
      }
    } else {
      for (const dateStr of daysInRange) {
        visitsByDay.push({
          date: dateStr,
          count: 0,
          cumulative: 0,
          desktop: 0,
          mobile: 0,
          tablet: 0,
          unknown: 0,
        });
      }
    }

    if (
      todayInquiriesResult.error ||
      pendingInquiriesResult.error ||
      uploadCountResult.error ||
      recentNoticesResult.error ||
      recentInquiriesResult.error
    ) {
      throw (
        todayInquiriesResult.error ||
        pendingInquiriesResult.error ||
        uploadCountResult.error ||
        recentNoticesResult.error ||
        recentInquiriesResult.error
      );
    }

    return createSuccessResponse({
      todayInquiries: todayInquiriesResult.count || 0,
      pendingInquiries: pendingInquiriesResult.count || 0,
      uploadCount: uploadCountResult.count || 0,
      totalVisits,
      todayVisits,
      visitsByDay,
      visitsRangeStart: rangeStartDateStr,
      visitsRangeEnd: rangeEndDateStr,
      recentNotices: (recentNoticesResult.data || []).map((notice) => ({
        id: notice.id,
        title: notice.title,
        createdAt: notice.created_at,
      })),
      recentInquiries: (recentInquiriesResult.data || []).map((inquiry) => ({
        id: inquiry.id,
        subject: inquiry.subject,
        name: inquiry.name,
        createdAt: inquiry.created_at,
        status: inquiry.status,
      })),
    });
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch dashboard");
  }
}
