-- 방문일(한국 기준) 저장 - created_at(UTC)와 별도로 "몇 일 방문"인지 한국 날짜로 저장
alter table public.visits
  add column if not exists visit_date date;

comment on column public.visits.visit_date is '방문일(한국 Asia/Seoul 기준 날짜). 집계·표시용.';

-- 기존 행: created_at(UTC) + 9h = KST 시각 → date로 보정
update public.visits
set visit_date = (created_at + interval '9 hours')::date
where visit_date is null;
