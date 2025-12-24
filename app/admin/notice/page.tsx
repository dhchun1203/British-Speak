"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Notice, NoticeListResponse } from "@/types/notice";
import { useI18n } from "@/lib/i18n/context";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AdminNoticePage() {
  const { t } = useI18n();
  const { loading, authenticated } = useAdminAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authenticated) {
      fetchNotices();
    }
  }, [authenticated, page, search]);

  async function fetchNotices() {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/notices?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch notices");
      
      const data: NoticeListResponse = await response.json();
      setNotices(data.notices || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(t.admin.notice.deleteConfirm.replace('{title}', title))) {
      return;
    }

    try {
      const response = await fetch(`/api/notices/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notice");
      }

      await fetchNotices();
      alert(t.admin.notice.deleteSuccess);
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert(t.admin.notice.deleteFailed);
    }
  }

  async function handleTogglePin(id: string, currentPinned: boolean) {
    try {
      const response = await fetch(`/api/notices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_pinned: !currentPinned }),
      });

      if (!response.ok) {
        throw new Error("Failed to update notice");
      }

      await fetchNotices();
    } catch (error) {
      console.error("Error updating notice:", error);
      alert(t.admin.notice.pinChangeFailed);
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Link
                href="/admin/dashboard"
                className="text-sm sm:text-base text-primary-600 hover:text-primary-700"
              >
                {t.admin.notice.backToDashboard}
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t.admin.notice.title}</h1>
            </div>
            <Link
              href="/admin/notice/new"
              className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-primary-600 text-white rounded-md hover:bg-primary-700 w-full sm:w-auto text-center"
            >
              {t.admin.notice.newNotice}
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 검색 및 필터 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={t.admin.notice.searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* 공지사항 목록 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-full">
          {notices.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {search ? t.admin.notice.noResults : t.admin.notice.noNotices}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 min-w-[640px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t.admin.notice.table.pin}
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t.admin.notice.table.title}
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      {t.admin.notice.table.author}
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      {t.admin.notice.table.views}
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      {t.admin.notice.table.createdAt}
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.admin.notice.table.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {notices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePin(notice.id, notice.is_pinned)}
                          className={`text-lg ${
                            notice.is_pinned
                              ? "text-yellow-500"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                          title={notice.is_pinned ? t.admin.notice.table.unpin : t.admin.notice.table.pin}
                        >
                          📌
                        </button>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <Link
                            href={`/notice/${notice.id}`}
                            target="_blank"
                            className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 break-words"
                          >
                            {notice.title}
                          </Link>
                          {notice.is_pinned && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded w-fit">
                              {t.admin.notice.table.pinned}
                            </span>
                          )}
                          <div className="flex gap-2 md:hidden text-xs text-gray-500 dark:text-gray-400">
                            <span>{notice.author}</span>
                            <span>•</span>
                            <span>{notice.views || 0} {t.admin.notice.table.views}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {notice.author}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        {notice.views || 0}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                        {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Link
                            href={`/admin/notice/${notice.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {t.admin.notice.table.edit}
                          </Link>
                          <button
                            onClick={() => handleDelete(notice.id, notice.title)}
                            className="text-red-600 hover:text-red-900"
                          >
                            {t.admin.notice.table.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="bg-gray-50 dark:bg-gray-700 px-3 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                    {t.admin.notice.pagination.showing
                      .replace('{total}', total.toString())
                      .replace('{start}', (((page - 1) * pageSize) + 1).toString())
                      .replace('{end}', Math.min(page * pageSize, total).toString())}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      {t.admin.notice.pagination.previous}
                    </button>
                    <span className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      {t.admin.notice.pagination.next}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
