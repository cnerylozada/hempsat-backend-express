import { Request, Response } from "express";
import { z } from "zod";
import { supabaseClient } from "../libs/supabase";
import { fetchKycData } from "../services/kyc.service";

const updateUserIdentitySchema = z.object({
  inquiryId: z.string().min(1),
});

export const updateUserIdentity = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = updateUserIdentitySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      errors: result.error.flatten((issue) => issue.message).fieldErrors,
    });
    return;
  }

  try {
    const kycData = await fetchKycData(result.data.inquiryId);
    if (!kycData) {
      res.status(404).json({ error: "Inquiry not found" });
      return;
    }
    console.log("kycData", kycData);

    const { error, count } = await supabaseClient(req.token!)
      .from("users")
      .update(
        {
          national_id: kycData.identification_number,
          first_name: kycData.name_first,
          last_name: kycData.name_last,
          inquiry_id: result.data.inquiryId,
          avatar_url: kycData.center_photo_url,
        },
        { count: "exact" },
      )
      .eq("id", req.userId!);

    if (error || !count) {
      res.status(404).json({ error: "Error updating users data" });
      return;
    }

    res.status(200).json({ message: "Identity updated successfully" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { data: user, error } = await supabaseClient(req.token!)
      .from("users")
      .select("*")
      .eq("id", req.userId!)
      .single();

    if (error || !user) {
      res.status(404).json({ error: "Error fetching users" });
      return;
    }

    res.json(user);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};
