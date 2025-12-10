# 브리티시 스픽 웹사이트

브리티시 스픽 공식 웹사이트 프로젝트입니다.  
포트폴리오 목적의 프로젝트로, 최신 웹 기술 스택을 활용하여 학원 정보 제공 및 관리 시스템을 구축했습니다.

## 프로젝트 개요

- **목적**: 학원의 온라인 브랜드 이미지 구축 및 학원 정보 제공
- **특징**: 무료 티어 서비스를 활용한 포트폴리오 프로젝트
- **진행률**: 약 95% 완료
- **주소**: 서울특별시 강남구 역삼로3길 17-6

## 기술 스택

### Frontend
- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **이미지 처리**: Next.js Image 컴포넌트
- **다국어 지원**: React Context 기반 i18n (한국어/영어)

### Backend
- **API**: Next.js API Routes
- **데이터베이스**: Supabase (PostgreSQL)
- **파일 저장소**: Supabase Storage
- **인증**: Supabase Auth (JWT 기반)

### 외부 서비스
- **지도**: 카카오맵 JavaScript API
- **배포**: Vercel
- **CDN**: Vercel Edge Network

## 주요 기능

### 1. 홈페이지
- 학원 소개 섹션 (비전, 교육 철학, 주요 특징)
- 주요 프로그램 소개 (4가지 프로그램)
- 카카오맵 연동 (학원 위치 표시)
- 연락처 정보 (전화, 이메일, 운영 시간)
- 반응형 디자인
- 스크롤 최상단 버튼

### 2. 갤러리
- 사진 갤러리 (카테고리별 분류: 수업, 이벤트, 체험활동, 기타)
- 이미지 상세 보기 (모달)
- 카테고리 필터링
- 관리자 이미지 업로드/삭제/수정
- 이미지 순서 변경
- 업로드 시 카테고리 지정 가능

### 3. 공지사항 게시판
- 공지사항 목록 (검색, 페이지네이션)
- 공지사항 상세 보기
- 중요 공지 상단 고정
- 관리자 작성/수정/삭제
- 공지사항 내용에 이미지 삽입 (마크다운 형식)
- 조회수 기능

### 4. 관리자 시스템
- Supabase Auth 기반 로그인
- 관리자 대시보드
- 갤러리 관리 (업로드, 수정, 삭제, 순서 변경)
- 공지사항 관리 (작성, 수정, 삭제, 고정)
- 문의하기 관리 (조회, 상태 변경, 삭제)
- 권한 관리 및 라우트 보호
- 전체 페이지 반응형 웹 적용

### 5. 문의하기
- 문의 폼 (이름, 이메일, 전화번호, 제목, 내용)
- Supabase에 문의사항 저장
- 연락처 정보 및 운영 시간 표시
- 관리자 페이지에서 문의사항 조회 및 관리
- 상태 관리 (대기중, 처리중, 완료)

### 6. 다국어 지원
- 한국어/영어 전환 기능
- 모든 페이지 및 관리자 페이지 지원
- 언어 토글 버튼 (헤더 우측 상단)
- 브라우저 로컬 스토리지에 언어 설정 저장

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/dhchun1203/British-Speak.git
cd british_speak
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 환경 변수를 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 카카오맵 API
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key
```

> **참고**: 
> - Supabase 설정 방법은 `docs/SUPABASE_SETUP.md`를 참고하세요.
> - 카카오맵 API 설정 방법은 `docs/KAKAO_MAP_SETUP.md`를 참고하세요.

### 4. Supabase 데이터베이스 설정

다음 테이블들을 Supabase에서 생성해야 합니다:

- `gallery` - 갤러리 이미지 저장
- `notices` - 공지사항 저장
- `inquiries` - 문의사항 저장

각 테이블 생성 가이드는 `docs/` 폴더에 있습니다:
- `docs/SUPABASE_SETUP.md` - 갤러리 테이블
- `docs/NOTICE_TABLE_SETUP.md` - 공지사항 테이블
- `docs/INQUIRY_TABLE_SETUP.md` - 문의사항 테이블

> **중요**: 문의사항 상태 값 업데이트가 필요한 경우 `docs/UPDATE_INQUIRY_STATUS.md`를 참고하세요.

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
/
├── app/                      # Next.js App Router
│   ├── admin/               # 관리자 페이지
│   │   ├── login/           # 로그인
│   │   ├── dashboard/       # 대시보드
│   │   ├── gallery/         # 갤러리 관리
│   │   ├── notice/          # 공지사항 관리
│   │   │   ├── new/         # 공지사항 작성
│   │   │   └── [id]/edit/   # 공지사항 수정
│   │   └── inquiries/       # 문의하기 관리
│   ├── api/                 # API Routes
│   │   ├── gallery/         # 갤러리 API
│   │   ├── notices/        # 공지사항 API
│   │   │   └── upload-image/ # 이미지 업로드 API
│   │   └── inquiries/      # 문의사항 API
│   ├── contact/             # 문의하기 페이지
│   ├── gallery/             # 갤러리 페이지
│   ├── notice/              # 공지사항 페이지
│   │   └── [id]/            # 공지사항 상세
│   └── page.tsx              # 홈페이지
├── components/              # React 컴포넌트
│   ├── gallery/            # 갤러리 컴포넌트
│   │   ├── CategoryFilter.tsx
│   │   ├── GalleryGrid.tsx
│   │   └── ImageModal.tsx
│   ├── home/               # 홈페이지 섹션
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Hero.tsx
│   │   ├── Location.tsx
│   │   └── Programs.tsx
│   ├── layout/             # 레이아웃 컴포넌트
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── ScrollToTop.tsx
│   └── providers/          # Context Provider
│       └── I18nProvider.tsx
├── lib/                    # 유틸리티 함수
│   ├── i18n/              # 다국어 지원
│   │   ├── context.tsx    # i18n Context
│   │   └── translations.ts # 번역 데이터
│   └── supabase/          # Supabase 클라이언트
│       ├── client.ts      # 클라이언트 사이드
│       └── server.ts      # 서버 사이드
├── types/                  # TypeScript 타입 정의
│   ├── gallery.ts
│   └── notice.ts
├── docs/                   # 문서
│   ├── SUPABASE_SETUP.md
│   ├── NOTICE_TABLE_SETUP.md
│   ├── INQUIRY_TABLE_SETUP.md
│   ├── KAKAO_MAP_SETUP.md
│   ├── UPDATE_INQUIRY_STATUS.md
│   ├── VERCEL_DEPLOY.md
│   └── ...
└── PROJECT_PLAN.md         # 프로젝트 기획서
```

