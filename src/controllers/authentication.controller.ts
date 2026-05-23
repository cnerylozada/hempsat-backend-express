import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { verifySignature } from "thirdweb/auth";
import { sepolia } from "thirdweb/chains";
import { thirdwebClient } from "../libs/thirdweb";
import { supabaseClient } from "../libs/supabase";
import { SIGNATURE_EXPIRY_SECONDS } from "../constants";

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

  const token = jwt.sign(
    { sub: wallet, role: "authenticated", aud: "authenticated" },
    process.env.SUPABASE_JWT_SECRET!,
    { expiresIn: "7d" },
  );

  const { error } = await supabaseClient(token)
    .from("users")
    .upsert({ id: wallet }, { onConflict: "id" });

  if (error) {
    res.status(500).json({ error: "Failed to create user" });
    return;
  }

  res.json({ token });
};
