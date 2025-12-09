# 카카오맵 API 연동 가이드

이 가이드는 영국 스피킹 아카데미 웹사이트에 카카오맵 API를 추가하는 방법을 설명합니다.

## 사전 준비

- 카카오 계정 (이메일 또는 카카오톡 계정)
- 웹사이트 도메인 (로컬 개발: `localhost`, 배포: Vercel 도메인)

## 1단계: 카카오 개발자 계정 및 앱 등록

### 1-1. 카카오 개발자 사이트 접속

1. [카카오 개발자 사이트](https://developers.kakao.com/)에 접속합니다.
2. **"로그인"** 버튼을 클릭하고 카카오 계정으로 로그인합니다.

### 1-2. 내 애플리케이션 만들기

1. 로그인 후 **"내 애플리케이션"** 메뉴를 클릭합니다.
2. **"애플리케이션 추가하기"** 버튼을 클릭합니다.
3. 다음 정보를 입력합니다:
   - **앱 이름**: `영국 스피킹 아카데미` (또는 원하는 이름)
   - **사업자명**: 개인 또는 회사명
4. **"저장"** 버튼을 클릭합니다.

## 2단계: JavaScript 키 발급

### 2-1. 앱 키 확인

1. 생성된 애플리케이션을 클릭하여 상세 페이지로 이동합니다.
2. **"앱 키"** 섹션에서 **"JavaScript 키"**를 확인합니다.
   - 형식: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - 이 키를 복사해두세요. (나중에 `.env.local` 파일에 사용됩니다)

### 2-2. JavaScript SDK 도메인 등록 (필수!)

현재 "플랫폼 키" 페이지에서 **"JavaScript SDK 도메인"** 섹션을 찾아주세요.

1. **"JavaScript SDK 도메인"** 섹션에서 입력 필드를 찾습니다.

2. **"+" 버튼**을 클릭하여 도메인을 추가합니다.

3. 다음 도메인을 입력합니다:

   **로컬 개발용:**
   ```
   http://localhost:3000
   ```

   **배포용 (Vercel):**
   ```
   https://your-project-name.vercel.app
   ```
   또는 커스텀 도메인을 사용하는 경우:
   ```
   https://yourdomain.com
   ```

4. **"+" 버튼**을 다시 클릭하여 추가합니다.

   > **중요**: 
   - 이 설정이 없으면 JavaScript 키를 사용할 수 없습니다!
   - 로컬 개발과 배포 환경 모두 등록하는 것을 권장합니다.
   - 여러 도메인을 각각 추가할 수 있습니다.

### 2-3. 플랫폼 등록 (추가 설정)

왼쪽 메뉴에서 **"플랫폼"** 메뉴로 이동하여 추가로 등록할 수도 있습니다:

1. 왼쪽 메뉴에서 **"플랫폼"** 메뉴를 클릭합니다.
   - "앱 설정" 섹션 아래에 있는 **"플랫폼"** 메뉴입니다.

2. **"Web 플랫폼 등록"** 버튼을 클릭합니다.

3. 동일한 도메인을 등록합니다.

   > **참고**: 
   - "JavaScript SDK 도메인"과 "플랫폼" 모두 등록하는 것이 안전합니다.
   - 일부 카카오 서비스는 두 곳 모두 등록이 필요할 수 있습니다.

## 3단계: 카카오맵 API 활성화

### 3-1. 제품 설정

1. 왼쪽 메뉴에서 **"제품 설정"** 메뉴를 클릭합니다.
2. **"카카오맵"** 제품을 찾아 **"활성화 설정"** 버튼을 클릭합니다.
3. 약관에 동의하고 **"활성화"** 버튼을 클릭합니다.

### 3-2. 사용량 확인

- 카카오맵 JavaScript API는 **무료**로 제공됩니다.
- 일일 호출 제한: **300,000회** (일반적으로 충분합니다)

## 4단계: 로컬 환경 변수 설정

### 4-1. .env.local 파일 수정

프로젝트 루트 디렉토리의 `.env.local` 파일을 열고 다음 내용을 추가합니다:

```env
# Supabase 설정 (기존)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# 카카오맵 API
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_javascript_key_here
```

**예시:**
```env
NEXT_PUBLIC_KAKAO_MAP_API_KEY=abcd1234efgh5678ijkl9012mnop3456
```

> **주의**: 
> - `NEXT_PUBLIC_` 접두사가 필요합니다. (클라이언트 사이드에서 사용)
> - 따옴표 없이 키 값만 입력합니다.
> - 키 값에 공백이 없어야 합니다.

### 4-2. 개발 서버 재시작

환경 변수를 변경한 후에는 개발 서버를 재시작해야 합니다:

```bash
# 개발 서버 중지 (Ctrl + C)
# 그 다음 다시 시작
npm run dev
```

## 5단계: 실제 위치 좌표 설정

### 5-1. 위치 좌표 찾기

1. [카카오맵](https://map.kakao.com/)에 접속합니다.
2. 학원의 실제 주소를 검색합니다.
3. 지도에서 정확한 위치를 클릭합니다.
4. 우클릭 → **"좌표 복사"**를 선택합니다.
   - 형식: `위도, 경도` (예: `37.5665, 126.9780`)

또는 다음 방법으로도 찾을 수 있습니다:
- [좌표로 주소 찾기](https://map.kakao.com/link/search/좌표) 사이트 사용
- Google Maps에서 주소 검색 후 URL에서 좌표 확인

### 5-2. Location 컴포넌트 수정

`components/home/Location.tsx` 파일을 열고 다음 부분을 수정합니다:

```typescript
// 현재 (서울시청 좌표 예시)
center: new window.kakao.maps.LatLng(37.5665, 126.9780),
level: 3,

// 실제 학원 위치로 변경
center: new window.kakao.maps.LatLng(위도, 경도), // 예: 37.5012, 127.0264
level: 3, // 1-14 (숫자가 작을수록 확대, 3은 적당한 수준)

// 마커 위치도 동일하게 변경
const markerPosition = new window.kakao.maps.LatLng(위도, 경도);
```

**예시:**
```typescript
// 강남구 테헤란로 123 좌표 (예시)
center: new window.kakao.maps.LatLng(37.5012, 127.0264),
level: 3,

const markerPosition = new window.kakao.maps.LatLng(37.5012, 127.0264);
```

### 5-3. 지도 확대/축소 레벨 조정

`level` 값에 따라 지도 확대/축소 정도가 달라집니다:

- **1-3**: 매우 확대 (건물 단위)
- **4-6**: 확대 (동네 단위)
- **7-10**: 보통 (구 단위)
- **11-14**: 축소 (도시/국가 단위)

일반적으로 학원 위치 표시에는 **3-5** 정도가 적당합니다.

## 6단계: Vercel 환경 변수 설정 (배포용)

### 6-1. Vercel 대시보드 접속

1. [Vercel 대시보드](https://vercel.com/dashboard)에 접속합니다.
2. 프로젝트를 선택합니다.

### 6-2. 환경 변수 추가

1. **"Settings"** 탭을 클릭합니다.
2. 왼쪽 메뉴에서 **"Environment Variables"**를 클릭합니다.
3. 다음 환경 변수를 추가합니다:

   - **Name**: `NEXT_PUBLIC_KAKAO_MAP_API_KEY`
   - **Value**: 카카오 개발자 사이트에서 복사한 JavaScript 키
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development (선택사항)

4. **"Save"** 버튼을 클릭합니다.

### 6-3. Vercel 플랫폼 도메인 등록

1. 카카오 개발자 사이트로 돌아갑니다.
2. **"플랫폼"** 메뉴에서 Vercel 도메인을 추가합니다:
   ```
   https://your-project-name.vercel.app
   ```
3. **"저장"** 버튼을 클릭합니다.

### 6-4. 재배포

환경 변수를 추가한 후 Vercel이 자동으로 재배포를 시작합니다. 또는 수동으로 **"Deployments"** 탭에서 **"Redeploy"**를 클릭할 수 있습니다.

## 7단계: 테스트

### 7-1. 로컬 테스트

1. 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```

2. 브라우저에서 `http://localhost:3000`에 접속합니다.

3. 홈페이지에서 **"오시는 길"** 섹션으로 스크롤합니다.

4. 지도가 정상적으로 표시되는지 확인합니다:
   - ✅ 지도가 표시됨
   - ✅ 마커가 정확한 위치에 표시됨
   - ✅ 지도 확대/축소 및 이동이 가능함

### 7-2. 배포 환경 테스트

1. Vercel 배포가 완료되면 배포된 URL에 접속합니다.

2. **"오시는 길"** 섹션에서 지도가 정상적으로 표시되는지 확인합니다.

3. 브라우저 콘솔에서 오류가 없는지 확인합니다:
   - 개발자 도구 (F12) → Console 탭

## 문제 해결

### 지도가 표시되지 않는 경우

1. **API 키 확인**
   - `.env.local` 파일에 `NEXT_PUBLIC_KAKAO_MAP_API_KEY`가 올바르게 설정되었는지 확인
   - 따옴표 없이 키 값만 입력했는지 확인
   - 개발 서버를 재시작했는지 확인

2. **플랫폼 도메인 확인**
   - 카카오 개발자 사이트에서 현재 도메인이 등록되어 있는지 확인
   - `localhost:3000` (로컬) 또는 Vercel 도메인 (배포)이 등록되어 있어야 함

3. **브라우저 콘솔 확인**
   - 개발자 도구 (F12) → Console 탭에서 오류 메시지 확인
   - 일반적인 오류:
     - `Invalid API key`: API 키가 잘못되었거나 등록되지 않음
     - `Platform not registered`: 도메인이 플랫폼에 등록되지 않음

### 지도는 표시되지만 위치가 잘못된 경우

1. **좌표 확인**
   - `Location.tsx` 파일의 `center`와 `markerPosition` 좌표가 올바른지 확인
   - 위도와 경도 순서가 바뀌지 않았는지 확인 (위도, 경도 순서)

2. **레벨 조정**
   - `level` 값을 조정하여 적절한 확대/축소 수준으로 설정

### CORS 오류가 발생하는 경우

- 카카오맵 API는 등록된 도메인에서만 작동합니다.
- 카카오 개발자 사이트에서 모든 사용 도메인을 플랫폼에 등록했는지 확인하세요.

## 추가 기능 (선택사항)

### 커스텀 마커 이미지

기본 마커 대신 커스텀 이미지를 사용할 수 있습니다:

```typescript
// 마커 이미지 설정
const imageSrc = '/images/marker.png'; // public 폴더에 이미지 추가
const imageSize = new window.kakao.maps.Size(64, 64);
const imageOption = { offset: new window.kakao.maps.Point(32, 64) };

const markerImage = new window.kakao.maps.MarkerImage(
  imageSrc,
  imageSize,
  imageOption
);

const marker = new window.kakao.maps.Marker({
  position: markerPosition,
  image: markerImage, // 커스텀 이미지 사용
});
```

### 정보창 추가

마커를 클릭하면 정보창이 표시되도록 할 수 있습니다:

```typescript
// 정보창 내용
const iwContent = `
  <div style="padding:10px;">
    <h3>영국 스피킹 아카데미</h3>
    <p>서울특별시 강남구 테헤란로 123</p>
  </div>
`;

const infowindow = new window.kakao.maps.InfoWindow({
  content: iwContent,
});

// 마커 클릭 이벤트
window.kakao.maps.event.addListener(marker, 'click', function() {
  infowindow.open(map, marker);
});
```

## 참고 자료

- [카카오맵 JavaScript API 문서](https://apis.map.kakao.com/web/documentation/)
- [카카오 개발자 사이트](https://developers.kakao.com/)
- [카카오맵 API 예제](https://apis.map.kakao.com/web/sample/)

---

## 요약

1. ✅ 카카오 개발자 사이트에서 애플리케이션 생성
2. ✅ JavaScript 키 발급
3. ✅ 플랫폼 등록 (로컬 및 배포 도메인)
4. ✅ 카카오맵 API 활성화
5. ✅ `.env.local`에 API 키 추가
6. ✅ `Location.tsx`에서 실제 좌표 설정
7. ✅ Vercel 환경 변수 설정 (배포용)
8. ✅ 테스트 및 확인

이제 웹사이트에 카카오맵이 정상적으로 표시됩니다! 🗺️

