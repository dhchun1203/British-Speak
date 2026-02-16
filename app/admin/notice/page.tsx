"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Notice, NoticeListResponse } from "@/types/notice";
import { useI18n } from "@/lib/i18n/context";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Section from "../_components/Section";
import Container from "../_components/Container";
import PageHeader from "../_components/PageHeader";
import Panel from "../_components/Panel";

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
    <Section>
      <Container>
        <div className="flex min-h-0 flex-1 flex-col gap-6">
          <PageHeader
            title={t.admin.notice.title}
            back={
              <Link
                href="/admin"
                className="inline-flex items-center text-xs font-medium text-neutral-500 transition-colors hover:text-primary-600"
              >
                {t.admin.notice.backToDashboard}
              </Link>
            }
            actions={
              <Link
                href="/admin/notices/new"
                className="inline-flex items-center rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
              >
                {t.admin.notice.newNotice}
              </Link>
            }
          />

          {/* 검색 및 필터 */}
          <Panel className="p-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder={t.admin.notice.searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="flex-1 px-4 py-2 border border-neutral-200 bg-white text-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </Panel>

          {/* 공지사항 목록 */}
          <Panel className="flex min-h-0 flex-1 flex-col overflow-hidden w-full">
            {notices.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                {search ? t.admin.notice.noResults : t.admin.notice.noNotices}
              </div>
            ) : (
              <>
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="min-h-0 flex-1 overflow-auto overflow-x-auto">
                    <table className="w-full divide-y divide-neutral-200 min-w-[640px]">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        {t.admin.notice.table.pin}
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        {t.admin.notice.table.title}
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider hidden md:table-cell">
                        {t.admin.notice.table.author}
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider hidden sm:table-cell">
                        {t.admin.notice.table.views}
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider hidden lg:table-cell">
                        {t.admin.notice.table.createdAt}
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        {t.admin.notice.table.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {notices.map((notice) => (
                      <tr key={notice.id} className="hover:bg-neutral-50">
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
                              className="text-xs font-medium text-neutral-900 hover:text-primary-600 break-words"
                            >
                              {notice.title}
                            </Link>
                            {notice.is_pinned && (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded w-fit">
                                {t.admin.notice.table.pinned}
                              </span>
                            )}
                            <div className="flex gap-2 md:hidden text-xs text-neutral-500">
                              <span>{notice.author}</span>
                              <span>•</span>
                              <span>{notice.views || 0} {t.admin.notice.table.views}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs text-neutral-500 hidden md:table-cell">
                          {notice.author}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs text-neutral-500 hidden sm:table-cell">
                          {notice.views || 0}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs text-neutral-500 hidden lg:table-cell">
                          {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center text-xs font-medium">
                          <div className="flex justify-center gap-1.5">
                            <Link
                              href={`/admin/notices/${notice.id}/edit`}
                              className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
                            >
                              {t.admin.notice.table.edit}
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(notice.id, notice.title)}
                              className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
                    <div className="flex-shrink-0 bg-neutral-50 px-3 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-neutral-600 text-center sm:text-left">
                      {t.admin.notice.pagination.showing
                        .replace('{total}', total.toString())
                        .replace('{start}', (((page - 1) * pageSize) + 1).toString())
                        .replace('{end}', Math.min(page * pageSize, total).toString())}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 sm:px-4 py-2 border border-neutral-200 bg-white text-neutral-700 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100"
                      >
                        {t.admin.notice.pagination.previous}
                      </button>
                      <span className="px-3 sm:px-4 py-2 text-xs text-neutral-600">
                        {page} / {totalPages}
                      </span>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 sm:px-4 py-2 border border-neutral-200 bg-white text-neutral-700 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100"
                      >
                        {t.admin.notice.pagination.next}
                      </button>
                    </div>
                  </div>
                  )}
                </div>
              </>
            )}
          </Panel>
        </div>
      </Container>
    </Section>
  );
}
