import { Router } from "express";
import { db, messagesTable } from "@workspace/db";
import { count } from "drizzle-orm";
import { CreateMessageBody } from "@workspace/api-zod";
import { sendWhatsAppMessage } from "../lib/twilio";

const router = Router();

router.post("/messages", async (req, res) => {
  const result = CreateMessageBody.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { content, name } = result.data;

  const [message] = await db
    .insert(messagesTable)
    .values({ content, name: name ?? null })
    .returning();

  // Send WhatsApp message asynchronously
  sendWhatsAppMessage(content).catch(() => {});

  res.status(201).json({
    id: message.id,
    content: message.content,
    name: message.name,
    createdAt: message.createdAt.toISOString(),
  });
});

router.get("/messages/count", async (_req, res) => {
  const [row] = await db.select({ count: count() }).from(messagesTable);
  res.json({ count: row.count });
});

export default router;
