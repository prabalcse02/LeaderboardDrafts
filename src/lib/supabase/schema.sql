-- =============================================================================
-- UPSCPATH Prelims — Supabase Schema
-- Run in the Supabase SQL Editor (or via migration tool)
-- =============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- subjects
-- ----------------------------------------------------------------------------
create table if not exists public.subjects (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  slug       text not null unique,
  paper      text not null check (paper in ('GS-I', 'CSAT')),
  color      text not null,               -- Tailwind gradient classes
  icon       text not null,               -- emoji
  created_at timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- topics
-- ----------------------------------------------------------------------------
create table if not exists public.topics (
  id             uuid primary key default uuid_generate_v4(),
  subject_id     uuid not null references public.subjects(id) on delete cascade,
  name           text not null,
  slug           text not null,
  question_count int  not null default 0,
  created_at     timestamptz default now(),
  unique (subject_id, slug)
);

-- ----------------------------------------------------------------------------
-- questions
-- ----------------------------------------------------------------------------
create table if not exists public.questions (
  id          uuid primary key default uuid_generate_v4(),
  topic_id    uuid not null references public.topics(id)   on delete cascade,
  subject_id  uuid not null references public.subjects(id) on delete cascade,
  text        text not null,
  option_a    text not null,
  option_b    text not null,
  option_c    text not null,
  option_d    text not null,
  correct     char(1) not null check (correct in ('A','B','C','D')),
  explanation text,
  difficulty  text not null check (difficulty in ('easy','medium','hard')),
  year_asked  int,
  created_at  timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- game_sessions
-- ----------------------------------------------------------------------------
create table if not exists public.game_sessions (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  subject_ids      uuid[]  not null default '{}',
  topic_ids        uuid[]  not null default '{}',
  duration_minutes int     not null default 10,
  started_at       timestamptz not null default now(),
  ended_at         timestamptz,
  total_questions  int     not null default 0,
  correct_answers  int     not null default 0,
  score            int     not null default 0,
  xp_earned        int     not null default 0,
  status           text    not null default 'active'
                     check (status in ('active','completed','abandoned')),
  created_at       timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- user_answers
-- ----------------------------------------------------------------------------
create table if not exists public.user_answers (
  id                  uuid primary key default uuid_generate_v4(),
  session_id          uuid not null references public.game_sessions(id) on delete cascade,
  question_id         uuid not null references public.questions(id),
  user_answer         char(1) not null check (user_answer in ('A','B','C','D')),
  is_correct          boolean not null default false,
  time_taken_seconds  numeric(6,2) not null default 0,
  created_at          timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- user_stats
-- ----------------------------------------------------------------------------
create table if not exists public.user_stats (
  user_id                   uuid primary key references auth.users(id) on delete cascade,
  total_xp                  int  not null default 0,
  level                     int  not null default 1,
  total_questions_attempted int  not null default 0,
  total_correct             int  not null default 0,
  total_sessions            int  not null default 0,
  streak_days               int  not null default 0,
  last_played_at            timestamptz,
  updated_at                timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- user_subject_stats
-- ----------------------------------------------------------------------------
create table if not exists public.user_subject_stats (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  subject_id      uuid not null references public.subjects(id) on delete cascade,
  total_questions int  not null default 0,
  correct_answers int  not null default 0,
  accuracy_pct    numeric(5,2) not null default 0,
  total_xp        int  not null default 0,
  updated_at      timestamptz default now(),
  unique (user_id, subject_id)
);

-- ----------------------------------------------------------------------------
-- profiles (display name, avatar — extends auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Aspirant',
  avatar_url   text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Auto-create profile row on new sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Aspirant'));

  insert into public.user_stats (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- leaderboard_view
-- ----------------------------------------------------------------------------
create or replace view public.leaderboard_view as
select
  p.user_id,
  p.display_name,
  p.avatar_url,
  s.total_xp,
  s.level,
  s.total_sessions,
  case
    when s.total_questions_attempted = 0 then 0
    else round((s.total_correct::numeric / s.total_questions_attempted) * 100, 1)
  end as accuracy_pct,
  s.last_played_at,
  rank() over (order by s.total_xp desc) as rank
from public.profiles p
join public.user_stats s on s.user_id = p.user_id;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------

-- subjects, topics, questions — public read, admin write
alter table public.subjects           enable row level security;
alter table public.topics             enable row level security;
alter table public.questions          enable row level security;
alter table public.game_sessions      enable row level security;
alter table public.user_answers       enable row level security;
alter table public.user_stats         enable row level security;
alter table public.user_subject_stats enable row level security;
alter table public.profiles           enable row level security;

-- Public read for reference data
create policy "Public read subjects"  on public.subjects  for select using (true);
create policy "Public read topics"    on public.topics    for select using (true);
create policy "Public read questions" on public.questions for select using (true);

-- Game sessions — owner only
create policy "Own sessions select" on public.game_sessions
  for select using (auth.uid() = user_id);
create policy "Own sessions insert" on public.game_sessions
  for insert with check (auth.uid() = user_id);
create policy "Own sessions update" on public.game_sessions
  for update using (auth.uid() = user_id);

-- User answers — owner only
create policy "Own answers select" on public.user_answers
  for select using (
    auth.uid() = (
      select user_id from public.game_sessions gs where gs.id = session_id
    )
  );
create policy "Own answers insert" on public.user_answers
  for insert with check (
    auth.uid() = (
      select user_id from public.game_sessions gs where gs.id = session_id
    )
  );

-- user_stats — owner only read/write, public leaderboard via view
create policy "Own stats select" on public.user_stats
  for select using (auth.uid() = user_id);
create policy "Own stats update" on public.user_stats
  for update using (auth.uid() = user_id);

-- user_subject_stats — owner only
create policy "Own subject stats select" on public.user_subject_stats
  for select using (auth.uid() = user_id);
create policy "Own subject stats insert" on public.user_subject_stats
  for insert with check (auth.uid() = user_id);
create policy "Own subject stats update" on public.user_subject_stats
  for update using (auth.uid() = user_id);

-- profiles — public read (for leaderboard), owner write
create policy "Public profiles read" on public.profiles
  for select using (true);
create policy "Own profile update" on public.profiles
  for update using (auth.uid() = user_id);

-- leaderboard_view — accessible to all authenticated and anonymous users
grant select on public.leaderboard_view to anon, authenticated;
