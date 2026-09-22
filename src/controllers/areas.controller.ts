import { Request, Response } from "express";
import { supabaseClient } from "../libs/supabase";
import { z } from "zod";

export const getAreasByFarmId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const farmId = req.params.farmId as string;

    const { data: areas, error } = await supabaseClient(req.token!)
      .from("areas")
      .select("*")
      .eq("farm_id", farmId);

    if (error) {
      res.status(500).json({ error: "Failed to fetch areas" });
      return;
    }

    res.json(areas);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};

const addNewAreaInFarmSchema = z.object({
  name: z.string().min(20),
  description: z.string().min(30),
  boundaries: z
    .array(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      }),
      { message: "Farm boundary is required" },
    )
    .min(3),
});

export const addNewAreaInFarm = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const farmId = req.params.farmId as string;

  const result = addNewAreaInFarmSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: result.error.flatten((issue) => issue.message).fieldErrors,
    });
    return;
  }

  const { name, boundaries, description } = result.data;

  try {
    const { error: insertError } = await supabaseClient(req.token!)
      .from("areas")
      .insert({
        name,
        boundaries,
        description,
        farm_id: farmId,
      });

    if (insertError) {
      res.status(500).json({ error: "Failed to add area" });
      return;
    }

    res.status(201).json({ message: "Area was added successfully" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};
