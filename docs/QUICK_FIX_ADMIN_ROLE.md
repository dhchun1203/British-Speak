# 관리자 역할 빠른 추가 가이드

"관리자 권한이 없습니다" 에러를 해결하는 가장 빠른 방법입니다.

## ⚡ 빠른 해결 (SQL 사용 - 1분)

### 1단계: SQL Editor 열기

1. Supabase 대시보드 > **SQL Editor** 클릭
2. **"New query"** 버튼 클릭

### 2단계: SQL 실행

다음 SQL을 복사하여 붙여넣고, **실제 이메일로 변경**하세요:

```sql
-- dhchun1203@gmail.com 사용자에게 관리자 역할 추가
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'dhchun1203@gmail.com';
```

### 3단계: 실행 및 확인

1. **"Run"** 버튼 클릭 (또는 Ctrl+Enter)
2. 성공 메시지 확인: `Success. No rows returned`

### 4단계: 확인 쿼리 실행

다음 SQL로 role이 제대로 추가되었는지 확인:

```sql
SELECT 
  email,
  raw_user_meta_data
FROM auth.users
WHERE email = 'dhchun1203@gmail.com';
```

**예상 결과:**
```json
{
  "email_verified": true,
  "role": "admin"
}
```

### 5단계: 로그아웃 후 다시 로그인

**중요**: role을 추가한 후에는 반드시:
1. 현재 로그인되어 있다면 **완전히 로그아웃**
2. 브라우저 **새로고침** (F5 또는 Ctrl+R)
3. `/admin/login`에서 **다시 로그인**

## 🔍 문제가 계속되면

### 확인 사항

1. **SQL이 성공적으로 실행되었는지 확인**
   - "Success" 메시지가 나왔는지 확인
   - 에러 메시지가 없었는지 확인

2. **이메일 주소가 정확한지 확인**
   - SQL의 이메일 주소가 실제 사용자 이메일과 정확히 일치하는지 확인
   - 대소문자 구분 안 함

3. **브라우저 콘솔 확인**
   - F12 > Console 탭
   - 로그인 시도 후 `User metadata:` 확인
   - `role: "admin"`이 보이는지 확인

4. **캐시 지우기**
   - 브라우저 캐시 완전히 지우기
   - 또는 시크릿 모드에서 테스트

## 🛠️ 대안: 임시 해결 (개발 단계)

개발 단계에서 빠르게 테스트하려면, 로그인 코드를 임시로 수정할 수 있습니다:

특정 이메일을 관리자로 허용하도록 코드 수정 (개발용)

---

**SQL 실행 후 로그아웃 → 새로고침 → 다시 로그인**을 반드시 해주세요!




