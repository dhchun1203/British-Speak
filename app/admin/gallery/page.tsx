"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { GalleryItem } from "@/types/gallery";
import { useI18n } from "@/lib/i18n/context";

export default function AdminGalleryPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState<string>(t.gallery.category4);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", category: "" });

  const categories = [t.gallery.category1, t.gallery.category2, t.gallery.category3, t.gallery.category4];

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchImages();
    }
  }, [authenticated]);

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

  async function fetchImages() {
    try {
      const response = await fetch("/api/gallery");
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert(t.admin.gallery.validation.imageOnly);
      return;
    }

    setSelectedFiles(prev => [...prev, ...imageFiles]);
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) {
      alert(t.admin.gallery.validation.selectFiles);
      return;
    }

    setUploading(true);
    const uploadResults: { success: number; failed: number } = { success: 0, failed: 0 };

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileId = `${Date.now()}-${i}`;
      
      try {
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.replace(/\.[^/.]+$/, "")); // 파일명에서 확장자 제거
        formData.append('category', uploadCategory); // 선택된 카테고리

        const response = await fetch("/api/gallery", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        uploadResults.success++;
        
        // 업로드 성공 후 목록 새로고침
        await fetchImages();
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        uploadResults.failed++;
      }
    }

    setUploading(false);
    setSelectedFiles([]);
    setUploadProgress({});
    setUploadCategory(t.gallery.category4); // 기본값으로 리셋
    
    if (uploadResults.failed === 0) {
      alert(t.admin.gallery.success.upload.replace('{count}', uploadResults.success.toString()));
    } else {
      alert(t.admin.gallery.success.uploadPartial
        .replace('{success}', uploadResults.success.toString())
        .replace('{failed}', uploadResults.failed.toString()));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t.admin.gallery.failed.deleteConfirm)) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      await fetchImages();
      alert(t.admin.gallery.success.delete);
    } catch (error) {
      console.error("Error deleting image:", error);
      alert(t.admin.gallery.failed.delete);
    }
  }

  async function handleUpdate(id: string) {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update image");
      }

      setEditingId(null);
      setEditForm({ title: "", category: "" });
      await fetchImages();
      alert(t.admin.gallery.success.update);
    } catch (error) {
      console.error("Error updating image:", error);
      alert(t.admin.gallery.failed.update);
    }
  }

  async function handleOrderChange(id: string, newOrder: number) {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: newOrder }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      await fetchImages();
    } catch (error) {
      console.error("Error updating order:", error);
      alert(t.admin.gallery.failed.orderChange);
    }
  }

  function startEdit(image: GalleryItem) {
    setEditingId(image.id);
    setEditForm({
      title: image.title,
      category: image.category,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({ title: "", category: "" });
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Link
                href="/admin/dashboard"
                className="text-sm sm:text-base text-primary-600 hover:text-primary-700"
              >
                {t.admin.gallery.backToDashboard}
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{t.admin.gallery.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 업로드 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.admin.gallery.upload.title}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.admin.gallery.upload.selectLabel}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.admin.gallery.list.edit.category}
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                disabled={uploading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {t.admin.gallery.upload.selectedFiles.replace('{count}', selectedFiles.length.toString())}
                </p>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() => removeSelectedFile(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                        disabled={uploading}
                      >
                        {t.admin.gallery.upload.remove}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? t.admin.gallery.upload.uploading : t.admin.gallery.upload.uploadButton}
            </button>
          </div>
        </div>

        {/* 이미지 목록 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t.admin.gallery.list.title.replace('{count}', images.length.toString())}
          </h2>

          {images.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t.admin.gallery.list.noImages}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {image.image_url && image.image_url.startsWith('http') ? (
                      <Image
                        src={image.image_url}
                        alt={image.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">{t.admin.gallery.list.noImage}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {editingId === image.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.admin.gallery.list.edit.title}
                          </label>
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({ ...editForm, title: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.admin.gallery.list.edit.category}
                          </label>
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({ ...editForm, category: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(image.id)}
                            className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
                          >
                            {t.admin.gallery.list.edit.save}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                          >
                            {t.admin.gallery.list.edit.cancel}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-semibold text-gray-800 mb-1">{image.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {t.admin.gallery.list.category}: {image.category}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <label className="text-sm text-gray-700">{t.admin.gallery.list.order}:</label>
                          <input
                            type="number"
                            value={image.order || 0}
                            onChange={(e) =>
                              handleOrderChange(image.id, parseInt(e.target.value) || 0)
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(image)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                          >
                            {t.admin.gallery.list.actions.edit}
                          </button>
                          <button
                            onClick={() => handleDelete(image.id)}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                          >
                            {t.admin.gallery.list.actions.delete}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
