-- 푸시 알림 관련 테이블 및 정책 삭제 SQL
-- Supabase SQL Editor에서 실행하세요

-- 1. RLS 정책 삭제 (정책이 있다면)
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Authenticated users can insert subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON push_subscriptions;

-- 2. 인덱스 삭제 (인덱스가 있다면)
DROP INDEX IF EXISTS idx_push_subscriptions_user_id;
DROP INDEX IF EXISTS idx_push_subscriptions_endpoint;

-- 3. 테이블 삭제 (CASCADE 옵션으로 관련된 모든 객체 자동 삭제)
DROP TABLE IF EXISTS push_subscriptions CASCADE;

-- 확인: 테이블이 삭제되었는지 확인
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'push_subscriptions';

-- 결과가 없으면 정상적으로 삭제된 것입니다.



