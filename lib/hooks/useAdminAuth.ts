import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface UseAdminAuthReturn {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
}

const ALLOWED_EMAILS = ['dhchun1203@gmail.com'];

/**
 * 관리자 인증을 확인하는 커스텀 훅
 * 여러 관리자 페이지에서 공통으로 사용되는 인증 로직을 추출
 */
export function useAdminAuth(): UseAdminAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setAuthenticated(false);
        router.push("/admin/login");
      } else if (event === 'SIGNED_IN' && session?.user) {
        verifyAdmin(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  async function checkAuth() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/admin/login");
        setLoading(false);
        return;
      }

      await verifyAdmin(user);
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/admin/login");
      setLoading(false);
    }
  }

  async function verifyAdmin(currentUser: User) {
    try {
      const userRole = currentUser.user_metadata?.role || currentUser.app_metadata?.role;
      const emailContainsAdmin = currentUser.email?.toLowerCase().includes('admin');
      const isAllowedEmail = ALLOWED_EMAILS.includes(currentUser.email?.toLowerCase() || '');
      
      const isAdmin = userRole === 'admin' || emailContainsAdmin || isAllowedEmail;

      if (!isAdmin) {
        await supabase.auth.signOut();
        router.push("/admin/login");
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error("Verify admin error:", error);
      router.push("/admin/login");
      setLoading(false);
    }
  }

  return { user, loading, authenticated };
}

