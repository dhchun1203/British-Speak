# Supabase 연동 가이드

영국 스피킹 아카데미 웹사이트 프로젝트의 Supabase 연동 가이드를 제공합니다.

## 📋 목차

1. [Supabase 계정 생성](#1-supabase-계정-생성)
2. [프로젝트 생성](#2-프로젝트-생성)
3. [데이터베이스 테이블 생성](#3-데이터베이스-테이블-생성)
4. [Storage 버킷 생성](#4-storage-버킷-생성)
5. [Next.js 프로젝트 설정](#5-nextjs-프로젝트-설정)
6. [환경 변수 설정](#6-환경-변수-설정)
7. [갤러리 기능 연동](#7-갤러리-기능-연동)

---

## 1. Supabase 계정 생성

### 1-1. Supabase 웹사이트 방문

1. [Supabase 공식 웹사이트](https://supabase.com)에 접속합니다.
2. 우측 상단의 **"Start your project"** 또는 **"Sign In"** 버튼을 클릭합니다.

### 1-2. 계정 생성

- **GitHub 계정으로 로그인** (권장): GitHub 계정으로 간편하게 가입
- **이메일로 가입**: 이메일과 비밀번호를 사용하여 가입

> **참고**: 무료 티어를 사용하므로 별도의 결제 정보가 필요하지 않습니다.

---

## 2. 프로젝트 생성

### 2-1. 새 프로젝트 생성

1. 대시보드에서 **"New Project"** 버튼을 클릭합니다.
2. 프로젝트 정보를 입력합니다:
   - **Name**: `british-speak-academy` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 입력 (나중에 필요하므로 저장해두세요!)
   - **Region**: `Southeast Asia (Singapore)` 또는 가장 가까운 지역 선택
   - **Pricing Plan**: `Free` 선택

3. **"Create new project"** 버튼을 클릭합니다.

### 2-2. 프로젝트 대기

프로젝트 생성에는 약 1-2분이 소요됩니다. 완료되면 대시보드로 이동합니다.

---

## 3. 데이터베이스 테이블 생성

### 3-1. SQL Editor 열기

1. 좌측 사이드바에서 **"SQL Editor"**를 클릭합니다.
2. **"New query"** 버튼을 클릭합니다.

### 3-2. 갤러리 테이블 생성

다음 SQL을 실행하여 갤러리 테이블을 생성합니다:

```sql
-- 갤러리 테이블 생성
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT '기타',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "order" INTEGER DEFAULT 0
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_gallery_created_at ON gallery(created_at DESC);
CREATE INDEX idx_gallery_order ON gallery("order" DESC);

-- Row Level Security (RLS) 활성화
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 갤러리 읽기 가능 (공개)
CREATE POLICY "Public gallery is viewable by everyone"
  ON gallery FOR SELECT
  USING (true);

-- 관리자만 갤러리 추가/수정/삭제 가능 (나중에 관리자 인증 추가)
-- 지금은 RLS를 비활성화하거나, 모든 사용자가 쓸 수 있도록 설정 (개발 단계)
CREATE POLICY "Gallery is insertable by authenticated users"
  ON gallery FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Gallery is updatable by authenticated users"
  ON gallery FOR UPDATE
  USING (true);

CREATE POLICY "Gallery is deletable by authenticated users"
  ON gallery FOR DELETE
  USING (true);
```

> **참고**: 관리자 인증을 추가하기 전까지는 개발 단계이므로 모든 사용자가 쓰기를 할 수 있도록 설정했습니다. 프로덕션에서는 관리자만 쓸 수 있도록 수정해야 합니다.

### 3-3. 테이블 확인

1. 좌측 사이드바에서 **"Table Editor"**를 클릭합니다.
2. `gallery` 테이블이 생성되었는지 확인합니다.

---

## 4. Storage 버킷 생성

### 4-1. Storage 메뉴 열기

1. 좌측 사이드바에서 **"Storage"**를 클릭합니다.
2. **"New bucket"** 버튼을 클릭합니다.

### 4-2. 버킷 생성

버킷 정보를 입력합니다:

- **Name**: `gallery-images`
- **Public bucket**: ✅ 체크 (공개 버킷으로 설정하여 이미지 URL로 직접 접근 가능)

**"Create bucket"** 버튼을 클릭합니다.

### 4-3. Storage 정책 설정

Storage 정책은 **SQL Editor**에서 추가해야 합니다. Policies 탭에서는 GUI로만 추가할 수 있습니다.

#### 방법 1: SQL Editor 사용 (권장)

1. 좌측 사이드바에서 **"SQL Editor"**를 클릭합니다.
2. **"New query"** 버튼을 클릭합니다.
3. 다음 SQL을 복사하여 붙여넣고 실행합니다:

```sql
-- 읽기 정책: 모든 사용자가 이미지 조회 가능
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery-images' );

-- 업로드 정책: 모든 사용자가 이미지 업로드 가능 (개발 단계)
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'gallery-images' );

-- 삭제 정책: 모든 사용자가 이미지 삭제 가능 (개발 단계)
CREATE POLICY "Anyone can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'gallery-images' );
```

4. **"Run"** 버튼을 클릭하여 실행합니다.

#### 방법 2: GUI 사용 (Policies 탭)

1. 생성된 `gallery-images` 버킷을 클릭합니다.
2. **"Policies"** 탭을 클릭합니다.
3. **"New Policy"** 버튼을 클릭합니다.

각 정책을 하나씩 추가합니다:

**읽기 정책:**
- Policy name: `Public Access`
- Allowed operation: `SELECT`
- Policy definition: `bucket_id = 'gallery-images'`

**업로드 정책 (개발 단계):**
- Policy name: `Anyone can upload`
- Allowed operation: `INSERT`
- Policy definition: `bucket_id = 'gallery-images'`

**삭제 정책 (개발 단계):**
- Policy name: `Anyone can delete`
- Allowed operation: `DELETE`
- Policy definition: `bucket_id = 'gallery-images'`

> **중요**: 개발 단계에서는 모든 사용자가 업로드/삭제할 수 있도록 설정했습니다. 프로덕션에서는 관리자만 업로드/삭제할 수 있도록 변경해야 합니다.

---

## 5. Next.js 프로젝트 설정

### 5-1. Supabase 클라이언트 라이브러리 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다:

```bash
npm install @supabase/supabase-js
```

> **참고**: 이미 프로젝트에 필요한 파일들이 생성되어 있습니다. 패키지만 설치하면 됩니다.

### 5-2. Supabase 클라이언트 생성

`lib/supabase/client.ts` 파일을 생성합니다:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 5-4. 서버 사이드 클라이언트 구조

`lib/supabase/server.ts` 파일 구조 (서버 사이드에서 사용):

```typescript
import { createClient } from '@supabase/supabase-js';

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
```

---

## 6. 환경 변수 설정

### 6-1. Supabase 프로젝트 설정에서 정보 가져오기

1. Supabase 대시보드에서 좌측 사이드바의 **"Settings"** (톱니바퀴 아이콘)를 클릭합니다.
2. **"API"** 메뉴를 클릭합니다.

다음 정보를 확인합니다:

#### 새로운 API Keys 시스템 (2024년 이후)

현재 보이는 화면에서 다음 정보를 찾을 수 있습니다:

**1. Project URL 찾기:**
- Settings > **"General"** 메뉴로 이동
- 또는 API 페이지 상단에서 **"Project URL"** 확인
- 형식: `https://xxxxx.supabase.co` 또는 `https://xxxxx.supabase.in`

**2. Publishable key (공개 키):**
- 현재 화면의 **"Publishable key"** 섹션
- 값 예시: `sb_publishable_9HmFLv0y_zRuDXVceposRg_ETWc2_ec`
- 이것이 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 들어갑니다

**3. Secret key (비밀 키):**
- 현재 화면의 **"Secret keys"** 섹션
- "default" 항목의 눈 아이콘 클릭하여 키 확인
- 값 예시: `sb_secret_...` (전체 키 확인 필요)
- 이것이 `SUPABASE_SERVICE_ROLE_KEY`에 들어갑니다
- ⚠️ **주의**: 이 키는 절대 클라이언트에 노출되면 안 됩니다!

#### 레거시 API Keys 사용 (옵션)

만약 **"Legacy anon, service_role API keys"** 탭이 있다면, 거기서도 확인할 수 있습니다:
- **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 6-2. .env.local 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# 카카오맵 API (나중에 사용)
# NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key
```

실제 값으로 교체하세요!

### 6-3. .gitignore 확인

`.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인합니다 (기본적으로 포함되어 있습니다).

---

## 7. 갤러리 기능 연동

> **좋은 소식**: 갤러리 기능이 이미 Supabase와 연동되어 있습니다! 환경 변수만 설정하면 바로 작동합니다.

### 7-1. 이미 구현된 기능

- ✅ 갤러리 이미지 조회 API (`/api/gallery`)
- ✅ Supabase에서 이미지 데이터 가져오기
- ✅ 이미지 로딩 상태 처리
- ✅ 에러 처리
- ✅ 실제 이미지 표시 (Supabase Storage URL)

### 7-2. API Route 구조

`app/api/gallery/route.ts` 파일 구조:

```typescript
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('order', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}
```

### 7-3. 테스트 데이터 추가 (선택사항)

Supabase 대시보드에서 직접 테스트 데이터를 추가할 수 있습니다:

1. **Table Editor**에서 `gallery` 테이블 선택
2. **Insert row** 버튼 클릭
3. 다음 정보 입력:
   - `title`: "테스트 이미지"
   - `image_url`: Supabase Storage의 이미지 URL 또는 임시 URL
   - `category`: "수업" (또는 다른 카테고리)
   - `order`: 0

---

## 8. 테스트 및 확인

### 8-1. 개발 서버 실행

환경 변수 설정이 완료되었다면 개발 서버를 실행합니다:

```bash
npm run dev
```

### 8-2. 갤러리 페이지 확인

1. 브라우저에서 `http://localhost:3000/gallery` 접속
2. 이미지가 표시되는지 확인
3. 카테고리 필터가 작동하는지 확인
4. 이미지 클릭 시 모달이 열리는지 확인

### 8-3. 문제 해결

**이미지가 표시되지 않는 경우:**
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

**에러가 발생하는 경우:**
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 환경 변수 이름이 정확한지 확인 (대소문자 구분)
- 개발 서버를 재시작 (환경 변수 변경 후 반드시 필요)

---

## ✅ 완료 체크리스트

- [ ] Supabase 계정 생성
- [ ] 프로젝트 생성
- [ ] 갤러리 테이블 생성
- [ ] Storage 버킷 생성
- [ ] Storage 정책 설정
- [ ] Supabase 클라이언트 라이브러리 설치
- [ ] 환경 변수 설정
- [ ] 갤러리 기능 연동

---

## 🔗 유용한 링크

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript 클라이언트](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Storage 가이드](https://supabase.com/docs/guides/storage)

---

## 📝 다음 단계

### 1. 환경 변수 설정 완료
모든 환경 변수가 설정되었다면 갤러리 기능이 바로 작동합니다!

### 2. 이미지 업로드 기능 개발
- 관리자 페이지에서 이미지 업로드 기능 구현
- Supabase Storage에 이미지 업로드
- 갤러리 테이블에 메타데이터 저장

### 3. 관리자 인증 시스템
- Supabase Auth를 사용한 관리자 로그인
- RLS (Row Level Security) 정책 업데이트

### 4. 프로덕션 배포
- Vercel에 환경 변수 설정
- 프로덕션 환경에서 테스트

---

## 🎉 완료!

Supabase 연동이 완료되었습니다. 이제 갤러리 기능을 사용할 수 있습니다!

추가 질문이나 문제가 발생하면 프로젝트 이슈에 등록하거나 문서를 참고하세요.

