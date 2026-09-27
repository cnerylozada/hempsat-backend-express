import { supabaseClient } from "./supabase";

const SIGNED_URL_EXPIRY_SECONDS = 60 * 60;

export const uploadFilesToFolder = async (
  supabase: ReturnType<typeof supabaseClient>,
  bucket: string,
  folder: string,
  files: Express.Multer.File[],
) => {
  const uploads = await Promise.all(
    files.map((file) =>
      supabase.storage
        .from(bucket)
        .upload(`${folder}/${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
        }),
    ),
  );

  return uploads.every(({ error }) => !error);
};

export const getSignedUrlsInFolder = async (
  supabase: ReturnType<typeof supabaseClient>,
  bucket: string,
  folder: string,
) => {
  const storage = supabase.storage.from(bucket);

  const { data: files, error: listError } = await storage.list(folder);
  if (listError) throw listError;

  const paths = files.map(({ name }) => `${folder}/${name}`);
  if (!paths.length) return [];

  const { data: signedUrls, error: signError } = await storage.createSignedUrls(
    paths,
    SIGNED_URL_EXPIRY_SECONDS,
  );
  if (signError) throw signError;

  return signedUrls.map(({ signedUrl }) => signedUrl);
};
