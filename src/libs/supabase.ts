import { createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

export const supabaseClient = (jwt: string) =>
  createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    },
  );
