"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Line,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Section from "./_components/Section";
import Container from "./_components/Container";
import PageHeader from "./_components/PageHeader";
import StatCard from "./_components/StatCard";
import Panel from "./_components/Panel";
import { Bell, Image as ImageIcon, Mail, MessageSquare, Users, Eye, Calendar } from "lucide-react";

const statCardLinkClass =
  "block rounded-2xl transition-[box-shadow,transform] duration-300 ease-out hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white";

const DEVICE_LEGEND_LABELS: Record<string, string> = {
  desktop: "PC",
  mobile: "모바일",
  tablet: "태블릿",
  unknown: "기타",
};

function DeviceChartLegend(props: { payload?: { value: string; color: string }[] }) {
  const payload = props.payload;
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
      {payload.map((entry) => (
        <span
          key={entry.value}
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50/80 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm"
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {DEVICE_LEGEND_LABELS[entry.value] ?? entry.value}
        </span>
      ))}
    </div>
  );
}

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
        <div className="space-y-10 pb-8">
          <PageHeader title="Dashboard" description="관리자 현황을 한눈에 확인하세요." />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
            <div className="flex flex-col gap-4 mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">방문자 추이</h2>
              <div className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-500">시작일</label>
                  <input
                    type="date"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm transition-colors placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
                <span className="flex items-center pb-2.5 text-sm font-medium text-neutral-400">~</span>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-500">종료일</label>
                  <input
                    type="date"
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm transition-colors placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyVisitRange}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white active:bg-primary-800"
                >
                  <Calendar className="h-4 w-4 shrink-0" />
                  조회
                </button>
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={(data?.visitsByDay ?? []).map((d) => ({
                    ...d,
                    dateLabel: `${d.date.slice(5, 7)}/${d.date.slice(8, 10)}`,
                  }))}
                  margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
                >
                  <defs>
                    <linearGradient id="visitAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      padding: "10px 14px",
                      fontSize: "13px",
                      backgroundColor: "#fff",
                    }}
                    labelStyle={{ color: "#111827", fontWeight: 600 }}
                    itemStyle={{ color: "#374151" }}
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
                    cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "12px" }}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (value === "count" ? "일별 방문" : "누적 (기간 내)")}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    fill="url(#visitAreaGradient)"
                    stroke="none"
                    hide
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    name="count"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dot={{ r: 4, fill: "#fff", strokeWidth: 2, stroke: "#2563eb" }}
                    activeDot={{ r: 5, fill: "#fff", strokeWidth: 2, stroke: "#2563eb" }}
                    connectNulls
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cumulative"
                    name="cumulative"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dot={{ r: 3, fill: "#fff", strokeWidth: 1.5, stroke: "#64748b" }}
                    activeDot={{ r: 4, fill: "#fff", strokeWidth: 1.5, stroke: "#64748b" }}
                    connectNulls
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* 접속 기기별 방문 추이 */}
          <Panel className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">접속 기기별 방문 추이</h2>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(data?.visitsByDay ?? []).map((d) => ({
                    ...d,
                    dateLabel: `${d.date.slice(5, 7)}/${d.date.slice(8, 10)}`,
                  }))}
                  margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
                  barCategoryGap="12%"
                  barGap={0}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      padding: "10px 14px",
                      fontSize: "13px",
                      backgroundColor: "#fff",
                    }}
                    labelStyle={{ color: "#111827", fontWeight: 600 }}
                    itemStyle={{ color: "#374151" }}
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
                    cursor={{ fill: "#f3f4f6", fillOpacity: 0.5 }}
                  />
                  <Legend content={<DeviceChartLegend />} />
                  <Bar dataKey="desktop" name="desktop" fill="#2563eb" stackId="device" radius={[0, 0, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="mobile" name="mobile" fill="#10b981" stackId="device" radius={[0, 0, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="tablet" name="tablet" fill="#f59e0b" stackId="device" radius={[0, 0, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="unknown" name="unknown" fill="#94a3b8" stackId="device" radius={[0, 0, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-8">
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
