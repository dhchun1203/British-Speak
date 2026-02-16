import { createServerClient } from "@/lib/supabase/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils/api";

export async function GET() {
  try {
    const supabase = createServerClient();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    const [
      todayInquiriesResult,
      pendingInquiriesResult,
      uploadCountResult,
      totalVisitsResult,
      todayVisitsResult,
      recentNoticesResult,
      recentInquiriesResult,
    ] = await Promise.all([
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayIso),
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
        .gte("created_at", todayIso),
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
    const todayVisits = todayVisitsResult.error ? 0 : (todayVisitsResult.count ?? 0);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4b901aa4-dae6-4afd-ba0e-961056419523',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/admin/dashboard/route.ts:visits',message:'visits query result',data:{totalError:totalVisitsResult.error?.message,totalCount:totalVisitsResult.count,todayError:todayVisitsResult.error?.message,todayCount:todayVisitsResult.count,totalVisits,todayVisits},timestamp:Date.now(),hypothesisId:'H1-H2'})}).catch(()=>{});
    // #endregion

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
