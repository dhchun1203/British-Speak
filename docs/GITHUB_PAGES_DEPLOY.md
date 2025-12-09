# GitHub Pages 배포 가이드

이 프로젝트를 GitHub Pages에 배포하는 방법입니다.

## 중요 사항

GitHub Pages는 정적 사이트만 호스팅할 수 있으므로:
- ✅ Next.js를 정적 사이트로 export
- ✅ API Routes는 클라이언트 사이드 Supabase 호출로 변경됨
- ❌ 서버 사이드 기능은 사용 불가 (이미 클라이언트 사이드로 변경 완료)

## 사전 준비

1. GitHub 저장소 생성 및 코드 푸시
2. Supabase 환경 변수 준비

## 배포 단계

### 1. GitHub 저장소 설정

1. GitHub 저장소로 이동
2. **Settings** → **Pages** 메뉴 클릭
3. **Source**에서 **GitHub Actions** 선택
4. 저장

### 2. GitHub Secrets 설정

환경 변수를 GitHub Secrets에 추가해야 합니다:

1. 저장소 **Settings** → **Secrets and variables** → **Actions** 클릭
2. **New repository secret** 클릭하여 다음 변수 추가:

   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key

> **참고**: `SUPABASE_SERVICE_ROLE_KEY`는 클라이언트 사이드에서 사용하지 않으므로 필요 없습니다.

### 3. basePath 설정 (선택사항)

GitHub Pages는 기본적으로 `https://username.github.io/repository-name` 형식의 URL을 사용합니다.

저장소 이름이 `British-Speak`인 경우, `next.config.mjs`에서 주석을 해제하세요:

```javascript
basePath: process.env.NODE_ENV === 'production' ? '/British-Speak' : '',
trailingSlash: true,
```

> **참고**: 커스텀 도메인을 사용하는 경우 basePath는 필요 없습니다.

### 4. 자동 배포

1. `main` 브랜치에 코드를 푸시하면 자동으로 배포가 시작됩니다
2. **Actions** 탭에서 배포 진행 상황을 확인할 수 있습니다
3. 배포가 완료되면 **Settings** → **Pages**에서 사이트 URL을 확인할 수 있습니다

## 배포 확인

배포가 완료되면 다음 URL로 접속할 수 있습니다:
- `https://YOUR_USERNAME.github.io/British-Speak` (basePath 사용 시)
- 또는 커스텀 도메인

## 문제 해결

### 빌드 실패

- GitHub Secrets에 환경 변수가 올바르게 설정되었는지 확인
- Actions 탭에서 빌드 로그 확인

### 이미지가 표시되지 않음

- `next.config.mjs`에서 `images.unoptimized: true` 설정 확인
- Supabase Storage의 이미지 URL이 올바른지 확인

### Supabase 연결 오류

- 브라우저 콘솔에서 환경 변수가 올바르게 로드되는지 확인
- Supabase RLS 정책이 공개 읽기를 허용하는지 확인

## 로컬에서 테스트

정적 export를 로컬에서 테스트하려면:

```bash
npm run build
npx serve out
```

또는:

```bash
npm run build
cd out
python -m http.server 3000
```

브라우저에서 `http://localhost:3000`으로 접속하여 테스트할 수 있습니다.

## 참고

- GitHub Pages는 무료로 제공되지만, 빌드 시간 제한이 있습니다
- 자동 배포는 `main` 브랜치에 푸시할 때마다 실행됩니다
- 커스텀 도메인을 사용할 수 있습니다

