# British Speak Academy - 웹사이트 프로젝트

> **프리랜서 포트폴리오 프로젝트**  
> 최신 웹 기술 스택을 활용한 교육 기관 웹사이트 및 관리 시스템 구축

## 기술 스택

### Frontend
| 기술 | 버전 | 선택 이유 |
|------|------|-----------|
| **Next.js** | 14+ | App Router를 활용한 최신 SSR/SSG, 서버리스 함수 지원 |
| **TypeScript** | 5.5+ | 타입 안정성으로 런타임 에러 방지 및 코드 품질 향상 |
| **Tailwind CSS** | 3.4+ | 유틸리티 퍼스트 CSS로 빠른 개발 및 일관된 디자인 |
| **React** | 18.3+ | 컴포넌트 기반 UI 개발 및 상태 관리 |

### Backend & Database
| 기술 | 용도 | 특징 |
|------|------|------|
| **Next.js API Routes** | RESTful API | 서버리스 함수로 자동 스케일링 |
| **Supabase (PostgreSQL)** | 데이터베이스 | 실시간 기능, 인증 시스템 내장, 무료 티어 활용 |
| **Supabase Storage** | 파일 저장소 | 이미지 업로드 및 CDN 제공 |
| **Supabase Auth** | 인증 시스템 | JWT 기반 안전한 인증 및 세션 관리 |

### 외부 서비스 & 배포
- **카카오맵 API**: 위치 정보 시각화
- **Vercel**: 프론트엔드 배포 및 서버리스 함수 호스팅
- **Supabase**: 백엔드 인프라 (DB, Storage, Auth)
- **Google Generative AI**: AI 챗봇 기능

### 개발 도구
- **ESLint**: 코드 품질 관리
- **TypeScript**: 정적 타입 검사
- **Git**: 버전 관리

---

## 주요 기능

### 1. 사용자 페이지

#### 홈페이지
- **Hero 섹션**: 시각적 임팩트를 위한 그라데이션 배경 및 애니메이션
- **학원 소개**: 비전, 교육 철학, 주요 특징 소개
- **프로그램 소개**: 4가지 교육 프로그램 카드 레이아웃 (SVG 아이콘)
- **위치 정보**: 카카오맵 API 연동으로 위치 시각화
- **연락처 정보**: 전화, 이메일, 운영 시간 표시

#### 갤러리
- 카테고리별 이미지 분류 (수업, 이벤트, 체험활동, 기타)
- 이미지 모달 뷰어 (확대/축소)
- 반응형 그리드 레이아웃
- 이미지 로딩 최적화

#### 공지사항 게시판
- 공지사항 목록 (검색, 페이지네이션)
- 중요 공지 상단 고정 기능
- 마크다운 형식 이미지 삽입 지원
- 조회수 추적

#### 문의하기
- 문의 폼 (이름, 이메일, 전화번호, 제목, 내용)
- 실시간 폼 검증
- 문의 상태 관리 (대기중, 처리중, 완료)

#### AI 챗봇
- Google Generative AI 기반 상담 챗봇
- 다국어 대화 지원 (한국어/영어 자동 감지)
- 대화 기록 관리
- 모바일 최적화된 플로팅 UI

### 2. 관리자 시스템

#### 인증 및 권한 관리
- Supabase Auth 기반 안전한 로그인
- JWT 토큰 기반 세션 관리
- 라우트 보호 (미인증 사용자 접근 차단)
- 관리자 권한 검증

#### 관리자 대시보드
- 통합 관리 인터페이스
- 갤러리, 공지사항, 문의하기 통합 관리
- 반응형 관리자 UI

#### 갤러리 관리
- 이미지 업로드 (다중 선택)
- 이미지 정보 수정 (제목, 카테고리)
- 이미지 삭제
- 드래그 앤 드롭 순서 변경

#### 공지사항 관리
- 공지사항 작성/수정/삭제
- 중요 공지 고정/해제
- 이미지 업로드 및 마크다운 삽입
- 실시간 미리보기

#### 문의하기 관리
- 문의사항 목록 조회 (검색, 필터링)
- 문의 상태 변경 (대기중 → 처리중 → 완료)
- 문의 상세 정보 확인
- 문의 삭제

### 3. 공통 기능

#### 다국어 지원 (i18n)
- 한국어/영어 전환 기능
- React Context 기반 구현
- 로컬 스토리지에 언어 설정 저장
- 모든 페이지 및 관리자 페이지 지원

