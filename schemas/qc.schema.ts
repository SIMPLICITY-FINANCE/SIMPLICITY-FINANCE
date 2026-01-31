import { z } from "zod";

export const QCFlagSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  bullet_index: z.number().int().nonnegative().optional(),
});

export const QCSchema = z.object({
  version: z.literal("1"),
  videoId: z.string().min(1),
  qc_status: z.enum(["pass", "warn", "fail"]),
  qc_score: z.number().int().min(0).max(100),
  risk_flags: z.array(z.string()),
  flags: z.array(QCFlagSchema),
});

export type QCFlag = z.infer<typeof QCFlagSchema>;
export type QC = z.infer<typeof QCSchema>;
