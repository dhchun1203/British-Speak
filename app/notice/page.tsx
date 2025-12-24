"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Notice } from "@/types/notice";
import { supabase } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";

export default function NoticePage() {
  const { t, language } = useI18n();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    async function fetchNotices() {
      try {
        setLoading(true);
        const offset = (page - 1) * pageSize;

        // 클라이언트 사이드에서 Supabase 직접 호출
        let query = supabase
          .from('notices')
          .select('*', { count: 'exact' });

        // 검색어가 있으면 제목에서 검색
        if (search) {
          query = query.ilike('title', `%${search}%`);
        }

        // 상단 고정 공지 먼저, 그 다음 최신순
        const { data, error: supabaseError, count } = await query
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false })
          .range(offset, offset + pageSize - 1);

        if (supabaseError) {
          throw new Error(supabaseError.message || t.notice.loading);
        }

        setNotices(data || []);
        setTotal(count || 0);
        setTotalPages(count ? Math.ceil(count / pageSize) : 0);
        setError(null);
      } catch (err) {
        console.error("Error fetching notices:", err);
        setError(err instanceof Error ? err.message : t.common.error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, [page, search, t]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    // useEffect가 page와 search 변경을 감지하여 자동으로 fetchNotices를 호출함
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8 text-gray-800 dark:text-white">
          {t.notice.title}
        </h1>

        {/* 검색 바 */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.notice.searchPlaceholder}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t.common.search}
            </button>
          </div>
        </form>

        {/* 로딩 */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{t.notice.loading}</p>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-2">{t.common.error}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
          </div>
        )}

        {/* 공지사항 목록 */}
        {!loading && !error && (
          <>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {notices.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      {search ? t.notice.noSearchResults : t.notice.noNotices}
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notices.map((notice) => (
                      <li key={notice.id}>
                        <Link
                          href={`/notice/${notice.id}`}
                          className="block p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {notice.is_pinned && (
                                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded">
                                    {t.notice.important}
                                  </span>
                                )}
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                                  {notice.title}
                                </h3>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                                <span>{t.notice.author}: {notice.author}</span>
                                <span>
                                  {new Date(notice.created_at).toLocaleDateString(language === 'ko' ? "ko-KR" : "en-US")}
                                </span>
                                <span>{t.notice.views}: {notice.views || 0}</span>
                              </div>
                            </div>
                            <svg
                              className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t.common.previous}
                </button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t.common.next}
                </button>
              </div>
            )}

            {/* 총 개수 */}
            {total > 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
                {t.notice.total} {total} {t.notice.notices}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}




