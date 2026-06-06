import twilio from "twilio";
import { logger } from "./logger";

export async function sendWhatsAppMessage(message: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.TWILIO_TO_NUMBER;

  if (!accountSid || !authToken || !from || !to) {
    logger.warn("Twilio credentials are not fully configured in environment variables. Skipping WhatsApp alert.");
    return;
  }

  logger.info({
    accountSidPrefix: accountSid ? `${accountSid.substring(0, 6)}...` : undefined,
    authTokenLength: authToken ? authToken.length : 0,
    authTokenPrefix: authToken ? `${authToken.substring(0, 4)}...` : undefined,
    from,
    to
  }, "Attempting to send Twilio message with config");

  try {
    const client = twilio(accountSid, authToken);
    // Ensure numbers are prefixed with 'whatsapp:' if not already
    const fromWhatsApp = from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;
    const toWhatsApp = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

    await client.messages.create({
      body: message,
      from: fromWhatsApp,
      to: toWhatsApp,
    });
    logger.info("Sent WhatsApp message via Twilio successfully.");
  } catch (error) {
    logger.error({ error }, "Error sending WhatsApp message via Twilio");
  }
}
