import { z } from "zod";

export const EvidenceSpanSchema = z.object({
  start_ms: z.number().int().nonnegative(),
  end_ms: z.number().int().nonnegative(),
});

export const BulletSchema = z.object({
  text: z.string().min(1),
  evidence: z.array(EvidenceSpanSchema).min(1, "Every bullet must have at least one evidence span"),
  confidence: z.number().min(0).max(1),
});

export const SectionSchema = z.object({
  name: z.string().min(1),
  bullets: z.array(BulletSchema),
});

export const SummarySchema = z.object({
  version: z.literal("1"),
  videoId: z.string().min(1),
  title: z.string(),
  publishedAt: z.string(),
  sections: z.array(SectionSchema),
});

export type EvidenceSpan = z.infer<typeof EvidenceSpanSchema>;
export type Bullet = z.infer<typeof BulletSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Summary = z.infer<typeof SummarySchema>;
