# 푸시 알림 설정 가이드

문의사항이 등록될 때 관리자에게 푸시 알림을 보내는 기능을 설정하는 방법입니다.

## 1. VAPID 키 생성

VAPID (Voluntary Application Server Identification) 키는 푸시 알림 인증에 필요한 키입니다.

### Node.js를 사용한 VAPID 키 생성

터미널에서 다음 명령어를 실행합니다:

```bash
npx web-push generate-vapid-keys
```

출력 예시:
```
=======================================

Public Key:
BH... (공개키)

Private Key:
... (비공개키)

=======================================
```

### 또는 프로그래밍 방식으로 생성

```javascript
const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();
console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);
```

## 2. 환경 변수 설정

`.env.local` 파일에 VAPID 키를 추가합니다:

```env
# VAPID Keys for Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_EMAIL=mailto:admin@britishspeak.ac.kr

# 앱 URL (Vercel 배포 시 자동 설정됨)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**중요**: 
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`는 클라이언트에서 사용되므로 `NEXT_PUBLIC_` 접두사가 필요합니다.
- `VAPID_PRIVATE_KEY`는 서버에서만 사용되므로 접두사 없이 설정합니다.
- `VAPID_EMAIL`은 `mailto:` 형식으로 설정합니다.

### 2-1. Vercel 배포 시 환경 변수 설정 (필수!)

로컬 개발 환경에서만 설정하는 것이 아니라, **Vercel에도 반드시 설정해야 합니다**.

1. **Vercel 대시보드 접속**
   - https://vercel.com 접속
   - 프로젝트 선택

2. **환경 변수 추가**
   - **Settings** → **Environment Variables** 메뉴 클릭
   - 다음 환경 변수들을 추가합니다:

   | 변수 이름 | 값 | Environment |
   |----------|-----|-------------|
   | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | 생성한 VAPID 공개키 | Production, Preview, Development 모두 선택 |
   | `VAPID_PRIVATE_KEY` | 생성한 VAPID 비공개키 | Production, Preview, Development 모두 선택 |
   | `VAPID_EMAIL` | `mailto:admin@britishspeak.ac.kr` | Production, Preview, Development 모두 선택 |

3. **환경 변수 추가 후 재배포**
   - 환경 변수 추가 후에는 **반드시 재배포**해야 합니다
   - Vercel 대시보드에서 **Deployments** 탭 → 최신 배포의 **"..."** 메뉴 → **Redeploy** 클릭
   - 또는 GitHub에 새로운 커밋을 푸시하면 자동 재배포됩니다

**⚠️ 주의사항:**
- `VAPID_PRIVATE_KEY`는 서버 사이드에서만 사용되므로 절대 클라이언트에 노출되면 안 됩니다
- `.env.local`과 Vercel 환경 변수가 동일한 값이어야 합니다
- 환경 변수 추가 후 빌드/배포를 다시 해야 적용됩니다

## 3. Supabase 테이블 생성

Supabase SQL Editor에서 다음 SQL을 실행합니다:

```sql
-- 푸시 구독 테이블 생성
CREATE TABLE push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Row Level Security (RLS) 활성화
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 자신의 구독 정보 조회 가능
CREATE POLICY "Users can view their own subscriptions"
  ON push_subscriptions FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 인증된 사용자가 구독 정보 추가 가능
CREATE POLICY "Authenticated users can insert subscriptions"
  ON push_subscriptions FOR INSERT
  WITH CHECK (true);

-- 사용자가 자신의 구독 정보 업데이트 가능
CREATE POLICY "Users can update their own subscriptions"
  ON push_subscriptions FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 사용자가 자신의 구독 정보 삭제 가능
CREATE POLICY "Users can delete their own subscriptions"
  ON push_subscriptions FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);
```

## 4. Service Worker 파일 확인

`public/sw.js` 파일이 프로젝트 루트의 `public` 폴더에 있어야 합니다.

Next.js는 `public` 폴더의 파일을 정적 파일로 제공하므로, Service Worker는 `/sw.js` 경로로 접근할 수 있습니다.

## 5. 푸시 알림 아이콘 추가 (선택사항)

푸시 알림에 표시될 아이콘을 추가하려면:

1. `public/icon-192x192.png` (192x192 픽셀)
2. `public/badge-72x72.png` (72x72 픽셀)

파일을 `public` 폴더에 추가합니다.

## 6. 관리자 페이지에서 푸시 알림 활성화

1. 관리자로 로그인합니다.
2. 관리자 대시보드로 이동합니다.
3. "푸시 알림 활성화" 버튼을 클릭합니다.
4. 브라우저에서 알림 권한을 허용합니다.

## 7. 테스트

1. 문의하기 페이지에서 테스트 문의를 제출합니다.
2. 관리자 페이지가 열려있는 경우 푸시 알림을 받습니다.
3. 브라우저가 닫혀있어도 알림을 받을 수 있습니다 (브라우저 지원 시).

## 문제 해결

### 푸시 알림이 작동하지 않는 경우

1. **VAPID 키 확인**: 환경 변수가 올바르게 설정되었는지 확인
2. **Service Worker 확인**: 브라우저 개발자 도구 > Application > Service Workers에서 등록 상태 확인
3. **권한 확인**: 브라우저 설정에서 알림 권한이 허용되었는지 확인
4. **HTTPS 확인**: 푸시 알림은 HTTPS 환경에서만 작동합니다 (localhost는 예외)

### 구독 정보가 저장되지 않는 경우

1. Supabase 테이블이 올바르게 생성되었는지 확인
2. RLS 정책이 올바르게 설정되었는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### 푸시 알림이 전송되지 않는 경우

1. 구독 정보가 데이터베이스에 저장되었는지 확인
2. 서버 로그에서 에러 메시지 확인
3. VAPID 키가 올바른지 확인 (공개키와 비공개키가 일치하는지)

## 브라우저 지원

푸시 알림은 다음 브라우저에서 지원됩니다:
- Chrome (데스크톱, Android)
- Firefox (데스크톱)
- Edge
- Safari (macOS 16+, iOS는 제한적)

**참고**: iOS Safari의 경우 Web Push API 지원이 제한적일 수 있습니다.

