-- 접속 기기 구분용 컬럼 추가 (desktop | mobile | tablet | unknown)
alter table public.visits
  add column if not exists device text default 'unknown';

comment on column public.visits.device is '접속 기기: desktop, mobile, tablet, unknown';
