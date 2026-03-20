# Meal Planner

An AI-powered weekly meal planner built with React, TypeScript, Tailwind, Supabase, and the Claude API.

## Setup

### 1. Install dependencies

```bash
npm create vite@latest . -- --template react-ts
npm install @supabase/supabase-js
npm install -D tailwindcss postcss autoprefixer
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to the SQL editor and run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key from Settings → API

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CLAUDE_API_KEY=your-claude-api-key
```

> ⚠️ Never commit `.env` to git. Add it to `.gitignore`.

### 4. Run the dev server

```bash
npm run dev
```

## Project structure

```
src/
  types/          # TypeScript interfaces (Meal, WeekPlan, UserPreferences)
  lib/            # Supabase client, Claude API, planner logic
  hooks/          # useMeals, usePlanner, useShopping
  components/
    meals/        # MealCard, MealForm
    planner/      # WeekGrid, DayColumn (coming soon)
    shopping/     # ShoppingList (coming soon)
  pages/          # MealsPage, PlannerPage, ShoppingPage
  styles/         # global.css
```

## Features

- [x] Add, edit, delete meals with ingredients
- [x] Filter by cuisine and search
- [x] Dietary tag system
- [ ] AI-powered weekly plan generation via Claude API
- [ ] Shopping list generation
- [ ] User preferences panel