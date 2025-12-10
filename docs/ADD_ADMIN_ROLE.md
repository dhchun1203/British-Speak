# 관리자 역할 추가 가이드

Supabase 사용자에게 관리자 역할(`role: admin`)을 추가하는 방법입니다.

## 현재 사용자 정보

```json
{
  "raw_user_meta_data": {
    "email_verified": true
  }
}
```

## 방법 1: Supabase 대시보드에서 직접 수정 (가장 간단)

### 단계별 가이드

1. **Authentication** > **Users** 메뉴로 이동
2. 해당 사용자 (dhchun1203@gmail.com) 클릭
3. **"User Metadata"** 섹션 찾기
4. **"raw_user_meta_data"** 필드 확인
5. 현재 값:
   ```json
   {
     "email_verified": true
   }
   ```
6. 다음으로 수정:
   ```json
   {
     "email_verified": true,
     "role": "admin"
   }
   ```
7. **"Save"** 또는 **"Update"** 버튼 클릭

### 또는 Add metadata 사용

1. 사용자 페이지에서 **"Add metadata"** 버튼 클릭
2. **Key**: `role`
3. **Value**: `admin`
4. **"Add"** 클릭

## 방법 2: SQL Editor에서 실행 (빠른 방법)

1. Supabase 대시보드 > **SQL Editor** 클릭
2. **"New query"** 클릭
3. 다음 SQL 실행:

```sql
-- 특정 이메일 사용자에게 관리자 역할 추가
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'dhchun1203@gmail.com';
```

또는 기존 메타데이터를 유지하면서 추가:

```sql
-- 기존 메타데이터 유지하면서 role 추가
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{role}',
  '"admin"'
)
WHERE email = 'dhchun1203@gmail.com';
```

4. **"Run"** 버튼 클릭

## 방법 3: 여러 사용자에게 한번에 추가

```sql
-- 여러 이메일 사용자에게 관리자 역할 추가
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email IN (
  'dhchun1203@gmail.com',
  'admin@britishspeak.ac.kr'
);
```

## 확인 방법

업데이트 후 확인:

1. **Authentication** > **Users**에서 해당 사용자 클릭
2. **"raw_user_meta_data"** 확인:
   ```json
   {
     "email_verified": true,
     "role": "admin"
   }
   ```

또는 SQL로 확인:

```sql
SELECT 
  email,
  raw_user_meta_data
FROM auth.users
WHERE email = 'dhchun1203@gmail.com';
```

## 완료 후

역할이 추가되면:

1. 관리자 로그인 페이지 (`/admin/login`)에서 로그인
2. 로그인 성공 시 `/admin/dashboard`로 자동 이동
3. 관리자 기능 사용 가능

## 참고

- `raw_user_meta_data`는 JSONB 타입이므로 JSON 형식으로 저장됩니다
- 역할을 제거하려면 메타데이터에서 `role` 키를 삭제하면 됩니다
- 여러 역할을 추가할 수도 있습니다: `{"role": "admin", "permissions": ["read", "write"]}`






