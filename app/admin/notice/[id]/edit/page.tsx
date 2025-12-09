"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Notice } from "@/types/notice";

export default function EditNoticePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "관리자",
    is_pinned: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated && id) {
      fetchNotice();
    }
  }, [authenticated, id]);

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

  async function fetchNotice() {
    try {
      const response = await fetch(`/api/notices/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          alert('공지사항을 찾을 수 없습니다.');
          router.push("/admin/notice");
          return;
        }
        throw new Error("Failed to fetch notice");
      }

      const data: Notice = await response.json();
      setNotice(data);
      setFormData({
        title: data.title,
        content: data.content,
        author: data.author,
        is_pinned: data.is_pinned,
      });
    } catch (error) {
      console.error("Error fetching notice:", error);
      alert('공지사항을 불러오는데 실패했습니다.');
      router.push("/admin/notice");
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
      const response = await fetch(`/api/notices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update notice");
      }

      const data = await response.json();
      alert('공지사항이 수정되었습니다.');
      router.push("/admin/notice");
    } catch (error: any) {
      console.error("Error updating notice:", error);
      alert(error.message || '공지사항 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !notice) {
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
              <h1 className="text-2xl font-bold text-gray-800">공지사항 수정</h1>
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

            {/* 정보 표시 */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">작성일:</span>{" "}
                  <span className="text-gray-900">
                    {new Date(notice.created_at).toLocaleString('ko-KR')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">조회수:</span>{" "}
                  <span className="text-gray-900">{notice.views || 0}</span>
                </div>
              </div>
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

