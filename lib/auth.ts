import { createServerClient } from './supabase/server';
import { cookies } from 'next/headers';

export interface User {
  id: string;
  email: string;
  role?: string;
}

/**
 * 서버 사이드에서 현재 사용자 정보 가져오기
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      role: (user.user_metadata?.role as string) || undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * 관리자 권한 확인
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin' || false;
}

/**
 * 클라이언트 사이드에서 사용할 인증 유틸리티
 */
export function createClientAuth() {
  const { supabase } = require('./supabase/client');
  return supabase;
}













