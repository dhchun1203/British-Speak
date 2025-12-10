# Storage 정책 설정 오류 해결 가이드

## 문제 상황

Storage Policies 탭에서 SQL을 직접 입력했을 때 다음과 같은 오류가 발생합니다:

```
Error adding policy: Failed to run sql query: ERROR: 42601: syntax error at or near "CREATE"
```

## 원인

Supabase Storage의 **Policies 탭**에서는 SQL을 직접 실행할 수 없습니다. Policies 탭은 정책을 **GUI로 추가**하거나 **기존 정책을 확인**하는 용도입니다.

## 해결 방법

### 방법 1: SQL Editor 사용 (가장 간단)

1. Supabase 대시보드에서 좌측 사이드바의 **"SQL Editor"** 클릭
2. **"New query"** 버튼 클릭
3. 다음 SQL을 전체 복사하여 붙여넣기:

```sql
-- 읽기 정책: 모든 사용자가 이미지 조회 가능
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery-images' );

-- 업로드 정책: 모든 사용자가 이미지 업로드 가능 (개발 단계)
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'gallery-images' );

-- 삭제 정책: 모든 사용자가 이미지 삭제 가능 (개발 단계)
CREATE POLICY "Anyone can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'gallery-images' );
```

4. **"Run"** 버튼 클릭 (또는 `Ctrl+Enter` / `Cmd+Enter`)
5. 성공 메시지 확인

### 방법 2: GUI 사용

1. Storage > `gallery-images` 버킷 클릭
2. **"Policies"** 탭 클릭
3. **"New Policy"** 버튼 클릭
4. **"Create a policy from scratch"** 선택
5. 각 정책을 하나씩 추가:

**읽기 정책:**
- Policy name: `Public Access`
- Allowed operation: `SELECT`
- Policy definition: `bucket_id = 'gallery-images'`

**업로드 정책:**
- Policy name: `Anyone can upload`
- Allowed operation: `INSERT`
- Policy definition: `bucket_id = 'gallery-images'`

**삭제 정책:**
- Policy name: `Anyone can delete`
- Allowed operation: `DELETE`
- Policy definition: `bucket_id = 'gallery-images'`

## 확인 방법

정책이 제대로 추가되었는지 확인:

1. Storage > `gallery-images` 버킷 > Policies 탭
2. 3개의 정책이 보이는지 확인:
   - Public Access (SELECT)
   - Anyone can upload (INSERT)
   - Anyone can delete (DELETE)

## 주의사항

- 개발 단계에서는 모든 사용자가 업로드/삭제 가능하도록 설정했습니다
- 프로덕션 배포 전에 관리자만 접근할 수 있도록 정책을 수정해야 합니다
- Policies 탭의 "SQL Editor" 버튼은 정책을 **보는** 용도이지, SQL을 실행하는 용도가 아닙니다

## 문제가 계속되면

1. 브라우저 캐시를 지우고 다시 시도
2. Supabase 프로젝트를 새로고침
3. 정책 이름이 중복되지 않았는지 확인 (기존 정책 삭제 후 재시도)
4. 버킷 이름이 정확한지 확인 (`gallery-images`)






