# 영국 스피킹 아카데미 웹사이트

영국 스피킹 아카데미 공식 웹사이트 프로젝트입니다.

## 기술 스택

- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **데이터베이스**: Supabase (PostgreSQL)
- **배포**: Vercel

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 추가하세요:

```env
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   └── home/              # 홈페이지 섹션
└── PROJECT_PLAN.md       # 프로젝트 기획서
```

## 개발 단계

**Phase 1: 기본 구조 및 홈페이지** 완료 ✅

- [x] 프로젝트 초기 설정
- [x] 레이아웃 컴포넌트 (Header, Footer)
- [x] 홈페이지 기본 구조
- [x] 반응형 디자인 적용
- [ ] 카카오맵 API 연동 (나중 할일)

**다음 단계**: Phase 2 - 갤러리 기능 개발

## 배포

Vercel을 사용하여 배포합니다:

1. GitHub 저장소에 코드 푸시
2. Vercel에 프로젝트 연결
3. 환경 변수 설정
4. 자동 배포 완료

# British-Speak
