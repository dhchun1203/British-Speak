# 문의사항 상태 값 업데이트 가이드

현재 데이터베이스의 `inquiries` 테이블은 `('pending', 'read', 'replied', 'closed')` 상태만 허용하지만, 관리자 페이지에서는 `('pending', 'in_progress', 'completed')`를 사용합니다.

## 해결 방법

### 옵션 1: 데이터베이스 스키마 업데이트 (권장)

Supabase SQL Editor에서 다음 SQL을 실행하여 check constraint를 업데이트합니다:

```sql
-- 기존 check constraint 제거
ALTER TABLE inquiries DROP CONSTRAINT IF EXISTS inquiries_status_check;

-- 새로운 check constraint 추가 (pending, in_progress, completed)
ALTER TABLE inquiries ADD CONSTRAINT inquiries_status_check 
  CHECK (status IN ('pending', 'in_progress', 'completed'));

-- 기존 데이터 마이그레이션 (선택사항)
-- read -> in_progress
UPDATE inquiries SET status = 'in_progress' WHERE status = 'read';

-- replied -> completed
UPDATE inquiries SET status = 'completed' WHERE status = 'replied';

-- closed -> completed
UPDATE inquiries SET status = 'completed' WHERE status = 'closed';
```

### 옵션 2: 코드를 기존 스키마에 맞게 수정

데이터베이스 스키마를 변경하지 않고 코드만 수정하려면, 관리자 페이지의 상태 값을 `pending`, `read`, `replied`, `closed`로 변경해야 합니다.

## 권장 사항

**옵션 1을 권장합니다.** `in_progress`와 `completed`가 더 직관적이고 명확합니다.

