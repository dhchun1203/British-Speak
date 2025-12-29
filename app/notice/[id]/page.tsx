"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Notice } from "@/types/notice";
import { supabase } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n/context";

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { t, language } = useI18n();

  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotice() {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // 클라이언트 사이드에서 Supabase 직접 호출
        const { data, error: supabaseError } = await supabase
          .from('notices')
          .select('*')
          .eq('id', id)
          .single();
        
        if (supabaseError) {
          if (supabaseError.code === 'PGRST116') {
            throw new Error(t.notice.notFound);
          }
          throw new Error(supabaseError.message || t.notice.loadingDetail);
        }
        
        // 조회수 증가
        if (data) {
          await supabase
            .from('notices')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);
          
          setNotice({ ...data, views: (data.views || 0) + 1 });
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching notice:", err);
        setError(err instanceof Error ? err.message : t.notice.notFound);
        setNotice(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchNotice();
    }
  }, [id, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t.notice.loadingDetail}</p>
        </div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4 text-lg">{error || t.notice.notFound}</p>
          <Link
            href="/notice"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 underline"
          >
            {t.notice.backToList}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* 뒤로가기 버튼 */}
          <Link
            href="/notice"
            className="inline-flex items-center text-sm sm:text-base text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 mb-6"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            {t.notice.list}
          </Link>

          {/* 공지사항 내용 */}
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
            {/* 헤더 */}
            <header className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                {notice.is_pinned && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold rounded">
                    {t.notice.important}
                  </span>
                )}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  {notice.title}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                <span>{t.notice.author}: {notice.author}</span>
                <span>
                  {t.notice.createdAt}: {new Date(notice.created_at).toLocaleString(language === 'ko' ? "ko-KR" : "en-US")}
                </span>
                {notice.updated_at !== notice.created_at && (
                  <span>
                    {t.notice.updatedAt}: {new Date(notice.updated_at).toLocaleString(language === 'ko' ? "ko-KR" : "en-US")}
                  </span>
                )}
                <span>{t.notice.views}: {notice.views || 0}</span>
              </div>
            </header>

            {/* 본문 */}
            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
              <div
                className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: notice.content
                    // 마크다운 이미지 형식 ![alt](url)을 img 태그로 변환
                    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
                    // 줄바꿈 처리
                    .replace(/\n/g, '<br />')
                }}
              />
            </div>

            {/* 첨부파일 */}
            {notice.attachments && notice.attachments.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800 dark:text-white">{t.notice.attachments}</h3>
                <ul className="space-y-2">
                  {notice.attachments.map((attachment, index) => (
                    <li key={index}>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 underline flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {attachment.name}
                        {attachment.size && (
                          <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                            ({(attachment.size / 1024).toFixed(2)} KB)
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* 하단 네비게이션 */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/notice"
              className="px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t.notice.backToDetail}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

