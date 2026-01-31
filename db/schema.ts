import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Placeholder schema - will be expanded in checkpoint 2.2
// For now, just a minimal table to verify Drizzle setup works

export const episodes = pgTable("episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: text("source").notNull(),
  url: text("url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
