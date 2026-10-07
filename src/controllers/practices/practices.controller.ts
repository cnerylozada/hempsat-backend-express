import { Request, Response } from "express";
import { supabaseClient } from "../../libs/supabase";
import { getSignedUrlsInFolder } from "../../libs/storage";
import { PRACTICES_PHOTOS_BUCKET } from "./utils";

export const getPracticesByAreaId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const areaId = req.params.areaId as string;

    const { data: practices, error } = await supabaseClient(req.token!)
      .from("practices")
      .select(
        "id, type, crop, started_at, finished_at, tillage_practice, created_at",
      )
      .eq("area_id", areaId)
      .order("started_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: "Failed to fetch practices" });
      return;
    }

    res.json(practices);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};

export const getPracticeById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const areaId = req.params.areaId as string;
    const practiceId = req.params.practiceId as string;

    const supabase = supabaseClient(req.token!);

    const { data: practice, error } = await supabase
      .from("practices")
      .select(
        `*, mulching_practices (material, material_other, material_state, source, source_description, amount, unit, coverage)`,
      )
      .eq("area_id", areaId)
      .eq("id", practiceId)
      .single();

    if (error || !practice) {
      res.status(404).json({ error: "Practice not found" });
      return;
    }

    // only the child table matching `type` has a row; expose it as `details`
    const { mulching_practices, ...shared } = practice;
    const detailsByType = { mulching: mulching_practices };

    const photos = await getSignedUrlsInFolder(
      supabase,
      PRACTICES_PHOTOS_BUCKET,
      `${req.userId}/${practiceId}`,
    );

    res.json({
      ...shared,
      photos,
      details:
        detailsByType[practice.type as keyof typeof detailsByType] ?? null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};
