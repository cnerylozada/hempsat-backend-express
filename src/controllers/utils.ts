import { z } from "zod";

// multipart/form-data sends every field as a string, so boundaries arrives as JSON text
export const boundariesSchema = z.preprocess(
  (value) => (typeof value === "string" ? JSON.parse(value) : value),
  z
    .array(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      }),
    )
    .min(3),
);

// same list for areas.crop and practices.crop (text columns, validated here)
export const cropSchema = z.enum([
  "hemp",
  "maize",
  "beans",
  "potato",
  "quinoa",
  "coffee",
  "cacao",
  "fallow",
]);