## 개발 진행 상황

### 완료된 작업

- ✅ **Phase 1**: 기본 구조 및 홈페이지 (100%)
  - 프로젝트 초기 설정
  - 레이아웃 컴포넌트 (Header, Footer)
  - 홈페이지 섹션 (Hero, About, Programs, Location, Contact)
  - 반응형 디자인 적용

- ✅ **Phase 2**: 갤러리 기능 (100%)
  - 갤러리 페이지 UI 구현
  - 이미지 목록 조회 및 카테고리 필터링
  - 이미지 상세 보기 (모달)
  - 관리자 이미지 업로드/삭제/수정
  - 이미지 순서 변경
  - 업로드 시 카테고리 지정 기능

- ✅ **Phase 3**: 공지사항 게시판 (100%)
  - 공지사항 목록 (검색, 페이지네이션)
  - 공지사항 상세 보기
  - 중요 공지 상단 고정
  - 관리자 작성/수정/삭제
  - 공지사항 내용에 이미지 삽입

- ✅ **Phase 4**: 관리자 시스템 (100%)
  - Supabase Auth 기반 로그인
  - 관리자 대시보드
  - 권한 관리 및 라우트 보호
  - 세션 관리 및 인증 확인
  - 전체 관리자 페이지 반응형 웹 적용

- ✅ **Phase 5**: 문의하기 페이지 (100%)
  - 문의 폼 구현
  - Supabase에 문의사항 저장
  - 관리자 페이지에서 문의사항 조회 및 관리
  - 상태 관리 (대기중, 처리중, 완료)

- ✅ **추가 기능**: 다국어 지원 (100%)
  - 한국어/영어 전환 기능
  - 모든 페이지 및 관리자 페이지 지원
  - 언어 토글 버튼

- ✅ **추가 기능**: 카카오맵 연동 (100%)
  - 카카오맵 JavaScript API 연동
  - 학원 위치 표시
  - 마커 및 정보창

- ✅ **추가 기능**: UI/UX 개선 (100%)
  - 스크롤 최상단 버튼
  - 반응형 웹 디자인 개선
  - 관리자 페이지 반응형 적용

### 남은 작업

- ⏳ **Phase 6**: 최적화 및 배포
  - 성능 최적화 (이미지 최적화, 코드 스플리팅)
  - SEO 최적화 (메타 태그, sitemap)
  - 에러 처리 및 로깅 개선
  - 테스트 (기능 테스트, 반응형 테스트)

## 주요 문서

- `PROJECT_PLAN.md` - 프로젝트 기획서 및 전체 진행 상황
- `docs/SUPABASE_SETUP.md` - Supabase 연동 가이드
- `docs/NOTICE_TABLE_SETUP.md` - 공지사항 테이블 생성 가이드
- `docs/INQUIRY_TABLE_SETUP.md` - 문의사항 테이블 생성 가이드
- `docs/KAKAO_MAP_SETUP.md` - 카카오맵 API 설정 가이드
- `docs/UPDATE_INQUIRY_STATUS.md` - 문의사항 상태 값 업데이트 가이드
- `docs/VERCEL_DEPLOY.md` - Vercel 배포 가이드

## 배포

### Vercel 배포

1. GitHub 저장소에 코드 푸시
2. [Vercel](https://vercel.com)에 로그인
3. "New Project" 클릭 후 GitHub 저장소 연결
4. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_KAKAO_MAP_API_KEY`
5. "Deploy" 클릭하여 자동 배포

> **참고**: 자세한 배포 가이드는 `docs/VERCEL_DEPLOY.md`를 참고하세요.

## 주요 특징

### 반응형 디자인
- 모바일, 태블릿, 데스크톱 완벽 지원
- 모든 페이지 및 관리자 페이지 반응형 적용
- 모바일 우선 디자인 접근

### 다국어 지원
- 한국어/영어 전환 기능
- React Context 기반 i18n 구현
- 브라우저 로컬 스토리지에 언어 설정 저장
- 모든 페이지 및 관리자 페이지 지원

### 관리자 기능
- Supabase Auth 기반 안전한 인증
- 갤러리, 공지사항, 문의하기 통합 관리
- 실시간 상태 관리
- 반응형 관리자 인터페이스

### 사용자 경험
- 직관적인 네비게이션
- 빠른 페이지 로딩
- 부드러운 애니메이션
- 접근성 고려

## 라이선스

이 프로젝트는 포트폴리오 목적으로 제작되었습니다.

## 작성자

브리티시 스픽 웹사이트 프로젝트

---

**버전**: 2.0  
**최종 업데이트**: 2024년 12월
