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

  const body = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
  const digest = crypto
    .createHmac('sha256', config.whatsapp.appSecret)
    .update(body)
    .digest('hex');

  const expectedSignature = `sha256=${digest}`;
  const receivedBuf = Buffer.from(receivedSignature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (receivedBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(receivedBuf, expectedBuf)) {
    logger.error('❌ Invalid signature in WhatsApp webhook request');
    return res.sendStatus(403);
  }

  // Meta demands respond quickly
  res.sendStatus(200);

  void (async () => {
    try {
      const whatsappService = getDependency('whatsappService');
      await whatsappService.incomingMessage(req.body.entry, { session: req.session });
    } catch (err) {
      logger.error('❌ Error procesando mensaje entrante:', err);
    }
  })();