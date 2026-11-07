import { z } from "zod";
import { baselineFields, coverageLevel } from "../schemas";

export const createMulchingPracticeSchema = z
  .object({
    ...baselineFields,
    startedAt: z.iso.datetime({ offset: true }),
    material: z.enum([
      "crop_residue",
      "straw_or_hay",
      "leaves_and_cuttings",
      "other",
    ]),
    materialOther: z.string().optional(),
    materialState: z.enum(["fresh_green", "dry"]),
    source: z.enum(["this_farm", "brought_in"]),
    sourceDescription: z.string().optional(),
    mulchAmountInKg: z.coerce.number().positive(),
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
