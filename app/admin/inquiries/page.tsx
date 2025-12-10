"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminInquiriesPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchInquiries();
    }
  }, [authenticated, page, search, statusFilter]);

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

  async function fetchInquiries() {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/inquiries?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch inquiries");
      
      const data = await response.json();
      setInquiries(data.inquiries || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t.admin.inquiries.detail.deleteConfirm)) {
      return;
    }

    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete inquiry");
      }

      await fetchInquiries();
      alert(t.admin.inquiries.detail.deleteSuccess);
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert(t.admin.inquiries.detail.deleteFailed);
    }
  }

  async function handleStatusUpdate(id: string, newStatus: string) {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Status update error:", errorData);
        throw new Error(errorData.error || "Failed to update status");
      }

      await fetchInquiries();
      alert(t.admin.inquiries.detail.statusUpdateSuccess);
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert(error.message || t.admin.inquiries.detail.statusUpdateFailed);
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return t.admin.inquiries.statusPending;
      case 'in_progress':
        return t.admin.inquiries.statusInProgress;
      case 'completed':
        return t.admin.inquiries.statusCompleted;
      default:
        return status;
    }
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-primary-600 hover:text-primary-700"
              >
                {t.admin.inquiries.backToDashboard}
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">{t.admin.inquiries.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder={t.admin.inquiries.searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{t.admin.inquiries.statusAll}</option>
              <option value="pending">{t.admin.inquiries.statusPending}</option>
              <option value="in_progress">{t.admin.inquiries.statusInProgress}</option>
              <option value="completed">{t.admin.inquiries.statusCompleted}</option>
            </select>
          </div>
        </div>

        {/* 문의사항 목록 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
          {inquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {search || statusFilter ? t.admin.inquiries.noResults : t.admin.inquiries.noInquiries}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.admin.inquiries.table.name}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.admin.inquiries.table.email}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.admin.inquiries.table.phone}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.admin.inquiries.table.subject}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.admin.inquiries.table.status}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.admin.inquiries.table.createdAt}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t.admin.inquiries.table.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inquiry.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inquiry.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inquiry.phone || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate" title={inquiry.subject}>
                            {inquiry.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleStatusUpdate(inquiry.id, e.target.value)}
                            className={`px-2 py-1 text-xs rounded-md border-0 ${getStatusColor(inquiry.status)} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                          >
                            <option value="pending">{t.admin.inquiries.statusPending}</option>
                            <option value="in_progress">{t.admin.inquiries.statusInProgress}</option>
                            <option value="completed">{t.admin.inquiries.statusCompleted}</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                const modal = document.getElementById(`modal-${inquiry.id}`) as HTMLDialogElement;
                                if (modal) {
                                  modal.showModal();
                                  // 모달 배경 클릭 시 닫기
                                  modal.addEventListener('click', (e) => {
                                    if (e.target === modal) {
                                      modal.close();
                                    }
                                  });
                                }
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {t.admin.inquiries.table.view}
                            </button>
                            <button
                              onClick={() => handleDelete(inquiry.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              {t.admin.inquiries.table.delete}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 상세보기 모달 */}
              {inquiries.map((inquiry) => (
                <dialog
                  key={inquiry.id}
                  id={`modal-${inquiry.id}`}
                  className="fixed inset-0 z-50 w-full max-w-2xl mx-auto my-auto bg-white rounded-lg shadow-xl p-6 backdrop:bg-black backdrop:opacity-50"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{t.admin.inquiries.detail.title}</h3>
                      <button
                        onClick={() => {
                          const modal = document.getElementById(`modal-${inquiry.id}`) as HTMLDialogElement;
                          modal?.close();
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.inquiries.detail.info.name}</label>
                        <p className="text-gray-900">{inquiry.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.inquiries.detail.info.email}</label>
                        <p className="text-gray-900">{inquiry.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.inquiries.detail.info.phone}</label>
                        <p className="text-gray-900">{inquiry.phone || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.inquiries.detail.info.subject}</label>
                        <p className="text-gray-900">{inquiry.subject}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.inquiries.detail.info.message}</label>
                        <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">{inquiry.message}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.inquiries.detail.info.status}</label>
                        <select
                          value={inquiry.status}
                          onChange={(e) => {
                            handleStatusUpdate(inquiry.id, e.target.value);
                            const modal = document.getElementById(`modal-${inquiry.id}`) as HTMLDialogElement;
                            modal?.close();
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="pending">{t.admin.inquiries.statusPending}</option>
                          <option value="in_progress">{t.admin.inquiries.statusInProgress}</option>
                          <option value="completed">{t.admin.inquiries.statusCompleted}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t.admin.inquiries.detail.info.createdAt}</label>
                        <p className="text-gray-900">{new Date(inquiry.created_at).toLocaleString('ko-KR')}</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => {
                          const modal = document.getElementById(`modal-${inquiry.id}`) as HTMLDialogElement;
                          modal?.close();
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        {t.common.close}
                      </button>
                    </div>
                  </div>
                </dialog>
              ))}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {t.admin.inquiries.pagination.showing
                      .replace('{total}', total.toString())
                      .replace('{start}', (((page - 1) * pageSize) + 1).toString())
                      .replace('{end}', Math.min(page * pageSize, total).toString())}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      {t.admin.inquiries.pagination.previous}
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      {t.admin.inquiries.pagination.next}
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

