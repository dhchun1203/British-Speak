"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Supabase의 onAuthStateChange를 사용하여 세션 상태를 실시간으로 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          await verifyAdmin(session.user);
        } else {
          router.push("/admin/login");
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push("/admin/login");
      } else if (session?.user) {
        await verifyAdmin(session.user);
      } else {
        // 세션이 없으면 현재 세션 확인
        checkCurrentSession();
      }
    });

    // 초기 세션 확인
    checkCurrentSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  async function checkCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        router.push("/admin/login");
        setLoading(false);
        return;
      }

      if (session?.user) {
        await verifyAdmin(session.user);
      } else {
        console.log("No session found");
        router.push("/admin/login");
        setLoading(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/admin/login");
      setLoading(false);
    }
  }

  async function verifyAdmin(currentUser: any) {
    try {
      console.log("Verifying admin for:", currentUser.email);
      console.log("User metadata:", currentUser.user_metadata);

      // 관리자 권한 확인
      const userRole = currentUser.user_metadata?.role || currentUser.app_metadata?.role;
      const emailContainsAdmin = currentUser.email?.toLowerCase().includes('admin');
      
      // 개발 단계: 특정 이메일 허용 (임시)
      const allowedEmails = ['dhchun1203@gmail.com']; // 개발용 - 나중에 제거
      const isAllowedEmail = allowedEmails.includes(currentUser.email?.toLowerCase() || '');
      
      const isAdmin = userRole === 'admin' || emailContainsAdmin || isAllowedEmail;

      console.log("Admin check:", { userRole, emailContainsAdmin, isAllowedEmail, isAdmin });

      if (!isAdmin) {
        console.log("Not admin, signing out");
        await supabase.auth.signOut();
        router.push("/admin/login");
        setLoading(false);
        return;
      }

      console.log("Admin verified, setting user");
      setUser(currentUser);
      setLoading(false);
    } catch (error) {
      console.error("Verify admin error:", error);
      router.push("/admin/login");
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">관리자 대시보드</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 갤러리 관리 카드 */}
          <Link
            href="/admin/gallery"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">갤러리 관리</h3>
                <p className="text-sm text-gray-600">이미지 업로드 및 관리</p>
              </div>
            </div>
          </Link>

          {/* 공지사항 관리 카드 */}
          <Link
            href="/admin/notice"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-secondary-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">공지사항 관리</h3>
                <p className="text-sm text-gray-600">공지사항 작성 및 관리</p>
              </div>
            </div>
          </Link>

          {/* 통계 카드 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">통계</h3>
                <p className="text-sm text-gray-600">향후 구현 예정</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

