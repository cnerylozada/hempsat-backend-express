-- areas.current_crop and practices.crop hold the same thing (validated by the same cropSchema), so they share the name
alter table public.areas
  rename column current_crop to crop;
