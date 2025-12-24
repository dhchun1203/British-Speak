"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function NewNoticePage() {
  const router = useRouter();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: t.admin.title,
    is_pinned: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert(t.admin.noticeNew.validation.required);
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create notice");
      }

      const data = await response.json();
      alert(t.admin.noticeNew.success);
      router.push("/admin/notice");
    } catch (error: any) {
      console.error("Error creating notice:", error);
      alert(error.message || t.admin.noticeNew.failed);
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 확인
    if (!file.type.startsWith('image/')) {
      alert(t.admin.noticeNew.imageOnly);
      return;
    }

    setUploadingImage(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch("/api/notices/upload-image", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();
      
      // 마크다운 형식으로 이미지 삽입
      const imageMarkdown = `\n![${file.name}](${data.url})\n`;
      const textarea = document.getElementById('content') as HTMLTextAreaElement;
      const cursorPosition = textarea?.selectionStart || formData.content.length;
      const newContent = 
        formData.content.slice(0, cursorPosition) + 
        imageMarkdown + 
        formData.content.slice(cursorPosition);
      
      setFormData({ ...formData, content: newContent });
      
      // 커서 위치 업데이트
      setTimeout(() => {
        if (textarea) {
          const newPosition = cursorPosition + imageMarkdown.length;
          textarea.setSelectionRange(newPosition, newPosition);
          textarea.focus();
        }
      }, 0);
      alert(t.admin.noticeNew.imageUploadSuccess);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert(error.message || t.admin.noticeNew.imageUploadFailed);
    } finally {
      setUploadingImage(false);
      // input 초기화
      e.target.value = '';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    );
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
                href="/admin/notice"
                className="text-sm sm:text-base text-primary-600 hover:text-primary-700"
              >
                {t.admin.noticeNew.backToList}
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{t.admin.noticeNew.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.admin.noticeNew.form.title} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t.admin.noticeNew.form.titlePlaceholder}
                required
              />
            </div>

            {/* 작성자 */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.admin.noticeNew.form.author}
              </label>
              <input
                type="text"
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t.admin.noticeNew.form.authorPlaceholder}
              />
            </div>

            {/* 내용 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.admin.noticeNew.form.content} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`px-3 py-1.5 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingImage ? t.admin.noticeNew.form.uploading : t.admin.noticeNew.form.imageInsert}
                  </label>
                </div>
              </div>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t.admin.noticeNew.form.contentPlaceholder}
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t.admin.noticeNew.form.imageTip}
              </p>
            </div>

            {/* 중요 공지 고정 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_pinned"
                checked={formData.is_pinned}
                onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="is_pinned" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t.admin.noticeNew.form.pin}
              </label>
            </div>

            {/* 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
              <Link
                href="/admin/notice"
                className="px-4 sm:px-6 py-2 text-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
              >
                {t.admin.noticeNew.form.cancel}
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {saving ? t.admin.noticeNew.form.saving : t.admin.noticeNew.form.save}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

