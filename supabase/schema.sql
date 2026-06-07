-- ================================================================
-- BidCopy — Supabase Schema
-- Run this in Supabase SQL editor
-- ================================================================

-- Users (synced from Clerk via webhook)
create table users (
  id                   uuid primary key default gen_random_uuid(),
  clerk_id             text unique not null,
  email                text unique not null,
  name                 text,
  plan                 text not null default 'free',
  generations_today    int not null default 0,
  last_reset_date      date not null default current_date,
  trial_ends_at        timestamptz,
  razorpay_customer_id text,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- Freelancer profiles (feeds the AI prompt)
create table profiles (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid unique references users(id) on delete cascade,
  name          text,
  headline      text,
  bio           text,
  skills        text[] default '{}',
  hourly_rate   int default 0,
  currency      text default 'USD',
  platforms     text[] default '{}',
  portfolio_url text,
  projects      jsonb default '[]',
  tone          text default 'professional',
  speciality    text default 'general',
  completed     boolean default false,
  updated_at    timestamptz default now()
);

-- Generated proposals
create table proposals (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id) on delete cascade,
  job_title       text,
  job_description text not null,
  job_budget      text,
  platform        text default 'general',
  extra_context   text,
  proposal_text   text,
  pricing_table   jsonb default '[]',
  timeline        jsonb default '[]',
  followup_text   text,
  humanise_tips   jsonb default '[]',
  model_used      text,
  word_count      int,
  rating          int check (rating between 1 and 5),
  is_saved        boolean default false,
  created_at      timestamptz default now()
);

-- Blog posts (for SEO content)
create table posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text,
  content       text,
  published     boolean default false,
  published_at  timestamptz,
  created_at    timestamptz default now()
);

-- Enable RLS
alter table users     enable row level security;
alter table profiles  enable row level security;
alter table proposals enable row level security;

-- Helper function for RLS (reads JWT sub claim)
create or replace function requesting_user_id()
returns text as $$
  select nullif(
    current_setting('request.jwt.claims', true)::json->>'sub',
    ''
  )::text;
$$ language sql stable;

-- RLS policies
create policy "users_own_data" on users
  for all using (clerk_id = requesting_user_id());

create policy "profiles_own_data" on profiles
  for all using (
    user_id = (select id from users where clerk_id = requesting_user_id())
  );

create policy "proposals_own_data" on proposals
  for all using (
    user_id = (select id from users where clerk_id = requesting_user_id())
  );

-- Service role bypass (for webhook + server-side ops)
create policy "service_role_users" on users
  for all using (auth.role() = 'service_role');

create policy "service_role_profiles" on profiles
  for all using (auth.role() = 'service_role');

create policy "service_role_proposals" on proposals
  for all using (auth.role() = 'service_role');

-- Indexes for performance
create index proposals_user_id_idx  on proposals(user_id);
create index proposals_created_idx  on proposals(created_at desc);
create index users_clerk_id_idx     on users(clerk_id);
create index profiles_user_id_idx   on profiles(user_id);
