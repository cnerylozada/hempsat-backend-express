import { z } from "zod";
import { boundariesSchema, cropSchema } from "../utils";

export const addNewAreaInFarmSchema = z.object({
  name: z.string().min(10),
  description: z.string().min(30),
  tillagePractice: z.enum([
    "conventional",
    "reduced",
    "no_till",
    "native_fallow",
  ]),
  crop: cropSchema,
  monthsUnderPractice: z.coerce.number().int(),
  boundaries: boundariesSchema,
  attestationSignature: z.string(),
});
