import { Request, Response } from "express";
import { z } from "zod";
import {
  extractTitleDeedData,
  TitleDeedData,
} from "../services/title-deed.service";
import { supabaseClient } from "../libs/supabase";

const normalizeName = (name: string) =>
  name.toLowerCase().trim().split(/\s+/).sort().join(" ");

const createFarmSchema = z.object({
  name: z.string({ message: "Farm name is required" }),
  // multipart/form-data sends every field as a string, so boundaries arrives as JSON text
  boundaries: z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    z
      .array(
        z.object({
          latitude: z.number().min(-90).max(90),
          longitude: z.number().min(-180).max(180),
        }),
      )
      .min(3),
  ),
});

export const getFarmById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const { data: farm, error } = await supabaseClient(req.token!)
      .from("farms")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !farm) {
      res.status(404).json({ error: "Farm not found" });
      return;
    }

    res.json(farm);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};

export const getMyFarms = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { data: farms, error } = await supabaseClient(req.token!)
      .from("farms")
      .select("*")
      .eq("user_id", req.userId!);

    if (error) {
      res.status(500).json({ error: "Failed to fetch farms" });
      return;
    }

    res.json(farms);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};

export const createFarm = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = createFarmSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: result.error.flatten((issue) => issue.message).fieldErrors,
    });
    return;
  }

  const { name, boundaries } = result.data;
  const files = req.files as Express.Multer.File[];

  try {
    const { data: user, error: userError } = await supabaseClient(req.token!)
      .from("users")
      .select("national_id, first_name, last_name")
      .eq("id", req.userId!)
      .single();

    if (userError || !user) {
      res.status(400).json({ error: "Error fetching users" });
      return;
    }

    if (!user.national_id || !user.first_name || !user.last_name) {
      res
        .status(400)
        .json({ error: "KYC not completed — identity data missing" });
      return;
    }

    const deedData = await extractTitleDeedData(files);

    if (deedData.country === "PE" && user.national_id !== deedData.owner_id) {
      res.status(400).json({
        error: "ID card on title deed does not match your verified identity",
      });
      return;
    }

    if (deedData.country === "USA") {
      const fullName = normalizeName(`${user.first_name} ${user.last_name}`);
      const deedName = normalizeName(deedData.owner_name ?? "");
      if (fullName !== deedName) {
        res.status(400).json({
          error: "Name on title deed does not match your verified identity",
        });
        return;
      }
    }

    const { error: insertError } = await supabaseClient(req.token!)
      .from("farms")
      .insert({
        name,
        user_id: req.userId!,
        country: deedData.country!,
        address: deedData.location!,
        parcel_id: deedData.parcel_id,
        area: deedData.area,
        boundaries,
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};
