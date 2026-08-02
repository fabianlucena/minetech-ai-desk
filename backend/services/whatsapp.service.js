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

    const conversationMessageService = getDependency('conversationMessageService');

    for (const entry of entries) {
      if (!entry?.changes?.length)
        continue;

      for (const change of entry.changes) {
        if (!change || change.field !== 'messages' || !change.value)
          continue;

        const value = change.value;
        if (!value)
          continue;

        if (value.messages?.length
          || value.contacts?.length
        ) {
          const messagesList = value.messages.filter(m => m && (m.type === 'text' || m.type === 'image' || m.type === 'document'));
          if (!messagesList.length)
            continue;

          for (const message of messagesList) {
            fromList[message.from] ??= [];
            fromList[message.from].push(message);
            allContacts.push(...(value.contacts || []));
          }
        }

        if (value.statuses?.length) {
          for (const status of value.statuses) {
            logger.info(`📩 Mensaje ${status.status} (externalMessageId=${status.id}, wa_id=${status.recipient_id})`);
            const message = await conversationMessageService.getByExternalMessageId(status.id, options);
            if (!message) {
              logger.warn(`⚠️ No se encontró el mensaje con externalMessageId=${status.id} para actualizar su estado`);
              continue;
            }

            const statusToUpdate = {
              deliveredAt: status.status === 'delivered' ? new Date() : undefined,
              readAt: status.status === 'read' ? new Date() : undefined,
            };

            await conversationMessageService.updateStatus(message, statusToUpdate, options);
          }
        }
      }
    }

    const requesterService = getDependency('requesterService');
    const conversationService = getDependency('conversationService');

    for (const from in fromList) {
      const requester = await requesterService.getByPhoneOrCreate(
        from,
        () => ({ displayName: allContacts.find(c => c.wa_id === from)?.profile?.name || 'Cliente' }),
        options
      );

      const conversation = await conversationService.getOpenByRequesterIdOrCreate(requester.id, {}, options);
      const messages = fromList[from];
      for (const message of messages) {
        const type = message.type;
        let text = null;
        let mediaId = null;

        if (type === 'text')
          text = message.text.body;

        logger.info(`📩 Mensaje received from ${from}: ${text || '[media]'}`);

        if (type === 'image')
          mediaId = message.image.id;

        if (type === 'document')
          mediaId = message.document.id;

        let media = null;
        if (mediaId)
          media = await this.downloadMedia(mediaId);

        await conversationService.addRequesterMessage({
          conversation,
          text,
          media,
          externalMessageId: message.id,
          requester,
        }, options);
      }
    }
  }

  async downloadMedia(mediaId) {
    const url = `${config.whatsapp.baseUrl}/${mediaId}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${config.whatsapp.token}` },
    });

    if (!res.ok)
      throw new Error(`Error al obtener metadata de media (${mediaId}): HTTP ${res.status}`);

    const data = await res.json();
    const fileUrl = data?.url;
    if (!fileUrl)
      throw new Error(`Respuesta inválida al obtener metadata de media (${mediaId})`);

    const fileRes = await fetch(fileUrl, {
      method: 'GET',
      headers: { Authorization: `Bearer ${config.whatsapp.token}` },
    });

    if (!fileRes.ok)
      throw new Error(`Error al descargar media (${mediaId}): HTTP ${fileRes.status}`);

    const arrayBuffer = await fileRes.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async sendMessage({ to, body }) {
    const url = `${config.whatsapp.baseUrl}/${config.whatsapp.phoneId}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to,
      text: { body }
    };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), config.whatsapp.timeout);

    try {
      await fetch(
        url,
        {
          signal: controller.signal,
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            Authorization: `Bearer ${config.whatsapp.token}`,
            'Content-Type': 'application/json'
          },
        },
      );
    } catch (err) {
      if (err.name === 'AbortError') {
        logger.error(`Timeout error sending message to ${to}`);
        throw new Error('Tiempo de espera agotado al enviar el mensaje.');
      }

      const message = err?.cause?.message ?? err.message;
      logger.error(`Error sending message to ${to}: ${message}`);
      throw new Error(message);
    }

    clearTimeout(id);
  }
}