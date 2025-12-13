"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function Breadcrumb() {
  const pathname = usePathname();
  const { t } = useI18n();

  // 관리자 페이지는 breadcrumb 표시 안 함
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // 홈페이지는 breadcrumb 표시 안 함
  if (pathname === '/') {
    return null;
  }

  const pathSegments = pathname?.split('/').filter(Boolean) || [];
  
  const breadcrumbItems = [
    { label: t.nav.home, href: '/' },
  ];

  // 경로에 따라 breadcrumb 항목 추가
  pathSegments.forEach((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    let label = '';

    switch (segment) {
      case 'gallery':
        label = t.nav.gallery;
        break;
      case 'notice':
        label = t.nav.notice;
        break;
      case 'contact':
        label = t.nav.contact;
        break;
      default:
        // 동적 라우트인 경우 (예: notice/[id])
        if (pathSegments[index - 1] === 'notice') {
          label = t.notice.detail || '상세';
        } else {
          label = segment;
        }
    }

    breadcrumbItems.push({ label, href });
  });

  return (
    <nav className="bg-white border-b border-gray-200" aria-label="Breadcrumb">
      <div className="container mx-auto px-4 py-2">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400 mx-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-gray-700 font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

