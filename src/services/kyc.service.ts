import { PERSONA_API_URL } from "../constants";

export interface KycData {
  identification_number: string | null;
  name_first: string | null;
  name_last: string | null;
  center_photo_url: string | null;
  verifications: { type: string; id: string }[];
}

const PERSONA_HEADERS = {
  Authorization: `Bearer ${process.env.WITHPERSONA_API_KEY}`,
};

const fetchInquiry = async (inquiryId: string) => {
  const response = await fetch(`${PERSONA_API_URL}/inquiries/${inquiryId}`, {
    headers: PERSONA_HEADERS,
  });
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

export const fetchKycData = async (
  inquiryId: string,
): Promise<KycData | null> => {
  const { ok, data } = await fetchInquiry(inquiryId);
  if (!ok) return null;

  const fields = data.data.attributes.fields;
  const verifications = data.data.relationships.verifications.data;

  const selfieVerification = verifications.find(
    (v) => v.type === "verification/selfie",
  );

  const centerPhotoUrl = selfieVerification
    ? await fetchSelfieVerification(selfieVerification.id)
    : null;

  return {
    identification_number:
      (fields.identification_number?.value as string) ?? null,
    name_first: (fields.name_first?.value as string) ?? null,
    name_last: (fields.name_last?.value as string) ?? null,
    center_photo_url: centerPhotoUrl,
    verifications,
  };
};
