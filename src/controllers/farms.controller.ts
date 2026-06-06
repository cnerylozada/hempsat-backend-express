import { Request, Response } from "express";
import { z } from "zod";
import { extractTitleDeedData } from "../services/title-deed.service";
import { supabaseClient } from "../libs/supabase";

const createFarmSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export const createFarm = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = createFarmSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten(issue => issue.message).fieldErrors });
    return;
  }

  const { latitude, longitude } = result.data;
  const files = req.files as Express.Multer.File[];

  try {
    const deedData = await extractTitleDeedData(files);

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

    if (deedData.country === "PE" && user.national_id !== deedData.owner_id) {
      res.status(400).json({ error: "ID card on title deed does not match your verified identity" });
      return;
    }

    const { error: insertError } = await supabaseClient(req.token!)
      .from("farms")
      .insert({
        user_id: req.userId!,
        country: deedData.country!,
        owner_name: deedData.owner_name!,
        location: deedData.location!,
        parcel_id: deedData.parcel_id,
        area: deedData.area,
        latitude,
        longitude,
      });

    if (insertError) {
      if (insertError.code === "23505") {
        res.status(409).json({ error: "This farm is already registered" });
        return;
      }
      res.status(500).json({ error: "Failed to create farm" });
      return;
    }

    res.status(201).json({ message: "Farm created successfully" });
  } catch (err) {
    if (err instanceof Error && err.message.includes("valid title deed")) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.error("create farm error:", err);
    res.status(500).json({ error: "Failed to create farm" });
  }
};
