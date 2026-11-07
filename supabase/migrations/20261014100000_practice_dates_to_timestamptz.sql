-- practice dates become instants (same type as created_at); the frontend renders the day in the viewer's timezone
-- existing date values are read as midnight UTC. The create_mulching_practice function needs no change (jsonb_populate_record follows the column types)
alter table public.practices
  alter column planted_at  type timestamptz using planted_at::timestamp at time zone 'UTC',
  alter column started_at  type timestamptz using started_at::timestamp at time zone 'UTC',
  alter column finished_at type timestamptz using finished_at::timestamp at time zone 'UTC';
