create type practice_type as enum ('mulching', 'organic_amendments', 'cover_crops');
create type mass_unit as enum ('kg', 't', 'other');
create type coverage_level as enum ('all', 'about_half', 'small_part');
create type input_source as enum ('this_farm', 'brought_in');

create type tillage_tool        as enum ('hand_hoe', 'animal_plow', 'tractor');  -- ✚
create type fertilizer_kind     as enum ('urea', 'npk', 'other');                -- ✚
create type compost_manure_kind as enum ('compost', 'manure');                   -- ✚
create type burn_material_kind  as enum ('crop_residue', 'weeds_or_brush', 'other'); -- ✚


CREATE TABLE public.practices (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id          uuid NOT NULL REFERENCES public.areas(id),
  type             practice_type NOT NULL,
  crop             text NOT NULL,
  planted_at       date,                      -- null = not planted yet at start
  started_at       date NOT NULL,
  finished_at      date,                      -- null = active; set atomically on close
  attestation_signature  text NOT NULL,

  -- baseline snapshot: what happened on this area since its registered baseline, as of day zero
  tilled                 boolean not null,
  tillage_times          smallint check (tillage_times between 1 and 3),   -- 3 = "3 or more"
  tillage_tool           tillage_tool,
  tillage_area           coverage_level,
  tillage_class          tillage_practice not null,       -- set by the submit function; compare against areas.tillage_practice
  fertilizer_used        boolean not null,
  fertilizer_type        fertilizer_kind,
  fertilizer_kg          numeric(10,2) check (fertilizer_kg > 0),
  fertilizer_other       text,                 -- required when fertilizer_type = 'other'
  burned                 boolean not null,
  burn_material          burn_material_kind,
  burn_area              coverage_level,
  compost_or_manure_used boolean not null,
  compost_manure_type    compost_manure_kind,
  compost_manure_kg      numeric(10,2) check (compost_manure_kg > 0),

  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, type),                          -- target for composite FKs below
  CHECK (finished_at IS NULL OR finished_at >= started_at),

  -- zero-till is the highest-value, highest-scrutiny claim here, so it's enforced at the DB
  -- level, not left to app code: no_till if and only if no tillage pass happened at all.
  CHECK (tilled = (tillage_class <> 'no_till')),
  -- native_fallow describes an area's baseline condition (unworked, uncropped land), not a
  -- tillage class an active practice can claim
  CHECK (tillage_class <> 'native_fallow'),
  -- the detail columns only make sense, and must be present, exactly when tillage happened
  CHECK (
    (tilled AND tillage_times IS NOT NULL AND tillage_tool IS NOT NULL AND tillage_area IS NOT NULL)
    OR
    (NOT tilled AND tillage_times IS NULL AND tillage_tool IS NULL AND tillage_area IS NULL)
  ),
  -- same rule for every other "Did any of these happen?" option: checked ⟺ its sub-form is filled
  CHECK (
    (fertilizer_used AND fertilizer_type IS NOT NULL AND fertilizer_kg IS NOT NULL)
    OR
    (NOT fertilizer_used AND fertilizer_type IS NULL AND fertilizer_kg IS NULL AND fertilizer_other IS NULL)
  ),
  CHECK (fertilizer_type IS DISTINCT FROM 'other' OR fertilizer_other IS NOT NULL),
  CHECK (
    (burned AND burn_material IS NOT NULL AND burn_area IS NOT NULL)
    OR
    (NOT burned AND burn_material IS NULL AND burn_area IS NULL)
  ),
  CHECK (
    (compost_or_manure_used AND compost_manure_type IS NOT NULL AND compost_manure_kg IS NOT NULL)
    OR
    (NOT compost_or_manure_used AND compost_manure_type IS NULL AND compost_manure_kg IS NULL)
  )
);

ALTER TABLE public.practices ENABLE ROW LEVEL SECURITY;

-- only a practice at a time per area: a new one can't start until the active one is closed
CREATE UNIQUE INDEX one_active_practice_per_area
  ON public.practices (area_id)
  WHERE finished_at IS NULL;

CREATE POLICY "users can read own practices"
  ON public.practices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.areas
      JOIN public.farms ON farms.id = areas.farm_id
      WHERE areas.id = practices.area_id
      AND farms.user_id = (auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "users can insert own practices"
  ON public.practices FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.areas
      JOIN public.farms ON farms.id = areas.farm_id
      WHERE areas.id = practices.area_id
      AND farms.user_id = (auth.jwt() ->> 'sub')
    )
  );

-- Guesses from the mockup, not confirmed: exact labels/full value sets for these enums
create type mulch_material as enum ('crop_residue', 'straw_or_hay', 'leaves_and_cuttings', 'other');
create type material_state as enum ('fresh_green', 'dry');

create table public.mulching_practices (
  id              uuid primary key default gen_random_uuid(),
  practice_id     uuid not null,
  practice_type   public.practice_type not null default 'mulching'
                    check (practice_type = 'mulching'),
  applied_on      date not null,
  material        public.mulch_material not null,
  material_other  text,
  material_state  public.material_state not null,
  source          public.input_source not null,
  source_description text,                    -- required detail when brought in from elsewhere

  amount          numeric(10,2) not null check (amount > 0),
  unit            public.mass_unit not null,

  coverage        public.coverage_level not null,

  foreign key (practice_id, practice_type) references public.practices (id, type),
  check (material <> 'other' or material_other is not null),
  check (source <> 'brought_in' or source_description is not null)
);

ALTER TABLE public.mulching_practices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own mulching practices"
  ON public.mulching_practices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.practices
      JOIN public.areas ON areas.id = practices.area_id
      JOIN public.farms ON farms.id = areas.farm_id
      WHERE practices.id = mulching_practices.practice_id
      AND farms.user_id = (auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "users can insert own mulching practices"
  ON public.mulching_practices FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.practices
      JOIN public.areas ON areas.id = practices.area_id
      JOIN public.farms ON farms.id = areas.farm_id
      WHERE practices.id = mulching_practices.practice_id
      AND farms.user_id = (auth.jwt() ->> 'sub')
    )
  );
