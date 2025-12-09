"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function NewNoticePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "관리자",
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
      alert('제목과 내용을 입력해주세요.');
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
      alert('공지사항이 작성되었습니다.');
      router.push("/admin/notice");
    } catch (error: any) {
      console.error("Error creating notice:", error);
      alert(error.message || '공지사항 작성에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
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
      alert('이미지가 업로드되었습니다.');
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert(error.message || '이미지 업로드에 실패했습니다.');
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
                href="/admin/notice"
                className="text-primary-600 hover:text-primary-700"
              >
                ← 목록으로
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">새 공지사항 작성</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="공지사항 제목을 입력하세요"
                required
              />
            </div>

            {/* 작성자 */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                작성자
              </label>
              <input
                type="text"
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="작성자 이름"
              />
            </div>

            {/* 내용 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  내용 <span className="text-red-500">*</span>
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
                    {uploadingImage ? '업로드 중...' : '📷 이미지 삽입'}
                  </label>
                </div>
              </div>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="공지사항 내용을 입력하세요&#10;&#10;이미지를 삽입하려면 '이미지 삽입' 버튼을 클릭하세요."
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                💡 이미지 삽입 버튼을 클릭하면 마크다운 형식으로 이미지가 자동 삽입됩니다.
              </p>
            </div>

            {/* 중요 공지 고정 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_pinned"
                checked={formData.is_pinned}
                onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_pinned" className="ml-2 block text-sm text-gray-700">
                중요 공지로 상단 고정
              </label>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 justify-end">
              <Link
                href="/admin/notice"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

