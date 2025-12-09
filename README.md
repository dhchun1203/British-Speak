# 영국 스피킹 아카데미 웹사이트

영국 스피킹 아카데미 공식 웹사이트 프로젝트입니다.  
포트폴리오 목적의 프로젝트로, 최신 웹 기술 스택을 활용하여 학원 정보 제공 및 관리 시스템을 구축했습니다.

## 프로젝트 개요

- **목적**: 학원의 온라인 브랜드 이미지 구축 및 학원 정보 제공
- **특징**: 무료 티어 서비스를 활용한 포트폴리오 프로젝트
- **진행률**: 약 90% 완료

## 기술 스택

### Frontend
- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **이미지 처리**: Next.js Image 컴포넌트

### Backend
- **API**: Next.js API Routes
- **데이터베이스**: Supabase (PostgreSQL)
- **파일 저장소**: Supabase Storage
- **인증**: Supabase Auth (JWT 기반)

### 배포 및 인프라
- **프론트엔드 배포**: Vercel
- **CDN**: Vercel Edge Network
- **데이터베이스**: Supabase (무료 티어)

## 주요 기능

### 1. 홈페이지
- 학원 소개 섹션
- 주요 프로그램 소개
- 연락처 정보
- 반응형 디자인

### 2. 갤러리
- 사진 갤러리 (카테고리별 분류)
- 이미지 상세 보기 (모달)
- 관리자 이미지 업로드/삭제/수정
- 이미지 순서 변경

### 3. 공지사항 게시판
- 공지사항 목록 (검색, 페이지네이션)
- 공지사항 상세 보기
- 중요 공지 상단 고정
- 관리자 작성/수정/삭제
- 공지사항 내용에 이미지 삽입

### 4. 관리자 시스템
- Supabase Auth 기반 로그인
- 관리자 대시보드
- 갤러리 관리
- 공지사항 관리
- 권한 관리 및 라우트 보호

### 5. 문의하기
- 문의 폼 (이름, 이메일, 전화번호, 제목, 내용)
- Supabase에 문의사항 저장
- 연락처 정보 및 운영 시간 표시

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/YOUR_USERNAME/british-speak-academy.git
cd british-speak-academy
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

# 카카오맵 API (선택사항, 나중에 사용 예정)
# NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key
```

> **참고**: Supabase 설정 방법은 `docs/SUPABASE_SETUP.md`를 참고하세요.

### 4. Supabase 데이터베이스 설정

다음 테이블들을 Supabase에서 생성해야 합니다:

- `gallery` - 갤러리 이미지 저장
- `notices` - 공지사항 저장
- `inquiries` - 문의사항 저장

각 테이블 생성 가이드는 `docs/` 폴더에 있습니다:
- `docs/SUPABASE_SETUP.md` - 갤러리 테이블
- `docs/NOTICE_TABLE_SETUP.md` - 공지사항 테이블
- `docs/INQUIRY_TABLE_SETUP.md` - 문의사항 테이블

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
│   │   ├── dashboard/      # 대시보드
│   │   ├── gallery/        # 갤러리 관리
│   │   └── notice/         # 공지사항 관리
│   ├── api/                # API Routes
│   │   ├── gallery/        # 갤러리 API
│   │   ├── notices/        # 공지사항 API
│   │   └── inquiries/      # 문의사항 API
│   ├── contact/            # 문의하기 페이지
│   ├── gallery/            # 갤러리 페이지
│   ├── notice/             # 공지사항 페이지
│   └── page.tsx            # 홈페이지
├── components/             # React 컴포넌트
│   ├── gallery/           # 갤러리 컴포넌트
│   ├── home/              # 홈페이지 섹션
│   └── layout/            # 레이아웃 컴포넌트
├── lib/                   # 유틸리티 함수
│   └── supabase/          # Supabase 클라이언트
├── docs/                  # 문서
│   ├── SUPABASE_SETUP.md
│   ├── NOTICE_TABLE_SETUP.md
│   ├── INQUIRY_TABLE_SETUP.md
│   └── ...
└── PROJECT_PLAN.md        # 프로젝트 기획서
```

## 개발 진행 상황

### 완료된 작업

- **Phase 1**: 기본 구조 및 홈페이지 (100%)
- **Phase 2**: 갤러리 기능 (100%)
- **Phase 3**: 공지사항 게시판 (100%)
- **Phase 4**: 관리자 시스템 (100%)
- **Phase 5**: 문의하기 페이지 (100%)

### 남은 작업

- **Phase 6**: 최적화 및 배포
  - 성능 최적화 (이미지 최적화, 코드 스플리팅)
  - SEO 최적화 (메타 태그, sitemap)
  - 에러 처리 및 로깅
  - 테스트 (기능 테스트, 반응형 테스트)
  - 프로덕션 배포

### 향후 계획

- 카카오맵 API 연동
- 관리자 페이지에서 문의사항 조회 기능

## 주요 문서

- `PROJECT_PLAN.md` - 프로젝트 기획서 및 전체 진행 상황
- `docs/SUPABASE_SETUP.md` - Supabase 연동 가이드
- `docs/ADMIN_AUTH_SETUP.md` - 관리자 인증 설정 가이드
- `docs/NOTICE_TABLE_SETUP.md` - 공지사항 테이블 생성 가이드
- `docs/INQUIRY_TABLE_SETUP.md` - 문의사항 테이블 생성 가이드

## 배포

### Vercel 배포

1. GitHub 저장소에 코드 푸시
2. [Vercel](https://vercel.com)에 로그인
3. "New Project" 클릭 후 GitHub 저장소 연결
4. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. "Deploy" 클릭하여 자동 배포

## 라이선스

이 프로젝트는 포트폴리오 목적으로 제작되었습니다.

## 작성자

영국 스피킹 아카데미 웹사이트 프로젝트

---

**버전**: 1.2  
**최종 업데이트**: 2024년
