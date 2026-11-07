-- "Other" under "What did you burn?" asks what it was, like material_other (mulch) and fertilizer_other (fertilizer)
alter table public.practices
  add column burn_material_other text;

alter table public.practices
  add constraint practices_burn_material_other_required
    check (burn_material is distinct from 'other' or burn_material_other is not null),
  add constraint practices_burn_material_other_only_if_burned
    check (burned or burn_material_other is null);

-- same function as before, plus burn_material_other
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
    fertilizer_used, fertilizer_type, fertilizer_amount_in_kg, fertilizer_other,
    burned, burn_material, burn_material_other, burn_area,
    compost_manure_used, compost_manure_type, compost_manure_amount_in_kg
  )
  select
    area_id, 'mulching', crop, planted_at, started_at, attestation_signature,
    tilled, tillage_times, tillage_tool, tillage_area, tillage_practice,
    fertilizer_used, fertilizer_type, fertilizer_amount_in_kg, fertilizer_other,
    burned, burn_material, burn_material_other, burn_area,
    compost_manure_used, compost_manure_type, compost_manure_amount_in_kg
  from jsonb_populate_record(null::public.practices, p_practice)
  returning id into v_practice_id;

  insert into public.mulching_practices (
    practice_id, material, material_other, material_state,
    source, source_description, mulch_amount_in_kg, coverage
  )
  select
    v_practice_id, material, material_other, material_state,
    source, source_description, mulch_amount_in_kg, coverage
  from jsonb_populate_record(null::public.mulching_practices, p_mulching);

  return v_practice_id;
end;
$$;
