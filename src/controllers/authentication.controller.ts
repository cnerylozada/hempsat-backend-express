import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { verifySignature } from "thirdweb/auth";
import { sepolia } from "thirdweb/chains";
import { thirdwebClient } from "../libs/thirdweb";

const signInSchema = z.object({
  wallet: z.string().min(1),
  message: z.string().min(1),
  signature: z.string().min(1),
});

export const signIn = async (req: Request, res: Response) => {
  const result = signInSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }

  const { wallet, message, signature } = result.data;

  const isValid = await verifySignature({
    message,
    signature,
    address: wallet,
    client: thirdwebClient,
    chain: sepolia,
  });

  if (!isValid) {
    res.status(401).json({ error: "Invalid signature" });
    return;
  }

  const token = jwt.sign({ wallet }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.json({ token });
};
