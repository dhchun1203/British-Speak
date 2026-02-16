-- 방문 기록 (대시보드 누적/오늘 방문자 수용)
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- 인덱스: 오늘 방문 수 집계용
create index if not exists idx_visits_created_at on public.visits (created_at);

-- RLS: 서버(service role)만 접근. anon/authenticated 직접 접근 차단
alter table public.visits enable row level security;

create policy "Service role only"
  on public.visits
  for all
  using (false)
  with check (false);

comment on table public.visits is '페이지 방문 기록 (세션당 1건 기록, 대시보드 집계용)';
