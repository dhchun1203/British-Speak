"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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

interface VisitByDay {
  date: string;
  count: number;
  cumulative: number;
  desktop: number;
  mobile: number;
  tablet: number;
  unknown: number;
}

interface DashboardResponse {
  todayInquiries: number;
  pendingInquiries: number;
  uploadCount: number;
  totalVisits: number;
  todayVisits: number;
  visitsByDay: VisitByDay[];
  visitsRangeStart: string;
  visitsRangeEnd: string;
  recentNotices: DashboardNotice[];
  recentInquiries: DashboardInquiry[];
}

function getDefaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export default function AdminDashboardPage() {
  const { loading, authenticated } = useAdminAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [fetching, setFetching] = useState(false);
  const defaultRange = getDefaultDateRange();
  const [rangeStart, setRangeStart] = useState(defaultRange.start);
  const [rangeEnd, setRangeEnd] = useState(defaultRange.end);

  useEffect(() => {
    if (authenticated) {
      const { start, end } = getDefaultDateRange();
      fetchDashboard({ startDate: start, endDate: end });
    }
  }, [authenticated]);

  useEffect(() => {
    if (data?.visitsRangeStart != null) setRangeStart(data.visitsRangeStart);
    if (data?.visitsRangeEnd != null) setRangeEnd(data.visitsRangeEnd);
  }, [data?.visitsRangeStart, data?.visitsRangeEnd]);

  async function fetchDashboard(params?: { startDate: string; endDate: string }) {
    try {
      setFetching(true);
      const url =
        params != null
          ? `/api/admin/dashboard?startDate=${encodeURIComponent(params.startDate)}&endDate=${encodeURIComponent(params.endDate)}`
          : "/api/admin/dashboard";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard");
      }
      const result = await response.json();
      setData(result);
      if (result.visitsRangeStart != null) setRangeStart(result.visitsRangeStart);
      if (result.visitsRangeEnd != null) setRangeEnd(result.visitsRangeEnd);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setFetching(false);
    }
  }

  function applyVisitRange() {
    if (rangeStart && rangeEnd && rangeStart <= rangeEnd) {
      fetchDashboard({ startDate: rangeStart, endDate: rangeEnd });
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

          {/* 방문자 추이 (날짜 범위 선택) */}
          <Panel className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">방문자 추이</h2>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-neutral-400">~</span>
                <input
                  type="date"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={applyVisitRange}
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  조회
                </button>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={(data?.visitsByDay ?? []).map((d) => ({
                    ...d,
                    dateLabel: `${d.date.slice(5, 7)}/${d.date.slice(8, 10)}`,
                  }))}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fontSize: 12 }}
                    className="text-neutral-500"
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} className="text-neutral-500" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} className="text-neutral-500" />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e5e5" }}
                    labelFormatter={(_, payload) => {
                      const dateStr = payload?.[0]?.payload?.date;
                      if (!dateStr) return "";
                      const [y, m, day] = dateStr.split("-");
                      return `${y}년 ${parseInt(m, 10)}월 ${parseInt(day, 10)}일`;
                    }}
                    formatter={(value, name) => [
                      value ?? 0,
                      name === "count" ? "일별 방문" : "누적 (기간 내)",
                    ]}
                  />
                  <Legend
                    formatter={(value) => (value === "count" ? "일별 방문" : "누적 (기간 내)")}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    name="count"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumulative"
                    name="cumulative"
                    stroke="#64748b"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* 접속 기기별 방문 추이 */}
          <Panel className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">접속 기기별 방문 추이</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(data?.visitsByDay ?? []).map((d) => ({
                    ...d,
                    dateLabel: `${d.date.slice(5, 7)}/${d.date.slice(8, 10)}`,
                  }))}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fontSize: 12 }}
                    className="text-neutral-500"
                  />
                  <YAxis tick={{ fontSize: 12 }} className="text-neutral-500" />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e5e5e5" }}
                    labelFormatter={(_, payload) => {
                      const dateStr = payload?.[0]?.payload?.date;
                      if (!dateStr) return "";
                      const [y, m, day] = dateStr.split("-");
                      return `${y}년 ${parseInt(m, 10)}월 ${parseInt(day, 10)}일`;
                    }}
                    formatter={(value, name) => [
                      value ?? 0,
                      name === "desktop" ? "PC" : name === "mobile" ? "모바일" : name === "tablet" ? "태블릿" : "기타",
                    ]}
                  />
                  <Legend
                    formatter={(value) =>
                      value === "desktop" ? "PC" : value === "mobile" ? "모바일" : value === "tablet" ? "태블릿" : "기타"
                    }
                  />
                  <Bar dataKey="desktop" name="desktop" fill="#2563eb" stackId="device" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="mobile" name="mobile" fill="#10b981" stackId="device" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="tablet" name="tablet" fill="#f59e0b" stackId="device" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="unknown" name="unknown" fill="#94a3b8" stackId="device" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

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
