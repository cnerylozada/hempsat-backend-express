-- every mass is stored in kg (fertilizer_kg, compost_manure_kg, now mulch_kg); the unit column and its 'other' option are gone,
-- because 'other' can't be converted to kg and Verra needs comparable masses

-- stop here instead of silently losing data: rows in an unconvertible unit need a manual decision first
do $$
begin
  if exists (select 1 from public.mulching_practices where unit = 'other') then
    raise exception 'mulching_practices has rows with unit = other; convert them to kg manually before running this migration';
  end if;
end $$;

update public.mulching_practices
  set amount = amount * 1000
  where unit = 't';

alter table public.mulching_practices
  drop column unit;

alter table public.mulching_practices
  rename column amount to mulch_kg;

drop type public.mass_unit;

-- same function as before, only the renamed columns change (plpgsql bodies are not rewritten by a rename)
create or replace function public.create_mulching_practice(p_practice jsonb, p_mulching jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_practice_id uuid;
begin
  insert into public.practices (
    area_id, type, crop, planted_at, started_at, attestation_signature,
    tilled, tillage_times, tillage_tool, tillage_area, tillage_practice,
    fertilizer_used, fertilizer_type, fertilizer_kg, fertilizer_other,
    burned, burn_material, burn_area,
    compost_manure_used, compost_manure_type, compost_manure_kg
  )
  select
    area_id, 'mulching', crop, planted_at, started_at, attestation_signature,
    tilled, tillage_times, tillage_tool, tillage_area, tillage_practice,
    fertilizer_used, fertilizer_type, fertilizer_kg, fertilizer_other,
    burned, burn_material, burn_area,
    compost_manure_used, compost_manure_type, compost_manure_kg
  from jsonb_populate_record(null::public.practices, p_practice)
  returning id into v_practice_id;

  insert into public.mulching_practices (
    practice_id, material, material_other, material_state,
    source, source_description, mulch_kg, coverage
  )
  select
    v_practice_id, material, material_other, material_state,
    source, source_description, mulch_kg, coverage
  from jsonb_populate_record(null::public.mulching_practices, p_mulching);

  return v_practice_id;
end;
$$;
