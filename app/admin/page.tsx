"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Section from "./_components/Section";
import Container from "./_components/Container";
import PageHeader from "./_components/PageHeader";
import StatCard from "./_components/StatCard";
import Panel from "./_components/Panel";
import { Bell, Image as ImageIcon, Mail, MessageSquare, Users, Eye } from "lucide-react";

const statCardLinkClass =
  "block rounded-2xl transition-[box-shadow,transform] duration-300 ease-out hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white";

interface DashboardNotice {
  id: string;
  title: string;
  createdAt: string;
}

interface DashboardInquiry {
  id: string;
  subject: string;
  name: string;
  createdAt: string;
  status: string;
}

interface DashboardResponse {
  todayInquiries: number;
  pendingInquiries: number;
  uploadCount: number;
  totalVisits: number;
  todayVisits: number;
  recentNotices: DashboardNotice[];
  recentInquiries: DashboardInquiry[];
}

export default function AdminDashboardPage() {
  const { loading, authenticated } = useAdminAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetchDashboard();
    }
  }, [authenticated]);

  async function fetchDashboard() {
    try {
      setFetching(true);
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard");
      }
      const result = await response.json();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/4b901aa4-dae6-4afd-ba0e-961056419523',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:fetchDashboard',message:'dashboard response',data:{hasTotalVisits:typeof result?.totalVisits,totalVisits:result?.totalVisits,hasTodayVisits:typeof result?.todayVisits,todayVisits:result?.todayVisits,keys:result?Object.keys(result):[]},timestamp:Date.now(),hypothesisId:'H3-H4'})}).catch(()=>{});
      // #endregion
      setData(result);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setFetching(false);
    }
  }

  if (loading || fetching) {
    return <LoadingSpinner />;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <Section>
      <Container>
        <div className="space-y-10">
          <PageHeader title="Dashboard" description="관리자 현황을 한눈에 확인하세요." />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Link href="/admin/inquiries" className={statCardLinkClass}>
              <StatCard
                label="오늘 문의 수"
                value={data?.todayInquiries ?? 0}
                icon={<MessageSquare className="h-5 w-5" />}
              />
            </Link>
            <Link href="/admin/inquiries?status=pending" className={statCardLinkClass}>
              <StatCard
                label="미처리 문의 수"
                value={data?.pendingInquiries ?? 0}
                icon={<Mail className="h-5 w-5" />}
              />
            </Link>
            <Link href="/admin/notices" className={statCardLinkClass}>
              <StatCard
                label="최근 공지"
                value={data?.recentNotices?.length ?? 0}
                icon={<Bell className="h-5 w-5" />}
              />
            </Link>
            <Link href="/admin/gallery" className={statCardLinkClass}>
              <StatCard
                label="업로드 수"
                value={data?.uploadCount ?? 0}
                icon={<ImageIcon className="h-5 w-5" />}
              />
            </Link>
            <div className="block">
              <StatCard
                label="누적 방문자 수"
                value={data?.totalVisits ?? 0}
                icon={<Users className="h-5 w-5" />}
              />
            </div>
            <div className="block">
              <StatCard
                label="오늘 방문자 수"
                value={data?.todayVisits ?? 0}
                icon={<Eye className="h-5 w-5" />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">최근 공지</h2>
              </div>
              <div className="mt-4 space-y-3">
                {(data?.recentNotices?.length ?? 0) === 0 ? (
                  <p className="text-sm text-neutral-500">등록된 공지가 없습니다.</p>
                ) : (
                  data?.recentNotices.map((notice) => (
                    <div key={notice.id} className="flex items-center justify-between gap-3">
                      <p className="text-sm text-neutral-800 line-clamp-1">{notice.title}</p>
                      <span className="text-xs text-neutral-400">
                        {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Panel>

            <Panel className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">최근 문의</h2>
              </div>
              <div className="mt-4 space-y-3">
                {(data?.recentInquiries?.length ?? 0) === 0 ? (
                  <p className="text-sm text-neutral-500">최근 문의가 없습니다.</p>
                ) : (
                  data?.recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-neutral-800 line-clamp-1">{inquiry.subject}</p>
                        <p className="text-xs text-neutral-400">{inquiry.name}</p>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {new Date(inquiry.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </div>
        </div>
      </Container>
    </Section>
  );
}
