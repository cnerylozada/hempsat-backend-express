import { z } from "zod";
import { cropSchema } from "../utils";

// multipart/form-data sends every field as a string, so sub-forms arrive as JSON text
const jsonField = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (value) => (typeof value === "string" ? JSON.parse(value) : value),
    schema,
  );

export const coverageLevel = z.enum(["all", "about_half", "small_part"]);

const tillageSchema = z.object({
  times: z.number().int().min(1).max(3), // 3 = "3 or more"
  tool: z.enum(["hand_hoe", "animal_plow", "tractor"]),
  area: coverageLevel,
});

const fertilizerSchema = z
  .object({
    type: z.enum(["urea", "npk", "other"]),
    amountInKg: z.number().positive(),
    other: z.string().optional(),
  })
  .refine((f) => f.type !== "other" || f.other, {
    message: "Product name is required when the fertilizer is other",
    path: ["other"],
  });

const burningSchema = z
  .object({
    material: z.enum(["crop_residue", "weeds_or_brush", "other"]),
    other: z.string().optional(),
    area: coverageLevel,
  })
  .refine((b) => b.material !== "other" || b.other, {
    message: "Say what was burned when the material is other",
    path: ["other"],
  });

const compostOrManureSchema = z.object({
  type: z.enum(["compost", "manure"]),
  amountInKg: z.number().positive(),
});

export const baselineFields = {
  crop: cropSchema,
  plantedAt: z.iso.datetime({ offset: true }).optional(),
  tillage: jsonField(tillageSchema).optional(),
  fertilizer: jsonField(fertilizerSchema).optional(),
  burning: jsonField(burningSchema).optional(),
  compostOrManure: jsonField(compostOrManureSchema).optional(),
  attestationSignature: z.string(),
};
