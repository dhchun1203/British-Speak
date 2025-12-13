# 관리자 시스템 빠른 시작 가이드

관리자 시스템을 사용하기 위한 빠른 가이드입니다.

## 1. 관리자 계정 생성

### 방법 1: Supabase 대시보드에서 생성 (권장)

1. Supabase 대시보드 > **Authentication** > **Users** 이동
2. **"Add user"** 또는 **"Invite user"** 클릭
3. 관리자 정보 입력:
   - **Email**: 관리자 이메일 (예: `admin@britishspeak.ac.kr`)
   - **Password**: 강력한 비밀번호
   - **Auto Confirm User**: ✅ 체크
4. **"Create user"** 클릭

### 방법 2: 사용자 메타데이터 설정

관리자 권한을 부여하려면:

1. 생성된 사용자 클릭
2. **"User Metadata"** 섹션에서 다음 추가:
   ```json
   {
     "role": "admin"
   }
   ```

또는 SQL로 설정:
```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object('role', 'admin')
WHERE email = 'your-admin-email@example.com';
```

## 2. 로그인

1. 브라우저에서 `/admin/login` 접속
2. 생성한 관리자 계정으로 로그인
3. 로그인 성공 시 `/admin/dashboard`로 자동 이동

## 3. 관리자 페이지

### 대시보드
- `/admin/dashboard` - 관리자 대시보드
- 갤러리 관리, 공지사항 관리 링크 제공

### 갤러리 관리
- `/admin/gallery` - 갤러리 이미지 관리 (향후 구현)

### 공지사항 관리
- `/admin/notice` - 공지사항 작성/수정/삭제 (향후 구현)

## 4. 권한 설정 (선택사항)

관리자만 데이터를 수정할 수 있도록 RLS 정책을 업데이트하려면:

`docs/ADMIN_AUTH_SETUP.md` 파일의 SQL을 Supabase SQL Editor에서 실행하세요.

## 문제 해결

### 로그인 후 대시보드로 이동하지 않음
- 브라우저 콘솔에서 에러 확인
- Supabase 환경 변수가 올바른지 확인

### "관리자 권한이 없습니다" 에러
- 사용자 메타데이터에 `role: "admin"` 설정 확인
- 또는 이메일에 "admin"이 포함되어 있는지 확인

### 세션이 유지되지 않음
- 브라우저 쿠키 설정 확인
- 개발 서버 재시작

---

**자세한 설정 방법**: `docs/ADMIN_AUTH_SETUP.md` 참고








