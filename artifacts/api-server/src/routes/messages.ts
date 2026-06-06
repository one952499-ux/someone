import { Router } from "express";
import { CreateMessageBody } from "@workspace/api-zod";
import { sendWhatsAppMessage } from "../lib/twilio";

const router = Router();
let inMemoryCount = 0;

router.post("/messages", async (req, res) => {
  const result = CreateMessageBody.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { content, name } = result.data;
  inMemoryCount++;

  // Send WhatsApp message asynchronously
  sendWhatsAppMessage(content).catch(() => {});

  res.status(201).json({
    id: Math.floor(Math.random() * 1000000),
    content,
    name: name ?? null,
    createdAt: new Date().toISOString(),
  });
});

router.get("/messages/count", async (_req, res) => {
  res.json({ count: inMemoryCount });
});

export default router;
