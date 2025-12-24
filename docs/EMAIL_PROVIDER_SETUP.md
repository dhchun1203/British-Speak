# Email 프로바이더 활성화 가이드

Supabase에서 Email 프로바이더를 활성화하는 방법입니다.

## Email 프로바이더 활성화 방법

### 1단계: Sign In / Providers 페이지로 이동

1. Supabase 대시보드에서 좌측 사이드바의 **"Authentication"** 클릭
2. **"Configuration"** 섹션에서 **"Sign In / Providers"** 클릭

### 2단계: Email 프로바이더 활성화

1. 페이지에서 **"Email"** 섹션 찾기
2. **"Enable Email provider"** 토글 확인
3. 토글이 **OFF** 상태라면 클릭하여 **ON**으로 변경

### 3단계: Email 설정 구성

Email 프로바이더 활성화 후 다음 설정을 확인하세요:

#### 개발 단계 설정 (권장)

- **Enable Email provider**: ✅ ON
- **Confirm email**: ❌ OFF
  - 이메일 확인 없이 바로 로그인 가능
  - 개발 및 테스트에 편리

#### 프로덕션 설정

- **Enable Email provider**: ✅ ON
- **Confirm email**: ✅ ON
  - 사용자가 이메일 확인 후 로그인 가능
  - 보안 강화

### 4단계: 추가 설정 (선택사항)

**"Authentication"** > **"NOTIFICATIONS"** > **"Email"** 메뉴에서:

- 이메일 템플릿 커스터마이징
- SMTP 설정 (프로덕션 권장)

## 확인 방법

Email 프로바이더가 활성화되었는지 확인:

1. **Sign In / Providers** 페이지에서
2. **"Email"** 섹션의 토글이 **ON** 상태인지 확인
3. 토글 아래에 설정 옵션들이 보이면 활성화된 것입니다

## 문제 해결

### Email 프로바이더가 보이지 않는 경우

- Supabase 프로젝트가 완전히 생성되었는지 확인
- 페이지를 새로고침
- 다른 브라우저에서 시도

### 토글을 켜도 작동하지 않는 경우

- Supabase 프로젝트 상태 확인
- 잠시 후 다시 시도
- Supabase 지원팀에 문의

## 참고

- Email 프로바이더는 기본적으로 활성화되어 있어야 합니다
- 비활성화되어 있다면 수동으로 활성화해야 합니다
- 개발 단계에서는 "Confirm email"을 OFF로 설정하는 것이 편리합니다

---

**다음 단계**: Email 프로바이더 활성화 후 `docs/ADMIN_AUTH_SETUP.md`의 관리자 계정 생성 단계로 진행하세요.













