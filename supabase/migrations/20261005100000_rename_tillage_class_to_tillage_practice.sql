-- practices.tillage_class and areas.tillage_practice share the same type (tillage_practice enum), so they share the name
alter table public.practices
  rename column tillage_class to tillage_practice;

-- same function as before, only the renamed column changes (plpgsql bodies are not rewritten by a rename)
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
    compost_or_manure_used, compost_manure_type, compost_manure_kg
  )
  select
    area_id, 'mulching', crop, planted_at, started_at, attestation_signature,
    tilled, tillage_times, tillage_tool, tillage_area, tillage_practice,
    fertilizer_used, fertilizer_type, fertilizer_kg, fertilizer_other,
    burned, burn_material, burn_area,
    compost_or_manure_used, compost_manure_type, compost_manure_kg
  from jsonb_populate_record(null::public.practices, p_practice)
  returning id into v_practice_id;

  insert into public.mulching_practices (
    practice_id, material, material_other, material_state,
    source, source_description, amount, unit, coverage
  )
  select
    v_practice_id, material, material_other, material_state,
    source, source_description, amount, unit, coverage
  from jsonb_populate_record(null::public.mulching_practices, p_mulching);

  return v_practice_id;
end;
$$;
