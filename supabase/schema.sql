-- ===================================================================
--  PressIvoire — table des demandes d'essai
-- ===================================================================
--  À exécuter dans le SQL Editor de Supabase (Dashboard > SQL Editor),
--  ou via `supabase db push` en developpant le dossier `supabase/`.
--
--  Une seule fois suffit : le script est idempotent (`if not exists`).
-- ===================================================================

create table if not exists public.leads (
  id          bigint generated always as identity primary key,
  created_at  timestamptz    not null default now(),

  -- Coordonnées du prospect.
  name        text           not null,
  phone       text           not null,
  email       text,

  -- Contexte commercial, déduit du bouton sur lequel il a cliqué.
  plan        text,
  source      text,
  page        text,

  -- Statut du suivi commercial, modifiable depuis le dashboard.
  status      text           not null default 'nouveau',
  notes       text,

  -- `phone` est la seule chose qu'un commercial rappelle tout de suite :
  -- elle doit donc rester présente et non vide.
  constraint leads_name_not_blank  check (length(btrim(name))  > 0),
  constraint leads_phone_not_blank check (length(btrim(phone)) > 0),

  -- Garde-fous contre le spam : ces bornes sont largement au-dessus de ce
  -- qu'un vrai prospect saisit, mais bloquent les dumps de données.
  constraint leads_name_len   check (length(name)  <= 120),
  constraint leads_phone_len  check (length(phone) <= 40),
  constraint leads_email_len  check (email is null or length(email) <= 200),
  constraint leads_email_shape check (
    email is null or position('@' in email) > 1
  )
);

-- Les demandes les plus récentes d'abord : c'est l'ordre de lecture.
create index if not exists leads_created_at_desc
  on public.leads (created_at desc);

-- Filtre par canal quand on cherche d'où viennent les leads.
create index if not exists leads_source_idx
  on public.leads (source)
  where source is not null;


-- -------------------------------------------------------------------
--  Sécurité (RLS)
-- -------------------------------------------------------------------
--  Sans RLS, la table est lisible et modifiable par quiconque possède
--  l'URL du projet et la clé anonyme — c'est-à-dire par tout le monde,
--  puisque ces deux valeurs sont publiques dans le code du site.
--
--  On n'active donc que ce dont on a besoin, et rien d'autre :
--  - lecture  : refusée (les leads sont des données privées)
--  - modification / suppression : refusées (seul le dashboard décide)
--  - insertion : autorisée, c'est le formulaire public
-- -------------------------------------------------------------------

alter table public.leads enable row level security;

-- Le rôle `anon` est celui du navigateur : la clé anonyme du site.
drop policy if exists "insertion publique des leads" on public.leads;
create policy "insertion publique des leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- Aucune politique SELECT/UPDATE/DELETE n'est créée : sans politique
-- explicite, RLS les refuse par défaut. C'est le comportement voulu.
