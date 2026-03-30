create extension if not exists "uuid-ossp";

-- ─── Units ────────────────────────────────────────────────────────────────────
create table units (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null unique
);

insert into units (name) values
  ('g'), ('dkg'), ('kg'), ('ml'), ('dl'), ('l'), ('tsp'), ('tbsp'), ('cup'), ('glass'), ('bottle'), ('oz'),
  ('piece'), ('pinch'), ('slice'), ('handful'), ('bunch');

-- ─── Ingredient categories ────────────────────────────────────────────────────
create table ingredient_categories (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null unique
);

insert into ingredient_categories (name) values
  ('fruits & vegetables'),
  ('meat & fish'),
  ('dairy & eggs'),
  ('grains & pasta'),
  ('canned & dry'),
  ('condiments & spices'),
  ('other');

-- ─── Ingredients ──────────────────────────────────────────────────────────────
create table ingredients (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  category_id uuid not null,
  constraint fk_ingredient_category
    foreign key (category_id)
    references ingredient_categories(id)
);

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

-- ─── Meal ingredients ─────────────────────────────────────────────────────────
create table meal_ingredients (
  id            uuid primary key default uuid_generate_v4(),
  meal_id       uuid not null,
  ingredient_id uuid not null,
  quantity      numeric not null default 1,
  unit_id       uuid not null,
  constraint fk_meal_ingredient_meal
    foreign key (meal_id)
    references meals(id)
    on delete cascade,
  constraint fk_meal_ingredient_ingredient
    foreign key (ingredient_id)
    references ingredients(id),
  constraint fk_meal_ingredient_unit
    foreign key (unit_id)
    references units(id)
);

-- ─── Week plans ───────────────────────────────────────────────────────────────
create table week_plans (
  id          uuid primary key default uuid_generate_v4(),
  week_start  date not null,
  created_at  timestamptz not null default now()
);

-- ─── Week plan days ───────────────────────────────────────────────────────────
create table week_plan_days (
  id           uuid primary key default uuid_generate_v4(),
  week_plan_id uuid not null,
  day          text not null check (day in (
    'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
  )),
  meal_id      uuid not null,
  constraint fk_week_plan_day_plan
    foreign key (week_plan_id)
    references week_plans(id)
    on delete cascade,
  constraint fk_week_plan_day_meal
    foreign key (meal_id)
    references meals(id),
  unique (week_plan_id, day)
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

-- ─── Disable RLS for local/portfolio use ─────────────────────────────────────
alter table units disable row level security;
alter table ingredient_categories disable row level security;
alter table ingredients disable row level security;
alter table meals disable row level security;
alter table meal_ingredients disable row level security;
alter table week_plans disable row level security;
alter table week_plan_days disable row level security;
alter table user_prefs disable row level security;