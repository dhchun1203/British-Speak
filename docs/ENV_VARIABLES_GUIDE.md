# 환경 변수 설정 가이드

## .env.local 파일 형식

`.env.local` 파일에서는 **따옴표 없이** 값을 입력합니다.

### ✅ 올바른 형식

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTE5ODUwMCwiZXhwIjoxOTU2Nzc0NTAwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQxMTk4NTAwLCJleHAiOjE5NTY3NzQ1MDB9.example
```

### ❌ 잘못된 형식

```env
# 따옴표로 감싸면 안 됩니다!
NEXT_PUBLIC_SUPABASE_URL="https://abcdefghijklmnop.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

## 예외: 따옴표가 필요한 경우

다음과 같은 경우에만 따옴표를 사용합니다:

### 1. 값에 공백이 있는 경우

```env
# 공백이 있는 값은 큰따옴표로 감싸야 함
MESSAGE="Hello World"
```

### 2. 값에 특수 문자가 있는 경우 (드물게)

```env
# 특수 문자가 포함된 경우
PASSWORD="my!pass#word"
```

## 실제 예시

Supabase 환경 변수는 보통 특수 문자나 공백이 없으므로 **따옴표 없이** 입력하면 됩니다:

```env
# ✅ 올바른 형식
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_9HmFLv0y_zRuDXVceposRg_ETWc2_ec
SUPABASE_SERVICE_ROLE_KEY=sb_secret_opAoJ1234567890abcdefghijklmnopqrstuvwxyz

# ✅ URL도 따옴표 없이
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
```

## 주의사항

1. **등호(=) 앞뒤 공백 없이**: `KEY=value` (올바름) vs `KEY = value` (잘못됨)
2. **값 앞뒤 공백 없이**: `KEY=value` (올바름) vs `KEY= value` (잘못됨)
3. **주석은 #으로 시작**: `# 이것은 주석입니다`

## 확인 방법

환경 변수가 제대로 로드되었는지 확인:

```bash
# 개발 서버 실행 후
npm run dev
```

브라우저 콘솔에서 확인하거나, 코드에서:

```typescript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
```

값이 제대로 출력되면 정상입니다!






