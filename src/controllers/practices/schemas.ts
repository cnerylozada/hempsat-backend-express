import { z } from "zod";
import { cropSchema } from "../utils";

// multipart/form-data sends every field as a string, so sub-forms arrive as JSON text
const jsonField = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    schema,
  );

export const coverageLevel = z.enum(["all", "about_half", "small_part"]);

// "Did any of these happen?" — each sub-form is sent only when its option was checked
const tillageSchema = z.object({
  times: z.number().int().min(1).max(3), // 3 = "3 or more"
  tool: z.enum(["hand_hoe", "animal_plow", "tractor"]),
  area: coverageLevel,
});

const fertilizerSchema = z
  .object({
    type: z.enum(["urea", "npk", "other"]),
    kg: z.number().positive(),
    other: z.string().min(1).optional(),
  })
  .refine((f) => f.type !== "other" || f.other, {
    message: "Product name is required when the fertilizer is other",
    path: ["other"],
  });

const burningSchema = z.object({
  material: z.enum(["crop_residue", "weeds_or_brush", "other"]),
  area: coverageLevel,
});

const compostOrManureSchema = z.object({
  type: z.enum(["compost", "manure"]),
  kg: z.number().positive(),
});

// fields every practice type's starter form shares (steps "your crop", "since your baseline" and "review & sign")
export const baselineFields = {
  crop: cropSchema,
  plantedAt: z.iso.date().optional(), // omitted = not planted yet
  tillage: jsonField(tillageSchema).optional(),
  fertilizer: jsonField(fertilizerSchema).optional(),
  burning: jsonField(burningSchema).optional(),
  compostOrManure: jsonField(compostOrManureSchema).optional(),
  attestationSignature: z.string(),
};
