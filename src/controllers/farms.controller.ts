import { Request, Response } from "express";
import { extractTitleDeedData } from "../services/title-deed.service";
import { supabaseClient } from "../libs/supabase";

export const createFarm = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const files = req.files as Express.Multer.File[];

  try {
    const data = await extractTitleDeedData(files);

    const { data: user, error: userError } = await supabaseClient(req.token!)
      .from("users")
      .select("national_id")
      .eq("id", req.userId!)
      .single();

    if (userError || !user) {
      res.status(500).json({ error: "Failed to retrieve user data" });
      return;
    }

    if (!user.national_id) {
      res.status(400).json({ error: "KYC not completed — no ID on record" });
      return;
    }

    if (user.national_id !== data.owner_id) {
      res.status(400).json({
        error: "ID card on title deed does not match your verified identity",
      });
      return;
    }

    res.json(data);
  } catch (err) {
    if (err instanceof Error && err.message.includes("valid title deed")) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.error("title deed extraction error:", err);
    res.status(500).json({ error: "Failed to analyze title deed" });
  }
};
