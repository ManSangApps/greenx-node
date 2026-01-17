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
  CORS_ORIGIN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
export const isProd = env.NODE_ENV === "production";
