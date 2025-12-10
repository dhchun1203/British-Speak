# Vercel 배포 가이드

이 프로젝트를 Vercel에 배포하는 방법입니다.

## Vercel의 장점

- ✅ Next.js와 완벽 호환
- ✅ API Routes 자동 지원 (Serverless Functions)
- ✅ 관리자 페이지의 모든 기능 사용 가능
- ✅ 무료 티어 제공
- ✅ GitHub 연동으로 자동 배포
- ✅ 자동 HTTPS 및 글로벌 CDN

## 배포 단계

### 1. Vercel 계정 생성

1. [Vercel 웹사이트](https://vercel.com)에 접속
2. **Sign Up** 클릭
3. **Continue with GitHub** 선택하여 GitHub 계정으로 로그인

### 2. 프로젝트 가져오기

1. Vercel 대시보드에서 **Add New...** → **Project** 클릭
2. GitHub 저장소 목록에서 `British-Speak` (또는 저장소 이름) 선택
3. **Import** 클릭

### 3. 프로젝트 설정

#### Framework Preset
- **Framework Preset**: Next.js (자동 감지됨)

#### Build and Output Settings
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값, 변경 불필요)
- **Install Command**: `npm install` (기본값)

#### Root Directory
- **Root Directory**: `./` (기본값, 변경 불필요)

### 4. 환경 변수 설정

**Environment Variables** 섹션에서 다음 환경 변수를 추가합니다:

1. **Add** 버튼 클릭
2. 각 환경 변수 추가:

   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
     - **Value**: Supabase 프로젝트 URL
     - **Environment**: Production, Preview, Development 모두 선택

   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **Value**: Supabase Anon Key
     - **Environment**: Production, Preview, Development 모두 선택

   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
     - **Value**: Supabase Service Role Key
     - **Environment**: Production, Preview, Development 모두 선택
     - ⚠️ **주의**: 이 키는 서버 사이드에서만 사용되며, 클라이언트에 노출되면 안 됩니다.

   - **Name**: `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (푸시 알림용)
     - **Value**: VAPID 공개키 (VAPID 키 생성 방법은 `docs/PUSH_NOTIFICATION_SETUP.md` 참고)
     - **Environment**: Production, Preview, Development 모두 선택

   - **Name**: `VAPID_PRIVATE_KEY` (푸시 알림용)
     - **Value**: VAPID 비공개키
     - **Environment**: Production, Preview, Development 모두 선택
     - ⚠️ **주의**: 이 키는 서버 사이드에서만 사용되며, 클라이언트에 노출되면 안 됩니다.

   - **Name**: `VAPID_EMAIL` (푸시 알림용)
     - **Value**: `mailto:admin@britishspeak.ac.kr` (또는 관리자 이메일)
     - **Environment**: Production, Preview, Development 모두 선택

   - **Name**: `NEXT_PUBLIC_KAKAO_MAP_API_KEY` (카카오맵 사용 시)
     - **Value**: 카카오맵 API 키
     - **Environment**: Production, Preview, Development 모두 선택

#### 환경 변수 확인 방법

**Supabase에서 확인:**
1. Supabase 대시보드 접속
2. **Settings** → **API** 메뉴 클릭
3. 다음 정보 확인:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`에 사용
   - **Publishable key** 또는 **anon/public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 사용
   - **Secret key** 또는 **service_role key**: `SUPABASE_SERVICE_ROLE_KEY`에 사용

### 5. 배포 실행

1. 모든 설정이 완료되면 **Deploy** 버튼 클릭
2. 배포 진행 상황을 실시간으로 확인할 수 있습니다
3. 배포가 완료되면 자동으로 URL이 생성됩니다

## 배포 후 확인

### 배포 완료 후

1. Vercel 대시보드에서 생성된 URL 확인
   - 형식: `https://british-speak-xxxxx.vercel.app`
   - 또는 커스텀 도메인 설정 가능

2. 사이트 접속하여 기능 확인:
   - ✅ 홈페이지
   - ✅ 갤러리
   - ✅ 공지사항 목록/상세
   - ✅ 문의하기
   - ✅ 관리자 로그인 및 관리 기능

### 자동 배포 설정

GitHub 저장소에 코드를 푸시하면 자동으로 재배포됩니다:

1. `main` 브랜치에 푸시 → Production 배포
2. 다른 브랜치에 푸시 → Preview 배포 (임시 URL 생성)

## 커스텀 도메인 설정 (선택사항)

1. Vercel 프로젝트 설정에서 **Domains** 메뉴 클릭
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 도메인 제공업체에서 설정
4. 자동으로 HTTPS 인증서 발급

## 문제 해결

### 빌드 실패

- 환경 변수가 올바르게 설정되었는지 확인
- Vercel 대시보드의 **Deployments** 탭에서 빌드 로그 확인
- 로컬에서 `npm run build`가 성공하는지 확인

### API Routes 작동 안 함

- `SUPABASE_SERVICE_ROLE_KEY`가 설정되었는지 확인
- Vercel Functions 로그 확인 (프로젝트 → **Functions** 탭)

### 이미지가 표시되지 않음

- Supabase Storage의 이미지 URL이 올바른지 확인
- `next.config.mjs`의 `remotePatterns` 설정 확인

## 참고

- Vercel 무료 티어 제한:
  - 월 100GB 대역폭
  - 무제한 요청 (합리적 사용)
  - Serverless Functions 실행 시간 제한
- 포트폴리오 프로젝트에는 충분한 무료 티어입니다.

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)



