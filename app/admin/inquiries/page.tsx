"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Section from "../_components/Section";
import Container from "../_components/Container";
import PageHeader from "../_components/PageHeader";
import Panel from "../_components/Panel";

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

function AdminInquiriesContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const { loading, authenticated } = useAdminAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(() =>
    searchParams.get("status") === "pending" ? "pending" : ""
  );
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  // URL의 status 쿼리와 필터 동기화 (탑바/사이드바 등 다른 진입 경로 대응)
  useEffect(() => {
    const status = searchParams.get("status");
    setStatusFilter(status === "pending" ? "pending" : "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    if (authenticated) {
      fetchInquiries();
    }
  }, [authenticated, page, search, statusFilter]);

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
      case 'read': // 기존 스키마 호환성
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'replied': // 기존 스키마 호환성
      case 'closed': // 기존 스키마 호환성
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
      case 'read': // 기존 스키마 호환성
        return t.admin.inquiries.statusInProgress;
      case 'completed':
      case 'replied': // 기존 스키마 호환성
      case 'closed': // 기존 스키마 호환성
        return t.admin.inquiries.statusCompleted;
      default:
        return status;
    }
  };

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
            title={t.admin.inquiries.title}
            back={
              <Link
                href="/admin"
                className="inline-flex items-center text-xs font-medium text-neutral-500 transition-colors hover:text-primary-600"
              >
                {t.admin.inquiries.backToDashboard}
              </Link>
            }
          />

          {/* 검색 및 필터 */}
          <Panel className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder={t.admin.inquiries.searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="flex-1 px-4 py-2 border border-neutral-200 bg-white text-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-neutral-200 bg-white text-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{t.admin.inquiries.statusAll}</option>
                <option value="pending">{t.admin.inquiries.statusPending}</option>
                <option value="in_progress">{t.admin.inquiries.statusInProgress}</option>
                <option value="completed">{t.admin.inquiries.statusCompleted}</option>
              </select>
            </div>
          </Panel>

          {/* 문의사항 목록 */}
          <Panel className="flex min-h-0 flex-1 flex-col overflow-hidden w-full">
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                {search || statusFilter ? t.admin.inquiries.noResults : t.admin.inquiries.noInquiries}
              </div>
            ) : (
              <>
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="min-h-0 flex-1 overflow-auto overflow-x-auto">
                    <table className="w-full divide-y divide-neutral-200 min-w-[800px]">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          {t.admin.inquiries.table.name}
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider hidden md:table-cell">
                          {t.admin.inquiries.table.email}
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider hidden lg:table-cell">
                          {t.admin.inquiries.table.phone}
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          {t.admin.inquiries.table.subject}
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          {t.admin.inquiries.table.status}
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider hidden sm:table-cell">
                          {t.admin.inquiries.table.createdAt}
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          {t.admin.inquiries.table.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {inquiries.map((inquiry) => (
                        <tr key={inquiry.id} className="hover:bg-neutral-50">
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs text-neutral-900">
                            <div className="flex flex-col">
                              <span className="font-medium">{inquiry.name}</span>
                              <span className="text-xs text-neutral-500 md:hidden">{inquiry.email}</span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs text-neutral-900 hidden md:table-cell">
                            {inquiry.email}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs text-neutral-900 hidden lg:table-cell">
                            {inquiry.phone || '-'}
                          </td>
                          <td className="px-3 sm:px-6 py-4 text-xs text-neutral-900">
                            <div className="max-w-xs truncate" title={inquiry.subject}>
                              {inquiry.subject}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
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
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs text-neutral-500 hidden sm:table-cell">
                            {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-center text-xs font-medium">
                            <div className="flex justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenModalId(inquiry.id);
                                  document.body.style.overflow = 'hidden';
                                }}
                                className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
                              >
                                {t.admin.inquiries.table.view}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(inquiry.id)}
                                className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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

                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <div className="flex-shrink-0 bg-neutral-50 px-3 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-neutral-600 text-center sm:text-left">
                        {t.admin.inquiries.pagination.showing
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
                          {t.admin.inquiries.pagination.previous}
                        </button>
                        <span className="px-3 sm:px-4 py-2 text-xs text-neutral-600">
                          {page} / {totalPages}
                        </span>
                        <button
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="px-3 sm:px-4 py-2 border border-neutral-200 bg-white text-neutral-700 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100"
                        >
                          {t.admin.inquiries.pagination.next}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              {/* 상세보기 모달 */}
              {inquiries.map((inquiry) => {
                if (openModalId !== inquiry.id) return null;
                
                return (
                  <div
                    key={inquiry.id}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                    onClick={() => {
                      setOpenModalId(null);
                      document.body.style.overflow = 'unset';
                    }}
                  >
                    <div
                        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* 헤더 */}
                        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-neutral-200 flex-shrink-0">
                          <h3 className="text-xl font-bold text-neutral-900">{t.admin.inquiries.detail.title}</h3>
                        <button
                          onClick={() => {
                            setOpenModalId(null);
                            document.body.style.overflow = 'unset';
                          }}
                            className="text-neutral-500 hover:text-neutral-700"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* 본문 */}
                      <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">{t.admin.inquiries.detail.info.name}</label>
                            <p className="text-neutral-900">{inquiry.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">{t.admin.inquiries.detail.info.email}</label>
                            <p className="text-neutral-900">{inquiry.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">{t.admin.inquiries.detail.info.phone}</label>
                            <p className="text-neutral-900">{inquiry.phone || '-'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">{t.admin.inquiries.detail.info.subject}</label>
                            <p className="text-neutral-900">{inquiry.subject}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">{t.admin.inquiries.detail.info.message}</label>
                            <p className="text-neutral-900 whitespace-pre-wrap bg-neutral-50 p-3 rounded-md">{inquiry.message}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">{t.admin.inquiries.detail.info.status}</label>
                          <select
                            value={inquiry.status}
                            onChange={(e) => {
                              handleStatusUpdate(inquiry.id, e.target.value);
                              setOpenModalId(null);
                              document.body.style.overflow = 'unset';
                            }}
                              className="w-full px-3 py-2 border border-neutral-200 bg-white text-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="pending">{t.admin.inquiries.statusPending}</option>
                            <option value="in_progress">{t.admin.inquiries.statusInProgress}</option>
                            <option value="completed">{t.admin.inquiries.statusCompleted}</option>
                          </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">{t.admin.inquiries.detail.info.createdAt}</label>
                            <p className="text-neutral-900">{new Date(inquiry.created_at).toLocaleString('ko-KR')}</p>
                        </div>
                      </div>
                      
                      {/* 푸터 */}
                        <div className="flex justify-end p-4 sm:p-6 border-t border-neutral-200 flex-shrink-0">
                        <button
                          onClick={() => {
                            setOpenModalId(null);
                            document.body.style.overflow = 'unset';
                          }}
                            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200"
                        >
                          {t.common.close}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </>
            )}
          </Panel>
        </div>
      </Container>
    </Section>
  );
}

export default function AdminInquiriesPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminInquiriesContent />
    </Suspense>
  );
}

