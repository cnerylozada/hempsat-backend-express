import { geminiClient } from "../libs/gemini";

const MODEL = "gemini-2.5-flash";
const MAX_TOKENS = 1024;

export interface TitleDeedData {
  country: "Peru" | "USA" | null;
  owner_name: string | null;
  owner_id: string | null;
  location: string | null;
  parcel_id: string | null;
  area: string | null;
}

export const extractTitleDeedData = async (
  files: Express.Multer.File[],
): Promise<TitleDeedData> => {
  const imageParts = files.map((file) => ({
    inlineData: {
      mimeType: file.mimetype,
      data: file.buffer.toString("base64"),
    },
  }));

  const prompt = `You are a document analysis assistant specializing in agricultural property title deeds. \
The images are pages or photos of the same title deed for a farm property from Peru or the United States. \
Peruvian documents are in Spanish and issued by SUNARP (Partida Registral). \
US documents are in English and may be Warranty, Grant, or Quitclaim Deeds. \
Extract information accurately regardless of language or format. Return null for any field not found.

Extract the following fields and return as JSON only, no explanation:
{
  "country": "country of the title deed — must be exactly 'Peru' or 'USA', null if cannot be determined",
  "owner_name": "full legal name of the registered owner (Titular in Peru, Grantee in USA)",
  "owner_id": "owner national ID number — DNI or RUC for Peru; null for USA as deeds do not include personal ID numbers",
  "location": "full property location — district, province and region for Peru; county and state for USA",
  "parcel_id": "official parcel identifier — Partida Registral for Peru; APN (Assessor Parcel Number) or legal description parcel number for USA",
  "area": "total land area with unit — hectares or m² for Peru; acres for USA"
}`;

  const response = await geminiClient.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [...imageParts, { text: prompt }] }],
    config: { maxOutputTokens: MAX_TOKENS },
  });

  const raw = response.text ?? "{}";
  const text = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  const data: TitleDeedData = JSON.parse(text);

  if (!data.country || !data.owner_name || !data.location) {
    throw new Error("The uploaded images do not appear to be a valid title deed");
  }

  return data;
};
