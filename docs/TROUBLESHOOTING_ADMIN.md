# 관리자 권한 문제 해결 가이드

"관리자 권한이 없습니다" 에러가 발생할 때 해결 방법입니다.

## 문제 진단

### 1단계: 브라우저 콘솔 확인

1. 로그인 페이지에서 **F12** 키를 눌러 개발자 도구 열기
2. **Console** 탭 확인
3. 로그인 시도 후 다음 정보 확인:
   - `User data:` - 전체 사용자 정보
   - `User metadata:` - 사용자 메타데이터
   - `User role:` - 확인된 역할
   - `Email contains admin:` - 이메일에 'admin' 포함 여부

### 2단계: role 확인

콘솔에서 `User metadata:`를 확인하여 다음 중 하나가 있어야 합니다:

```json
{
  "role": "admin"
}
```

또는

```json
{
  "email_verified": true,
  "role": "admin"
}
```

## 해결 방법

### 방법 1: Supabase 대시보드에서 role 추가

1. **Authentication** > **Users**에서 해당 사용자 클릭
2. **"User Metadata"** 섹션 확인
3. **"raw_user_meta_data"** 필드에 다음 추가:
   ```json
   {
     "email_verified": true,
     "role": "admin"
   }
   ```
4. **"Save"** 클릭
5. **로그아웃 후 다시 로그인** (중요!)

### 방법 2: SQL로 role 추가

SQL Editor에서 실행:

```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'dhchun1203@gmail.com';
```

**중요**: SQL 실행 후 **로그아웃 후 다시 로그인**해야 합니다!

### 방법 3: 임시 해결 (개발 단계)

개발 단계에서는 이메일 기반으로 임시로 관리자 권한을 부여할 수 있습니다:

1. 로그인 코드에서 `email.includes('admin')` 조건이 이미 있음
2. 이메일을 `admin-dhchun1203@gmail.com` 같은 형식으로 변경
3. 또는 코드를 수정하여 특정 이메일을 허용

## 확인 체크리스트

- [ ] `raw_user_meta_data`에 `"role": "admin"`이 있는지 확인
- [ ] SQL 실행 후 로그아웃 후 다시 로그인했는지 확인
- [ ] 브라우저 콘솔에서 `User role: admin`이 출력되는지 확인
- [ ] 브라우저 캐시를 지우고 다시 시도

## 자주 발생하는 문제

### 문제 1: role을 추가했는데도 안 됨

**원인**: 세션이 캐시되어 있음

**해결**:
1. 완전히 로그아웃
2. 브라우저 캐시 지우기
3. 다시 로그인

### 문제 2: user_metadata가 비어있음

**원인**: role이 제대로 추가되지 않음

**해결**:
1. Supabase 대시보드에서 `raw_user_meta_data` 확인
2. SQL로 다시 실행
3. 사용자 정보 새로고침

### 문제 3: 콘솔에 role이 undefined로 나옴

**원인**: 메타데이터 경로가 잘못됨

**해결**:
- `user_metadata.role` 확인
- `app_metadata.role` 확인
- 둘 다 없으면 SQL로 다시 추가

## 디버깅 코드

로그인 페이지에서 자동으로 콘솔에 정보를 출력하도록 되어 있습니다. 
브라우저 콘솔을 열고 로그인을 시도하면 상세한 정보를 확인할 수 있습니다.

---

**여전히 문제가 있으면**: 브라우저 콘솔의 출력 내용을 확인하고, `docs/ADD_ADMIN_ROLE.md`를 참고하세요.




