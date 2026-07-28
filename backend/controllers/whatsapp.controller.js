import { getDependency } from '../dependency.js';
import crypto from 'crypto';

const config = getDependency('config');
const logger = getDependency('logger');
const whatsappPhoneId = config.whatsapp.phoneId;
const messageUrl = config.whatsapp.messageUrl.replace('{phoneId}', whatsappPhoneId);
const whatsappAutorization = `Bearer ${config.whatsapp.token}`;

if (!messageUrl || !whatsappAutorization) {
  logger.error('❌ WhatsApp configuration is incomplete (missing messageUrl/token)');
  return;
}

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
    logger.error(`❌ Invalid signature in WhatsApp webhook request`);
    //console.log(`❌ Invalid signature in WhatsApp webhook request, expected: ${expectedSignature} vs received: ${receivedSignature}`);
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
}

export async function sendWhatsAppMessage({ to, payload }) {
  if (!to) {
    logger.error('❌ Missing "to" parameter for sending WhatsApp message');
    return;
  }

  if (!payload) {
    logger.error('❌ Missing "payload" parameter for sending WhatsApp message');
    return;
  }

  if (typeof payload === 'string') {
    payload = {
      text: {
        body: payload,
      },
    };
  }

  payload.messaging_product = 'whatsapp';
  payload.to = to;

  let res;
  try {
    res = await fetch(
      messageUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': whatsappAutorization,
        },
        body: JSON.stringify(payload)
      }
    );
  } catch (err) {
    logger.error(`❌ Error sending WhatsApp message to ${to}: ${err.message}`);
    return;
  }

  if (!res.ok) {
    const errBody = await res.text().catch(() => null);
    logger.error(`❌ WhatsApp API error sending message to ${to}: HTTP ${res.status}${errBody ? ` - ${errBody}` : ''}`);
  }
}