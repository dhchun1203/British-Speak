"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Notice, NoticeListResponse } from "@/types/notice";

export default function AdminNoticePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchNotices();
    }
  }, [authenticated, page, search]);

  async function checkAuth() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const userRole = user.user_metadata?.role || user.app_metadata?.role;
      const emailContainsAdmin = user.email?.toLowerCase().includes('admin');
      
      const allowedEmails = ['dhchun1203@gmail.com'];
      const isAllowedEmail = allowedEmails.includes(user.email?.toLowerCase() || '');
      
      const isAdmin = userRole === 'admin' || emailContainsAdmin || isAllowedEmail;

      if (!isAdmin) {
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      setAuthenticated(true);
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

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
      setNotices(data.notices);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 공지사항을 삭제하시겠습니까?`)) {
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
      alert('공지사항이 삭제되었습니다.');
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert('공지사항 삭제에 실패했습니다.');
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
      alert('고정 상태 변경에 실패했습니다.');
    }
  }

  const totalPages = Math.ceil(total / pageSize);

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

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-primary-600 hover:text-primary-700"
              >
                ← 대시보드
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">공지사항 관리</h1>
            </div>
            <Link
              href="/admin/notice/new"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              + 새 공지사항
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="제목으로 검색..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* 공지사항 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
          {notices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {search ? "검색 결과가 없습니다." : "등록된 공지사항이 없습니다."}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      고정
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작성자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      조회수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작성일
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePin(notice.id, notice.is_pinned)}
                          className={`text-lg ${
                            notice.is_pinned
                              ? "text-yellow-500"
                              : "text-gray-300 hover:text-yellow-400"
                          }`}
                          title={notice.is_pinned ? "고정 해제" : "고정"}
                        >
                          📌
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Link
                            href={`/notice/${notice.id}`}
                            target="_blank"
                            className="text-sm font-medium text-gray-900 hover:text-primary-600"
                          >
                            {notice.title}
                          </Link>
                          {notice.is_pinned && (
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                              고정
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {notice.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {notice.views || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/notice/${notice.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            수정
                          </Link>
                          <button
                            onClick={() => handleDelete(notice.id, notice.title)}
                            className="text-red-600 hover:text-red-900"
                          >
                            삭제
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
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    총 {total}개 중 {((page - 1) * pageSize) + 1}-
                    {Math.min(page * pageSize, total)}개 표시
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      이전
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      다음
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
