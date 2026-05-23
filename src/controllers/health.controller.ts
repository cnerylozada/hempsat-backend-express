import { Request, Response } from "express";
import { supabaseClient } from "../libs/supabase";

export const getHealth = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabaseClient(req.token!)
    .from("posts")
    .select();
  console.log("data", data);
  console.log("error", error);

  res.json({ status: "ok" });
};
