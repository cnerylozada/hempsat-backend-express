import { randomUUID } from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { verifySignature } from "thirdweb/auth";
import { sepolia } from "thirdweb/chains";
import { thirdwebClient } from "../libs/thirdweb";
import { supabaseClient } from "../libs/supabase";
import { SIGNATURE_EXPIRY_SECONDS, TOKEN_EXPIRY_DAYS } from "../constants";

const signInSchema = z.object({
  wallet: z.string().min(1),
  message: z.string().min(1),
  signature: z.string().min(1),
});

const isSignatureExpired = (message: string) => {
  const match = message.match(/deadline:(\d+)/);
  const deadline = match ? parseInt(match[1], 10) : 0;
  const now = Math.floor(Date.now() / 1000);
  const isExpired = now > deadline || deadline - now > SIGNATURE_EXPIRY_SECONDS;
  return isExpired;
};

export const signIn = async (req: Request, res: Response) => {
  const result = signInSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  const { wallet, message, signature } = result.data;
  const isValidSignature = await verifySignature({
    message,
    signature,
    address: wallet,
    client: thirdwebClient,
    chain: sepolia,
  });

  if (!isValidSignature || isSignatureExpired(message)) {
    res.status(401).json({ error: "Invalid signature" });
    return;
  }

  const jti = randomUUID();
  const expiresAt = new Date(
    Date.now() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  );

  const token = jwt.sign(
    { sub: wallet, jti },
    process.env.SUPABASE_JWT_SECRET!,
    { expiresIn: `${TOKEN_EXPIRY_DAYS}d` },
  );

  const { error: userError } = await supabaseClient(token)
    .from("users")
    .upsert({ id: wallet }, { onConflict: "id" });

  if (userError) {
    res.status(500).json({ error: "Failed to create user" });
    return;
  }

  const { error: sessionError } = await supabaseClient(token)
    .from("sessions")
    .insert({ id: jti, user_id: wallet, expires_at: expiresAt.toISOString() });

  if (sessionError) {
    res.status(500).json({ error: "Failed to create session" });
    return;
  }

  res.json({ token });
};

export const signOut = async (req: Request, res: Response) => {
  try {
    const { error } = await supabaseClient(req.token!)
      .from("sessions")
      .delete()
      .eq("id", req.jti!);

    if (error) {
      res.status(500).json({ error: "Failed to sign out" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(500).json({ error: message });
  }
};
