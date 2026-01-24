import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z
    .string()
    .transform(Number)
    .default(4000)
    .refine((n) => n > 0),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  FRONTEND_URL: z.string().optional(),
  UPSTOX_CLIENT_ID: z.string(),
  UPSTOX_CLIENT_SECRET: z.string(),
  UPSTOX_REDIRECT_URI: z.string(),
});

export const env = envSchema.parse(process.env);
export const isProd = env.NODE_ENV === "production";
