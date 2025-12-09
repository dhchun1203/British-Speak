# Supabase 연동 확인 가이드

갤러리 기능이 Supabase와 제대로 연동되었는지 확인하는 가이드입니다.

## ✅ 확인 체크리스트

### 1. 환경 변수 설정 확인

`.env.local` 파일에 다음 변수가 설정되어 있는지 확인:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_secret_key
```

**확인 방법:**
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 각 변수에 실제 값이 들어있는지 확인 (플레이스홀더가 아닌)

### 2. Supabase 테이블 확인

Supabase 대시보드에서 확인:

1. **Table Editor**로 이동
2. `gallery` 테이블이 존재하는지 확인
3. 테이블 구조 확인:
   - `id` (UUID)
   - `title` (VARCHAR)
   - `image_url` (TEXT)
   - `category` (VARCHAR)
   - `created_at` (TIMESTAMP)
   - `order` (INTEGER)

### 3. 테스트 데이터 추가 (선택사항)

갤러리가 비어있으면 테스트 데이터를 추가할 수 있습니다:

1. Supabase 대시보드 > **Table Editor** > `gallery` 테이블
2. **Insert row** 클릭
3. 다음 데이터 입력:

```
title: 테스트 이미지 1
image_url: https://via.placeholder.com/800x600?text=Test+Image+1
category: 수업
order: 1
```

`id`와 `created_at`은 자동으로 생성됩니다.

### 4. 개발 서버 실행 및 확인

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/gallery` 접속

## 🔍 연동 확인 방법

### 방법 1: 브라우저에서 확인

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 `/gallery` 페이지 접속
3. 다음을 확인:

**✅ 정상인 경우:**
- 로딩 스피너가 잠깐 보이고
- 이미지가 표시되거나
- "갤러리에 이미지가 없습니다" 메시지 표시

**❌ 문제가 있는 경우:**
- "오류가 발생했습니다" 메시지 표시
- 로딩이 계속됨
- 빈 화면

### 방법 2: 브라우저 개발자 도구 확인

1. 브라우저에서 `F12` 키 누르기 (개발자 도구 열기)
2. **Console** 탭 확인
3. **Network** 탭 확인

**확인 사항:**
- `/api/gallery` 요청이 성공했는지 (200 OK)
- 에러 메시지가 없는지
- 응답 데이터가 올바른지

### 방법 3: API 엔드포인트 직접 테스트

브라우저에서 직접 API를 호출해봅니다:

```
http://localhost:3000/api/gallery
```

**예상 응답 (데이터가 없는 경우):**
```json
[]
```

**예상 응답 (데이터가 있는 경우):**
```json
[
  {
    "id": "...",
    "title": "테스트 이미지",
    "image_url": "https://...",
    "category": "수업",
    "created_at": "2024-01-01T00:00:00.000Z",
    "order": 1
  }
]
```

**에러가 발생하는 경우:**
```json
{
  "error": "Supabase is not configured. Please check SUPABASE_SETUP.md"
}
```

## 🐛 문제 해결

### 문제 1: "Supabase is not configured" 에러

**원인:** 환경 변수가 설정되지 않았거나 잘못되었습니다.

**해결 방법:**
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 환경 변수 이름과 값이 정확한지 확인
3. 개발 서버를 **재시작** (환경 변수 변경 후 반드시 필요!)

```bash
# 개발 서버 중지 (Ctrl+C)
# 다시 시작
npm run dev
```

### 문제 2: "갤러리 이미지를 불러오는데 실패했습니다" 에러

**원인:** Supabase 연결 문제 또는 테이블이 없습니다.

**해결 방법:**
1. Supabase 프로젝트가 활성화되어 있는지 확인
2. `gallery` 테이블이 생성되었는지 확인
3. 브라우저 콘솔에서 자세한 에러 메시지 확인

### 문제 3: 빈 갤러리만 표시됨

**원인:** 데이터가 없습니다 (정상입니다!)

**해결 방법:**
1. Supabase Table Editor에서 테스트 데이터 추가
2. 또는 나중에 관리자 페이지에서 이미지 업로드

### 문제 4: 이미지가 표시되지 않음

**원인:** 이미지 URL이 올바르지 않거나, Storage 정책 문제입니다.

**해결 방법:**
1. `image_url`이 유효한 URL인지 확인
2. Supabase Storage를 사용하는 경우, Storage 정책이 올바른지 확인

## ✅ 성공 기준

다음 조건을 모두 만족하면 연동이 성공한 것입니다:

- [ ] `.env.local` 파일에 환경 변수가 설정되어 있음
- [ ] 개발 서버가 정상적으로 실행됨
- [ ] `/gallery` 페이지에 접속할 수 있음
- [ ] 로딩 스피너가 나타났다가 사라짐
- [ ] 에러 메시지가 표시되지 않음
- [ ] `/api/gallery` 엔드포인트가 정상 응답 (200 OK)
- [ ] 브라우저 콘솔에 에러가 없음

## 🎉 다음 단계

연동이 확인되면:

1. ✅ Phase 2 완료!
2. 다음으로 진행: Phase 3 - 공지사항 게시판 개발
3. 또는 이미지 업로드 기능 개발 시작

---

**문제가 계속되면:** 브라우저 콘솔의 에러 메시지를 확인하고, `docs/SUPABASE_SETUP.md`를 다시 확인하세요.




