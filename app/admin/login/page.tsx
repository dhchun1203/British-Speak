"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        // 사용자 정보 디버깅
        console.log("User data:", data.user);
        console.log("User metadata:", data.user.user_metadata);
        console.log("Raw app meta data:", data.user.app_metadata);
        
        // 관리자 권한 확인
        // user_metadata 또는 app_metadata에서 role 확인
        const userRole = data.user.user_metadata?.role || data.user.app_metadata?.role;
        const emailContainsAdmin = email.toLowerCase().includes('admin');
        
        // 개발 단계: 특정 이메일 허용 (임시)
        const allowedEmails = ['dhchun1203@gmail.com']; // 개발용 - 나중에 제거
        const isAllowedEmail = allowedEmails.includes(email.toLowerCase());
        
        console.log("User data:", data.user);
        console.log("User metadata:", data.user.user_metadata);
        console.log("User role:", userRole);
        console.log("Email contains admin:", emailContainsAdmin);
        console.log("Is allowed email:", isAllowedEmail);
        
        if (userRole === 'admin' || emailContainsAdmin || isAllowedEmail) {
          // 관리자 대시보드로 이동
          console.log("Redirecting to dashboard...");
          
          // 세션이 완전히 저장될 때까지 약간의 지연
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // router.push 대신 window.location을 사용하여 확실한 리다이렉트
          window.location.href = "/admin";
        } else {
          // 일반 사용자는 로그아웃
          await supabase.auth.signOut();
          setError(
            t.admin.login.noPermission + " " +
            "Supabase에서 raw_user_meta_data에 role: 'admin'을 추가하세요. " +
            "docs/QUICK_FIX_ADMIN_ROLE.md 참고"
          );
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || t.admin.login.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t.admin.login.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            {t.admin.login.subtitle}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t.admin.login.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder={t.admin.login.emailPlaceholder}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t.admin.login.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder={t.admin.login.passwordPlaceholder}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t.admin.login.loggingIn : t.admin.login.loginButton}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {t.admin.login.backToHome}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

