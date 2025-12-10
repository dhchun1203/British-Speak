# 빠른 연동 확인 가이드

Supabase 연동이 제대로 되었는지 빠르게 확인하는 방법입니다.

## 1단계: 환경 변수 확인

`.env.local` 파일이 프로젝트 루트에 있고, 다음 변수들이 설정되어 있는지 확인:

```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

## 2단계: 개발 서버 실행

```bash
npm run dev
```

## 3단계: 브라우저에서 확인

1. 브라우저에서 `http://localhost:3000/gallery` 접속
2. 다음 중 하나가 표시되면 **연동 성공** ✅:
   - 갤러리 이미지들
   - "갤러리에 이미지가 없습니다" 메시지
3. 다음이 표시되면 **연동 실패** ❌:
   - "오류가 발생했습니다" 메시지
   - 로딩이 계속됨

## 4단계: API 직접 확인 (선택사항)

브라우저 주소창에 다음을 입력:

```
http://localhost:3000/api/gallery
```

**성공 시:**
- `[]` (빈 배열) 또는 이미지 데이터 배열이 표시됨

**실패 시:**
- `{"error": "..."}` 에러 메시지가 표시됨

## 문제 해결

### "Supabase is not configured" 에러
→ `.env.local` 파일 확인 및 개발 서버 재시작

### "갤러리 이미지를 불러오는데 실패했습니다" 에러
→ 브라우저 콘솔(F12)에서 자세한 에러 확인

### 빈 갤러리만 표시
→ 정상입니다! 테스트 데이터를 추가하거나 관리자 페이지에서 이미지 업로드 가능

## 다음 단계

연동이 확인되면 `docs/SUPABASE_CONNECTION_CHECK.md`를 참고하여 자세한 확인을 진행하세요.






