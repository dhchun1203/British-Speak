# 공지사항 테이블 생성 가이드

Supabase에서 공지사항 테이블을 생성하는 방법입니다.

## 1. SQL Editor 열기

1. Supabase 대시보드에서 좌측 사이드바의 **"SQL Editor"** 클릭
2. **"New query"** 버튼 클릭

## 2. 공지사항 테이블 생성 SQL 실행

다음 SQL을 복사하여 붙여넣고 실행합니다:

```sql
-- 공지사항 테이블 생성
CREATE TABLE notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL DEFAULT '관리자',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  attachments JSONB DEFAULT '[]'::jsonb
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX idx_notices_is_pinned ON notices(is_pinned DESC, created_at DESC);
CREATE INDEX idx_notices_title ON notices(title);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 활성화
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 공지사항 읽기 가능 (공개)
CREATE POLICY "Public notices are viewable by everyone"
  ON notices FOR SELECT
  USING (true);

-- 관리자만 공지사항 추가/수정/삭제 가능 (개발 단계에서는 모든 사용자 허용)
CREATE POLICY "Notices are insertable by authenticated users"
  ON notices FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Notices are updatable by authenticated users"
  ON notices FOR UPDATE
  USING (true);

CREATE POLICY "Notices are deletable by authenticated users"
  ON notices FOR DELETE
  USING (true);
```

## 3. 테이블 확인

1. 좌측 사이드바에서 **"Table Editor"** 클릭
2. `notices` 테이블이 생성되었는지 확인

## 4. 테스트 데이터 추가 (선택사항)

테스트를 위해 샘플 데이터를 추가할 수 있습니다:

```sql
-- 테스트 공지사항 추가
INSERT INTO notices (title, content, author, is_pinned) VALUES
('환영합니다!', '영국 스피킹 아카데미에 오신 것을 환영합니다.', '관리자', true),
('2024년 봄 학기 안내', '2024년 봄 학기 수강 신청 안내입니다.', '관리자', false),
('영어 발표회 일정 안내', '다음 주 영어 발표회 일정을 안내드립니다.', '관리자', false);
```

## 완료!

이제 공지사항 테이블이 준비되었습니다. 다음 단계로 진행하세요!




