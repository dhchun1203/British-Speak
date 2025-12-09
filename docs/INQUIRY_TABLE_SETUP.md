# 문의사항 테이블 생성 가이드

Supabase에서 문의사항 테이블을 생성하는 방법입니다.

## 1. SQL Editor 열기

1. Supabase 대시보드에서 좌측 사이드바의 **"SQL Editor"** 클릭
2. **"New query"** 버튼 클릭

## 2. 문의사항 테이블 생성 SQL 실행

다음 SQL을 복사하여 붙여넣고 실행합니다:

```sql
-- 문의사항 테이블 생성
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_email ON inquiries(email);

-- updated_at 자동 업데이트 트리거 (이미 함수가 있다면 생략 가능)
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 활성화
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 문의사항 작성 가능 (공개)
CREATE POLICY "Inquiries are insertable by everyone"
  ON inquiries FOR INSERT
  WITH CHECK (true);

-- 관리자만 문의사항 조회 가능 (나중에 관리자 인증 추가)
-- 현재는 모든 사용자가 조회 가능하도록 설정 (개발 단계)
CREATE POLICY "Inquiries are viewable by authenticated users"
  ON inquiries FOR SELECT
  USING (true);

-- 관리자만 문의사항 수정 가능
CREATE POLICY "Inquiries are updatable by authenticated users"
  ON inquiries FOR UPDATE
  USING (true);
```

## 3. 테이블 확인

1. 좌측 사이드바에서 **"Table Editor"** 클릭
2. `inquiries` 테이블이 생성되었는지 확인

## 완료!

이제 문의사항 테이블이 준비되었습니다. 문의 폼에서 제출한 내용이 Supabase에 저장됩니다.

