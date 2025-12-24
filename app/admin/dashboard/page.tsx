"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AdminDashboard() {
  const router = useRouter();
  const { t } = useI18n();
  const { user, loading } = useAdminAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return <LoadingSpinner message={t.admin.dashboard.loading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t.admin.dashboard.title}</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 break-all">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white w-full sm:w-auto"
              >
                {t.admin.dashboard.logout}
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
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t.admin.dashboard.gallery.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.admin.dashboard.gallery.description}</p>
              </div>
            </div>
          </Link>

          {/* 공지사항 관리 카드 */}
          <Link
            href="/admin/notice"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t.admin.dashboard.notice.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.admin.dashboard.notice.description}</p>
              </div>
            </div>
          </Link>

          {/* 문의하기 관리 카드 */}
          <Link
            href="/admin/inquiries"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
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
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t.admin.dashboard.inquiries.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.admin.dashboard.inquiries.description}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

