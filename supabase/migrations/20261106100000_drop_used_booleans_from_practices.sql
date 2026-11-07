-- tilled / fertilizer_used / burned / compost_manure_used only repeated what the sub-form columns
-- already say (e.g. tilled = tillage_times is not null), so a sub-form is "checked" iff its columns are filled.
--
-- Dropping a column also drops every CHECK that mentions it (the "checked <=> sub-form filled" rules, the
-- no_till rule and practices_burn_material_other_only_if_burned), so they are re-created below on the sub-form columns.
alter table public.practices
  drop column tilled,
  drop column fertilizer_used,
  drop column burned,
  drop column compost_manure_used;

alter table public.practices
  -- zero-till is the highest-value, highest-scrutiny claim: no_till if and only if no tillage pass happened at all
  add constraint practices_no_till_iff_not_tilled
    check ((tillage_times is null) = (tillage_practice = 'no_till')),
  -- tillage details are filled together or not at all
  add constraint practices_tillage_details_together
    check (
      (tillage_times is null) = (tillage_tool is null)
      and (tillage_times is null) = (tillage_area is null)
    ),
  add constraint practices_fertilizer_details_together
    check ((fertilizer_type is null) = (fertilizer_amount_in_kg is null)),
  add constraint practices_fertilizer_other_only_if_fertilizer
    check (fertilizer_type is not null or fertilizer_other is null),
  add constraint practices_burn_details_together
    check ((burn_material is null) = (burn_area is null)),
  add constraint practices_burn_material_other_only_if_burned
    check (burn_material is not null or burn_material_other is null),
  add constraint practices_compost_manure_details_together
    check ((compost_manure_type is null) = (compost_manure_amount_in_kg is null));

-- same function as before, without the four dropped booleans
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
    tillage_times, tillage_tool, tillage_area, tillage_practice,
    fertilizer_type, fertilizer_amount_in_kg, fertilizer_other,
    burn_material, burn_material_other, burn_area,
    compost_manure_type, compost_manure_amount_in_kg
  )
  select
    area_id, 'mulching', crop, planted_at, started_at, attestation_signature,
    tillage_times, tillage_tool, tillage_area, tillage_practice,
    fertilizer_type, fertilizer_amount_in_kg, fertilizer_other,
    burn_material, burn_material_other, burn_area,
    compost_manure_type, compost_manure_amount_in_kg
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
