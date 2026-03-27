-- Run this in your Supabase SQL editor to set up the schema

create extension if not exists "uuid-ossp";

-- ─── Meals ────────────────────────────────────────────────────────────────────
create table meals (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  description  text not null default '',
  cuisine_type text not null default 'other',
  prep_time    integer not null default 30,
  dietary_tags text[] not null default '{}',
  created_at   timestamptz not null default now()
);

-- ─── Ingredients ──────────────────────────────────────────────────────────────
create table ingredients (
  id       uuid primary key default uuid_generate_v4(),
  meal_id  uuid not null references meals(id) on delete cascade,
  name     text not null,
  quantity numeric not null default 1,
  unit     text not null default 'piece'
);

-- ─── Week plans ───────────────────────────────────────────────────────────────
create table week_plans (
  id          uuid primary key default uuid_generate_v4(),
  week_start  date not null,
  plan_json   jsonb not null default '[]',
  created_at  timestamptz not null default now()
);

-- ─── User preferences ─────────────────────────────────────────────────────────
create table user_prefs (
  id                 uuid primary key default uuid_generate_v4(),
  variety_cuisines   boolean not null default true,
  shared_ingredients boolean not null default false,
  cooking_frequency  text not null default 'daily'
    check (cooking_frequency in ('daily', 'every2days', 'every3days'))
);

insert into user_prefs (variety_cuisines, shared_ingredients, cooking_frequency)
values (true, false, 'daily');

-- ─── RLS (Row Level Security) — enable for production ────────────────────────
-- For portfolio/demo use, you can disable RLS:
-- alter table meals disable row level security;
-- alter table ingredients disable row level security;
-- alter table week_plans disable row level security;
-- alter table user_prefs disable row level security;