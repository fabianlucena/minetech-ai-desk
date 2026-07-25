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

  async incomingMessage(entries, options) {
    const fromList = {};
    const allContacts = [];

    for (const entry of entries) {
      if (!entry?.changes?.length)
        continue;

      for (const change of entry.changes) {
        if (!change || change.field !== 'messages' || !change.value)
          continue;

        const value = change.value;
        if (!value?.messages?.length
          || !value?.contacts?.length
        )
          continue;

        const messagesList = value.messages.filter(m => m && (m.type === 'text' || m.type === 'image' || m.type === 'document'));
        if (!messagesList.length)
          continue;

        for (const message of messagesList) {
          fromList[message.from] ??= [];
          fromList[message.from].push(message);
          allContacts.push(...(value.contacts || []));
        }
      }
    }

    const requesterService = getDependency('requesterService');
    const ticketService = getDependency('ticketService');
    const ticketMessageService = getDependency('ticketMessageService');
    const technicianService = getDependency('technicianService');

    for (const from in fromList) {
      const requester = await requesterService.getByPhoneOrCreate(
        from,
        () => ({ displayName: allContacts.find(c => c.wa_id === from)?.profile?.name || 'Cliente' }),
        options
      );

      const ticketMessages = [];
      const messages = fromList[from];
      for (const message of messages) {
        const type = message.type;
        let text = null;
        let mediaId = null;

        if (type === 'text')
          text = message.text.body;

        logger.info(`📩 Mensage received from ${from}: ${text || '[media]'}`);

        if (type === 'image')
          mediaId = message.image.id;

        if (type === 'document')
          mediaId = message.document.id;

        let media = null;
        if (mediaId)
          media = await this.downloadMedia(mediaId);

        const ticket = await ticketService.getOpenByRequesterIdOrCreate(requester.id, {}, options);

        const ticketMessage = await ticketMessageService.create({
          ticketId: ticket.id,
          senderType: 'requester',
          senderId: requester.id,
          text,
          media,
        });

        ticketMessages.push(ticketMessage);
      }

      // Ejecutar motor RAG
      /* const aiResponse = await ragEngine(text);

      // Decisión automática
      if (aiResponse.confidence >= 0.75) {
        await sendWhatsAppMessage(waId, aiResponse.answer);
        await audit('auto_response', ticket.id, aiResponse);

        return;
      } */

      const technician = await technicianService.getOnDuty();
      if (!technician) {
        logger.error('No hay técnico de guardia');
        continue;
      }

      for (const ticketMessage of ticketMessages) {
        await technicianService.sendMessageById(technician.id, {
          text: ticketMessage.text,
          media: ticketMessage.media,
        });

        await ticketMessageService.updateById(ticketMessage.id, {
          receiverId: technician.id,
          receiverType: 'technician',
          sentAt: new Date(),
        }, options);
      }
    }
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