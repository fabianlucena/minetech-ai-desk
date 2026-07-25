import { getDependency } from '../dependency.js';

const logger = getDependency('logger');
const config = getDependency('config');

export default class WhatsappService {
  constructor() {
  }

  async startWebhookServer({ mode, token, challenge }) {
    logger.info('Checking WhatsApp webhook...');
  
    const result = mode === 'subscribe' && token === config.whatsapp.verifyToken;
    if (!result) {
      logger.error('❌ Whatsapp webhook verification failed');
      return;
    }

    logger.info('✅ Whatsapp webhook verified OK');

    return challenge;
  }

  async incomingMessage({ /* entry, change, value, */ message }, options) {
    if (!message)
      return;

    const from = message.from;
    const type = message.type;
    let text = null;
    let mediaId = null;

    if (type === 'text')
      text = message.text.body;

    if (type === 'image')
      mediaId = message.image.id;

    if (type === 'document')
      mediaId = message.document.id;

    logger.info(`📩 Mensage received from ${from}: ${text || '[media]'}`);

    const requesterService = getDependency('requesterService');
    const requester = await requesterService.getByPhoneOrCreate(from, { displayName: 'Cliente' }, options);

    const ticketService = getDependency('ticketService');
    const ticket = await ticketService.addMessage({
      requesterId: requester.id,
      message: text,
    });

    let mediaBuffer = null;
    if (mediaId) {
      mediaBuffer = await this.downloadMedia(mediaId);
      await saveMedia(ticket.id, mediaBuffer);
    }

    // Ejecutar motor RAG
    /* const aiResponse = await ragEngine(text);

    // Decisión automática
    if (aiResponse.confidence >= 0.75) {
      await sendWhatsAppMessage(waId, aiResponse.answer);
      await audit('auto_response', ticket.id, aiResponse);

      return;
    } */

    const technicianService = getDependency('technicianService');
    const technician = await technicianService.getOnDuty();
    if (!technician) {
      throw new Error('No hay técnico de guardia');
    }

    technician.sendMessage({
      message: ticket.message,
      content: text || '[media]',
      media: mediaBuffer,
    });
  }

  async downloadMedia(mediaId) {
    const url = `${config.whatsapp.baseUrl}/${mediaId}`;

    const { data } = await fetch(
      url,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${config.whatsapp.token}` }
      }
    );

    const fileUrl = data.url;

    const file = await fetch(
      fileUrl,
      {
        method: 'GET',
        responseType: 'arraybuffer',
        headers: { Authorization: `Bearer ${config.whatsapp.token}` }
      }
    );

    return file.data;
  }

  async sendMessage({ to, body }) {
    const url = `${config.whatsapp.baseUrl}/${config.whatsapp.phoneId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to,
      text: { body }
    };

    await fetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${config.whatsapp.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}