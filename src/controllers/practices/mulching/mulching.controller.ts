import { Request, Response } from "express";
import { supabaseClient } from "../../../libs/supabase";
import { uploadFilesToFolder } from "../../../libs/storage";
import { PRACTICES_PHOTOS_BUCKET } from "../utils";
import { createMulchingPracticeSchema } from "./schemas";

export const createMulchingPractice = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const areaId = req.params.areaId as string;

  const result = createMulchingPracticeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: result.error.flatten((issue) => issue.message).fieldErrors,
    });
    return;
  }

  const files = req.files as Express.Multer.File[] | undefined;
  if (!files?.length) {
    res.status(400).json({ error: "At least 1 image is required" });
    return;
  }

  const { tillage, fertilizer, burning, compostOrManure, ...form } =
    result.data;

  try {
    const supabase = supabaseClient(req.token!);

    // both rows are inserted in one transaction by the DB function
    const { data: practiceId, error: insertError } = await supabase.rpc(
      "create_mulching_practice",
      {
        p_practice: {
          area_id: areaId,
          crop: form.crop,
          planted_at: form.plantedAt ?? null,
          started_at: form.appliedOn,
          attestation_signature: form.attestationSignature,
          tilled: !!tillage,
          tillage_times: tillage?.times ?? null,
          tillage_tool: tillage?.tool ?? null,
          tillage_area: tillage?.area ?? null,
          // conservative: any tillage counts as conventional until reduced tillage can be evidenced
          tillage_practice: tillage ? "conventional" : "no_till",
          fertilizer_used: !!fertilizer,
          fertilizer_type: fertilizer?.type ?? null,
          fertilizer_kg: fertilizer?.kg ?? null,
          fertilizer_other: fertilizer?.other ?? null,
          burned: !!burning,
          burn_material: burning?.material ?? null,
          burn_area: burning?.area ?? null,
          compost_manure_used: !!compostOrManure,
          compost_manure_type: compostOrManure?.type ?? null,
          compost_manure_kg: compostOrManure?.kg ?? null,
        },
        p_mulching: {
          material: form.material,
          material_other: form.materialOther ?? null,
          material_state: form.materialState,
          source: form.source,
          source_description: form.sourceDescription ?? null,
          amount: form.amount,
          unit: form.unit,
          coverage: form.coverage,
        },
      },
    );

    if (insertError) {
      // 23505: one_active_practice_per_area
      if (insertError.code === "23505") {
        res
          .status(409)
          .json({ error: "This area already has an active practice" });
        return;
      }
      res.status(500).json({ error: "Failed to start mulching practice" });
      return;
    }

    const photosUploaded = await uploadFilesToFolder(
      supabase,
      PRACTICES_PHOTOS_BUCKET,
      `${req.userId}/${practiceId}`,
      files,
    );
    if (!photosUploaded) {
      res.status(500).json({ error: "Failed to upload practice photos" });
      return;
    }

    res.status(201).json({ id: practiceId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};
