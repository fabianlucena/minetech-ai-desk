import { getDependency } from '../dependency.js';
import crypto from 'crypto';

const config = getDependency('config');
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
  const receivedSignature = req.headers['x-hub-signature-256'];
  if (!receivedSignature) {
    logger.error('❌ Missing signature in WhatsApp webhook request');
    return res.sendStatus(400);
  }

  const body = JSON.stringify(req.body);
  const signature = crypto
    .createHmac('sha256', config.whatsapp.appSecret)
    .update(body)
    .digest('hex');

  if (receivedSignature !== `sha256=${signature}`) {
    logger.error('❌ Invalid signature in WhatsApp webhook request');
    return res.sendStatus(403);
  }

  // Meta demands respond quickly
  // res.sendStatus(200);

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