import { pgSchema, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const memoirSchema = pgSchema("memoir");

export const messagesTable = memoirSchema.table("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messagesTable)
  .omit({ id: true, createdAt: true })
  .extend({
    content: z.string().min(1).max(2000),
    name: z.string().nullable().optional(),
  });

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messagesTable.$inferSelect;
