import { z } from "zod";

export const brokerParamSchema = z.object({
  broker: z.enum(["upstox", "delta"]),
});

export const brokerCallBackSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1), //userID
});