#### 반응형 디자인
- 모바일 우선 접근법
- 브레이크포인트: sm (640px), md (768px), lg (1024px)
- 모든 페이지 및 관리자 페이지 반응형 적용
- 터치 친화적 UI/UX

#### 다크 모드 지원
- 시스템 설정 감지
- 수동 테마 전환
- 로컬 스토리지에 테마 설정 저장
- 모든 컴포넌트 다크 모드 지원

#### UI/UX 개선
- 스크롤 애니메이션 (ScrollAnimation 컴포넌트)
- Breadcrumb 네비게이션
- 스크롤 최상단 버튼
- 로딩 스피너 및 에러 바운더리
- 부드러운 페이지 전환 애니메이션

---

## 프로젝트 구조

```
british_speak/
├── app/                          # Next.js App Router
│   ├── admin/                    # 관리자 페이지
│   │   ├── dashboard/            # 대시보드
│   │   ├── gallery/              # 갤러리 관리
│   │   ├── notice/               # 공지사항 관리
│   │   └── inquiries/            # 문의하기 관리
│   ├── api/                      # API Routes
│   │   ├── gallery/              # 갤러리 API
│   │   ├── notices/              # 공지사항 API
│   │   ├── inquiries/            # 문의사항 API
│   │   └── chat/                 # 챗봇 API
│   ├── gallery/                  # 갤러리 페이지
│   ├── notice/                   # 공지사항 페이지
│   ├── contact/                  # 문의하기 페이지
│   └── page.tsx                  # 홈페이지
│
├── components/                   # React 컴포넌트
│   ├── chat/                     # 챗봇 컴포넌트
│   ├── common/                   # 공통 컴포넌트
│   ├── gallery/                  # 갤러리 컴포넌트
│   ├── home/                     # 홈페이지 섹션
│   ├── layout/                   # 레이아웃 컴포넌트
│   └── providers/                # Context Provider
│
├── lib/                          # 유틸리티 및 설정
│   ├── hooks/                    # 커스텀 훅
│   ├── i18n/                     # 다국어 지원
│   ├── supabase/                 # Supabase 클라이언트
│   └── utils/                    # 유틸리티 함수
│
├── types/                        # TypeScript 타입 정의
├── docs/                         # 프로젝트 문서
└── public/                       # 정적 파일
```

---

## 시작하기

### 사전 요구사항
- Node.js 18+ 
- npm 또는 yarn
- Supabase 계정
- 카카오맵 API 키 (선택사항)

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/dhchun1203/British-Speak.git
cd british_speak
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 카카오맵 API (선택사항)
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_map_api_key

