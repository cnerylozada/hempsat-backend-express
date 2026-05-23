  CREATE POLICY "users can insert own record"
    ON public.users FOR INSERT
    WITH CHECK ((auth.jwt() ->> 'sub') = id);