import { z } from "zod";
import { baselineFields, coverageLevel } from "../schemas";

export const createMulchingPracticeSchema = z
  .object({
    ...baselineFields,

    // the mulch
    appliedOn: z.iso.date(),
    material: z.enum([
      "crop_residue",
      "straw_or_hay",
      "leaves_and_cuttings",
      "other",
    ]),
    materialOther: z.string().min(1).optional(),
    materialState: z.enum(["fresh_green", "dry"]),
    source: z.enum(["this_farm", "brought_in"]),
    sourceDescription: z.string().min(1).optional(),
    amount: z.coerce.number().positive(),
    unit: z.enum(["kg", "t", "other"]),
    coverage: coverageLevel,
  })
  .refine((p) => p.material !== "other" || p.materialOther, {
    message: "Describe the material when it is other",
    path: ["materialOther"],
  })
  .refine((p) => p.source !== "brought_in" || p.sourceDescription, {
    message: "Say where the mulch was brought from",
    path: ["sourceDescription"],
  });