# Google Generative AI (챗봇용)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
```

4. **Supabase 데이터베이스 설정**
- `gallery` 테이블 생성
- `notices` 테이블 생성
- `inquiries` 테이블 생성
- Storage 버킷 생성 (이미지 업로드용)

자세한 설정 방법은 `docs/` 폴더의 문서를 참고하세요.

5. **개발 서버 실행**
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

---

## 주요 구현 내용 및 기술적 도전과제

### 1. 성능 최적화
- **코드 스플리팅**: 동적 import를 활용한 컴포넌트 지연 로딩
- **이미지 최적화**: Next.js Image 컴포넌트 활용
- **서버 사이드 렌더링**: SEO 및 초기 로딩 속도 개선

### 2. 타입 안정성
- TypeScript를 활용한 엄격한 타입 검사
- 모든 API 응답 및 컴포넌트 props 타입 정의
- `any` 타입 최소화로 런타임 에러 방지

### 3. 인증 및 보안
- Supabase Auth를 활용한 안전한 인증 시스템
- JWT 토큰 기반 세션 관리
- 라우트 보호 및 권한 검증
- 서비스 롤 키를 통한 안전한 서버 사이드 API 호출

### 4. 상태 관리
- React Context를 활용한 전역 상태 관리 (i18n, Theme)
- 커스텀 훅을 통한 로직 재사용 (`useAdminAuth`, `useI18n`)
- 로컬 스토리지를 활용한 사용자 설정 저장

### 5. 모바일 최적화
- 모바일에서 input 포커스 시 자동 확대 방지 (font-size 16px 이상)
- 터치 친화적 UI/UX
- 반응형 디자인으로 모든 기기 지원

### 6. 에러 처리
- ErrorBoundary를 활용한 React 에러 처리
- API 에러 핸들링 및 사용자 친화적 에러 메시지
- 로딩 상태 관리

---

## 개발 과정

### 프로젝트 단계별 진행
1. **기획 및 설계** (1주)
   - 요구사항 분석
   - 기술 스택 선정
   - 데이터베이스 스키마 설계

2. **프론트엔드 개발** (3주)
   - 레이아웃 및 공통 컴포넌트
   - 홈페이지 섹션 구현
   - 갤러리, 공지사항, 문의하기 페이지

3. **백엔드 및 API 개발** (2주)
   - Supabase 연동
   - API Routes 구현
   - 인증 시스템 구축

4. **관리자 시스템** (2주)
   - 관리자 대시보드
   - CRUD 기능 구현
   - 권한 관리

5. **최적화 및 배포** (1주)
   - 성능 최적화
   - 에러 처리 개선
   - 배포 및 테스트

### 개발 중 해결한 주요 문제
- **모바일 자동 확대 문제**: input 필드 font-size를 16px 이상으로 설정하여 해결
- **다크 모드 텍스트 가시성**: 인라인 스타일로 명시적 색상 지정
- **이미지 업로드 최적화**: Supabase Storage와 연동하여 효율적인 파일 관리
- **다국어 지원**: Context API를 활용한 확장 가능한 i18n 시스템 구축

---

## 프로젝트 하이라이트

### 기술적 역량
- **풀스택 개발**: 프론트엔드부터 백엔드, 데이터베이스까지 통합 구현
- **최신 기술 스택**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **클라우드 서비스 활용**: Vercel, Supabase를 활용한 서버리스 아키텍처
- **AI 통합**: Google Generative AI를 활용한 챗봇 기능

### 프로젝트 관리
- **체계적인 개발**: 단계별 개발 및 문서화
- **코드 품질**: TypeScript, ESLint를 활용한 코드 품질 관리
- **버전 관리**: Git을 활용한 체계적인 버전 관리
- **배포 자동화**: Vercel과 GitHub 연동으로 CI/CD 구축

### 사용자 경험
- **반응형 디자인**: 모든 기기에서 완벽한 사용자 경험
- **다국어 지원**: 글로벌 사용자 대응
- **접근성**: 키보드 네비게이션, 스크린 리더 지원
- **성능**: 빠른 로딩 속도 및 부드러운 애니메이션

---

## 문서

프로젝트의 상세한 문서는 `docs/` 폴더에서 확인할 수 있습니다:

- `SUPABASE_SETUP.md` - Supabase 연동 가이드
- `NOTICE_TABLE_SETUP.md` - 공지사항 테이블 설정
- `INQUIRY_TABLE_SETUP.md` - 문의하기 테이블 설정
- `KAKAO_MAP_SETUP.md` - 카카오맵 API 설정
- `VERCEL_DEPLOY.md` - Vercel 배포 가이드
- `PROJECT_PLAN.md` - 프로젝트 기획서

---

## 배포 정보

### 배포 현황
- **프론트엔드**: Vercel에 배포 완료
- **백엔드**: Supabase (PostgreSQL, Storage, Auth)
- **도메인**: Vercel 제공 도메인 또는 커스텀 도메인

### 배포 환경
- **프로덕션 환경**: Vercel Production
- **데이터베이스**: Supabase PostgreSQL
- **파일 저장소**: Supabase Storage
- **CDN**: Vercel Edge Network

---

## 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 린팅
npm run lint
```

---

## 라이선스

이 프로젝트는 포트폴리오 목적으로 제작되었습니다.

---

## 연락처

프로젝트에 대한 문의사항이나 협업 제안이 있으시면 언제든지 연락주세요.

- **GitHub**: [@dhchun1203](https://github.com/dhchun1203)
- **프로젝트 저장소**: [British-Speak](https://github.com/dhchun1203/British-Speak)

---

## 감사의 말

이 프로젝트를 통해 최신 웹 기술 스택을 학습하고 실무 역량을 향상시킬 수 있었습니다.  
프리랜서로서 클라이언트의 요구사항을 정확히 이해하고 구현하는 능력을 보여주기 위해 노력했습니다.

---

**버전**: 2.2  
**최종 업데이트**: 2025년 1월  
**배포 상태**: 프로덕션 배포 완료  
**프로젝트 상태**: 완료
