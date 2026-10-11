-- ============================================================
--  Karate dojo website: database setup
--  Paste this whole file into Supabase > SQL Editor > New query, then click Run.
--  Safe to run again if something went wrong the first time.
-- ============================================================

-- 1. TABLES ---------------------------------------------------

create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.achievements (
  id          uuid primary key default gen_random_uuid(),
  year        integer not null,
  level       text not null,
  title       text not null,
  result      text not null,
  who         text not null default '',
  photo_url   text,
  created_at  timestamptz not null default now()
);

create table if not exists public.gallery_photos (
  id          uuid primary key default gen_random_uuid(),
  file_url    text not null,
  thumb_url   text,
  alt         text not null default 'Dojo photo',
  category    text not null,
  ratio       text not null default '4/3',
  created_at  timestamptz not null default now()
);

create table if not exists public.branches (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sensei      text not null,
  address     text not null,
  phone       text not null,
  email       text not null default '',
  created_at  timestamptz not null default now()
);

-- 2. SECURITY RULES -------------------------------------------
-- Everyone can READ. Only the signed-in owner can ADD, CHANGE or DELETE.

alter table public.site_settings  enable row level security;
alter table public.achievements   enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.branches       enable row level security;

drop policy if exists "Anyone can read" on public.site_settings;
drop policy if exists "Owner can change" on public.site_settings;
create policy "Anyone can read"  on public.site_settings for select using (true);
create policy "Owner can change" on public.site_settings for all to authenticated using (true) with check (true);

drop policy if exists "Anyone can read" on public.achievements;
drop policy if exists "Owner can change" on public.achievements;
create policy "Anyone can read"  on public.achievements for select using (true);
create policy "Owner can change" on public.achievements for all to authenticated using (true) with check (true);

drop policy if exists "Anyone can read" on public.gallery_photos;
drop policy if exists "Owner can change" on public.gallery_photos;
create policy "Anyone can read"  on public.gallery_photos for select using (true);
create policy "Owner can change" on public.gallery_photos for all to authenticated using (true) with check (true);

drop policy if exists "Anyone can read" on public.branches;
drop policy if exists "Owner can change" on public.branches;
create policy "Anyone can read"  on public.branches for select using (true);
create policy "Owner can change" on public.branches for all to authenticated using (true) with check (true);

-- 3. PHOTO STORAGE --------------------------------------------
-- A public bucket called site-images (skipped if you already created it).

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view site images"  on storage.objects;
drop policy if exists "Owner can upload site images" on storage.objects;
drop policy if exists "Owner can update site images" on storage.objects;
drop policy if exists "Owner can delete site images" on storage.objects;

create policy "Public can view site images"
  on storage.objects for select using (bucket_id = 'site-images');
create policy "Owner can upload site images"
  on storage.objects for insert to authenticated with check (bucket_id = 'site-images');
create policy "Owner can update site images"
  on storage.objects for update to authenticated using (bucket_id = 'site-images');
create policy "Owner can delete site images"
  on storage.objects for delete to authenticated using (bucket_id = 'site-images');
