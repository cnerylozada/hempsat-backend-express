import { Request, Response } from "express";
import { supabaseClient } from "../../libs/supabase";
import { getSignedUrlsInFolder, uploadFilesToFolder } from "../../libs/storage";
import { addNewAreaInFarmSchema } from "./schemas";

const AREAS_BASELINE_PHOTOS_BUCKET = "areas_baseline_photos";

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

export const getAreaById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const farmId = req.params.farmId as string;
    const areaId = req.params.areaId as string;

    const supabase = supabaseClient(req.token!);

    const { data: area, error } = await supabase
      .from("areas")
      .select("*")
      .eq("farm_id", farmId)
      .eq("id", areaId)
      .single();

    if (error || !area) {
      res.status(404).json({ error: "Area not found" });
      return;
    }

    const photos = await getSignedUrlsInFolder(
      supabase,
      AREAS_BASELINE_PHOTOS_BUCKET,
      `${req.userId}/${areaId}`,
    );

    res.json({ ...area, photos });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};

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

  const {
    name,
    boundaries,
    description,
    tillagePractice,
    currentCrop,
    attestationSignature,
    monthsUnderPractice,
  } = result.data;
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files?.length) {
    res.status(400).json({ error: "At least 1 image is required" });
    return;
  }

  try {
    const supabase = supabaseClient(req.token!);

    const { data: area, error: insertError } = await supabase
      .from("areas")
      .insert({
        name,
        boundaries,
        description,
        farm_id: farmId,
        tillage_practice: tillagePractice,
        current_crop: currentCrop,
        attestation_signature: attestationSignature,
        months_under_practice: monthsUnderPractice,
      })
      .select("id")
      .single();

    if (insertError) {
      res.status(500).json({ error: "Failed to add area" });
      return;
    }

    const photosUploaded = await uploadFilesToFolder(
      supabase,
      AREAS_BASELINE_PHOTOS_BUCKET,
      `${req.userId}/${area.id}`,
      files,
    );
    if (!photosUploaded) {
      res.status(500).json({ error: "Failed to upload area photos" });
      return;
    }

    res.status(201).json({ message: "Area was added successfully" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};
