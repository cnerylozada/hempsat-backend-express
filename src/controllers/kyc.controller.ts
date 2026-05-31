import { Request, Response } from "express";
import { z } from "zod";
import { PERSONA_API_URL } from "../constants";

const kycSchema = z.object({
  inquiryId: z.string().min(1),
});

const PERSONA_HEADERS = {
  Authorization: `Bearer ${process.env.WITHPERSONA_API_KEY}`,
};

const fetchInquiry = async (inquiryId: string) => {
  const response = await fetch(
    `${PERSONA_API_URL}/inquiries/${inquiryId}`,
    { headers: PERSONA_HEADERS },
  );
  const data = (await response.json()) as {
    data: {
      attributes: { fields: Record<string, { value: unknown }> };
      relationships: {
        verifications: { data: { type: string; id: string }[] };
      };
    };
  };
  return { ok: response.ok, status: response.status, data };
};

const fetchSelfieVerification = async (selfieVerificationId: string) => {
  const response = await fetch(
    `${PERSONA_API_URL}/verification/selfies/${selfieVerificationId}`,
    { headers: PERSONA_HEADERS },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as {
    data: { attributes: { "center-photo-url": string } };
  };
  return data.data.attributes["center-photo-url"];
};

export const getKycData = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = kycSchema.safeParse(req.params);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  const { inquiryId } = result.data;

  try {
    const { ok, status, data } = await fetchInquiry(inquiryId);

    if (!ok) {
      res.status(status).json(data);
      return;
    }

    const fields = data.data.attributes.fields;
    const verifications = data.data.relationships.verifications.data;

    const selfieVerification = verifications.find(
      (v) => v.type === "verification/selfie",
    );

    const centerPhotoUrl = selfieVerification
      ? await fetchSelfieVerification(selfieVerification.id)
      : null;

    res.json({
      identification_number: fields.identification_number.value,
      name_first: fields.name_first.value,
      name_last: fields.name_last.value,
      center_photo_url: centerPhotoUrl,
      verifications,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch KYC data" });
  }
};
