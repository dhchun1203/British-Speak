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

## 관리자 대시보드 – 방문자 수 (선택)

대시보드에 **누적 방문자 수** / **오늘 방문자 수** 카드를 쓰려면 Supabase에 `visits` 테이블이 있어야 합니다.

Supabase 대시보드 → **SQL Editor**에서 아래 내용을 실행하세요.  
(마이그레이션 파일: `supabase/migrations/20250216000000_create_visits.sql`)

```sql
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);
create index if not exists idx_visits_created_at on public.visits (created_at);
alter table public.visits enable row level security;
create policy "Service role only" on public.visits for all using (false) with check (false);
```

테이블을 만들지 않아도 대시보드는 동작하며, 방문자 수만 0으로 표시됩니다.

**접속 기기별 추이**를 보려면 `device` 컬럼을 추가하세요.  
(`supabase/migrations/20250216100000_add_visits_device.sql`)

```sql
alter table public.visits add column if not exists device text default 'unknown';
```

기존 행은 `unknown`으로 집계되며, 이후 방문부터 PC/모바일/태블릿이 기록됩니다.

**방문일을 한국 날짜로 저장**하려면 `visit_date` 컬럼을 추가하세요.  
(그렇지 않으면 DB에는 서버 UTC 기준 날짜로 저장되어, 한국 17일 새벽 방문이 16일로 보일 수 있습니다.)  
(`supabase/migrations/20250217100000_add_visits_visit_date.sql`)

```sql
alter table public.visits add column if not exists visit_date date;
update public.visits set visit_date = (created_at + interval '9 hours')::date where visit_date is null;
```

이후 방문부터는 insert 시점의 **한국(Asia/Seoul) 기준 날짜**가 저장되며, 대시보드 집계도 이 값을 사용합니다.













