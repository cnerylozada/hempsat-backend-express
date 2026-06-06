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

    const { error } = await supabaseClient(req.token!)
      .from("users")
      .update({
        national_id: kycData.identification_number,
        first_name: kycData.name_first,
        last_name: kycData.name_last,
        inquiry_id: result.data.inquiryId,
      })
      .eq("id", req.userId!);

    if (error) {
      res.status(500).json({ error: "Failed to update user data" });
      return;
    }

    res.status(200).json({ message: "Identity updated successfully" });
  } catch {
    res.status(500).json({ error: "Failed to update user identity" });
  }
};
