# 관리자 인증 시스템 설정 가이드

Supabase Auth를 사용한 관리자 로그인 시스템 설정 방법입니다.

## 1. Supabase Auth 설정

### 1-1. Email 프로바이더 활성화

1. Supabase 대시보드에서 좌측 사이드바의 **"Authentication"** 클릭
2. **"Configuration"** 섹션에서 **"Sign In / Providers"** 클릭
3. **"Email"** 섹션 확인
4. **"Enable Email provider"** 토글이 **켜져 있는지** 확인
   - 꺼져 있다면 토글을 클릭하여 활성화
5. **"Confirm email"** 설정 확인:
   - 개발 단계: **OFF** (이메일 확인 없이 바로 사용 가능)
   - 프로덕션: **ON** (이메일 확인 필요)

### 1-2. Email 설정 확인 (선택사항)

1. **Authentication** > **NOTIFICATIONS** > **"Email"** 클릭
2. 이메일 템플릿 확인 (기본 템플릿 사용 가능)
3. 프로덕션에서는 **"SMTP Settings"** 탭에서 커스텀 SMTP 설정 권장

### 1-2. 관리자 계정 생성

관리자 계정은 두 가지 방법으로 생성할 수 있습니다:

#### 방법 1: Supabase 대시보드에서 직접 생성 (권장)

1. **Authentication** > **Users** 메뉴 클릭
2. **"Add user"** 또는 **"Invite user"** 버튼 클릭
3. 관리자 정보 입력:
   - **Email**: 관리자 이메일 (예: admin@britishspeak.ac.kr)
   - **Password**: 강력한 비밀번호
   - **Auto Confirm User**: ✅ 체크 (이메일 확인 없이 바로 사용 가능)
4. **"Create user"** 클릭

#### 방법 2: 앱에서 회원가입 후 수동 승인

1. 앱에서 관리자로 사용할 이메일로 회원가입
2. Supabase 대시보드 > **Authentication** > **Users**에서 해당 사용자 확인
3. 필요시 **"Confirm email"** 클릭하여 이메일 확인

### 1-3. 관리자 역할 설정 (필수)

관리자와 일반 사용자를 구분하기 위해 사용자 메타데이터에 `role: admin`을 추가해야 합니다.

#### 방법 1: Supabase 대시보드에서 직접 수정 (권장)

1. **Authentication** > **Users**에서 관리자 사용자 클릭
2. **"User Metadata"** 섹션에서 **"raw_user_meta_data"** 확인
3. 현재 값에 `role: admin` 추가:
   ```json
   {
     "email_verified": true,
     "role": "admin"
   }
   ```
4. 또는 **"Add metadata"** 버튼 클릭:
   - **Key**: `role`
   - **Value**: `admin`
5. **"Save"** 클릭

#### 방법 2: SQL Editor에서 실행 (빠른 방법)

1. **SQL Editor** > **New query** 클릭
2. 다음 SQL 실행 (실제 이메일로 변경):

```sql
-- 기존 메타데이터 유지하면서 role 추가
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'your-admin-email@gmail.com';
```

3. **"Run"** 버튼 클릭

> **참고**: 자세한 방법은 `docs/ADD_ADMIN_ROLE.md` 파일을 참고하세요.

## 2. RLS 정책 업데이트

관리자만 데이터를 수정/삭제할 수 있도록 RLS 정책을 업데이트합니다.

### 2-1. 갤러리 테이블 정책 업데이트

SQL Editor에서 다음 SQL 실행:

```sql
-- 기존 정책 삭제 (개발 단계에서 생성한 것)
DROP POLICY IF EXISTS "Gallery is insertable by authenticated users" ON gallery;
DROP POLICY IF EXISTS "Gallery is updatable by authenticated users" ON gallery;
DROP POLICY IF EXISTS "Gallery is deletable by authenticated users" ON gallery;

-- 관리자만 갤러리 추가/수정/삭제 가능
CREATE POLICY "Only admins can insert gallery"
  ON gallery FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );

CREATE POLICY "Only admins can update gallery"
  ON gallery FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );

CREATE POLICY "Only admins can delete gallery"
  ON gallery FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );
```

### 2-2. 공지사항 테이블 정책 업데이트

```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Notices are insertable by authenticated users" ON notices;
DROP POLICY IF EXISTS "Notices are updatable by authenticated users" ON notices;
DROP POLICY IF EXISTS "Notices are deletable by authenticated users" ON notices;

-- 관리자만 공지사항 추가/수정/삭제 가능
CREATE POLICY "Only admins can insert notices"
  ON notices FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );

CREATE POLICY "Only admins can update notices"
  ON notices FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );

CREATE POLICY "Only admins can delete notices"
  ON notices FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
    )
  );
```

### 2-3. Storage 정책 업데이트

```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Anyone can upload" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete" ON storage.objects;

-- 관리자만 이미지 업로드/삭제 가능
CREATE POLICY "Only admins can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery-images'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
  )
);

CREATE POLICY "Only admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery-images'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
  )
);
```

## 3. 개발 단계 (간단한 인증)

프로덕션 전까지는 간단한 인증 방식을 사용할 수 있습니다:

- 모든 인증된 사용자가 관리자 권한을 가짐
- 또는 특정 이메일 주소만 관리자로 인식

이 방식은 나중에 더 정교한 권한 시스템으로 업그레이드할 수 있습니다.

## 완료!

이제 관리자 인증 시스템이 준비되었습니다. 다음 단계로 관리자 로그인 페이지를 구현하세요.

