import { getDependency } from '../dependency.js';
const logger = getDependency('logger');

export async function startWhatsappWebhookServer(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const whatsappService = getDependency('whatsappService');
  const result = await whatsappService.startWebhookServer({ mode, token, challenge });
  if (!result)
    return res.sendStatus(403);

  return res.status(200).send(result);
}

export async function processIncomingWhatsApp(req, res) {
  // Meta demands respond quickly
  res.sendStatus(200);

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message)
      return;

    const whatsappService = getDependency('whatsappService');
    whatsappService.incomingMessage({ entry, change, value, message });
  } catch (err) {
    logger.error('❌ Error procesando mensaje entrante:', err);
  }
}