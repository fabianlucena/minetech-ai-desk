import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';
import { clientStatusName } from '../categories/client_status.js';

const logger = getDependency('logger');

export default class RequesterService extends ModelService {
  constructor() {
    super({ model: getDependency('requesterModel') });
    this.whatsappController = getDependency('whatsappController');
  }

  #conversationService = null;
  get conversationService() {
    return this.#conversationService ??= getDependency('conversationService');
  }
  
  #clientService = null;
  get clientService() {
    return this.#clientService ??= getDependency('clientService');
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);

    if (options.includeClient) {
      options.include = options.include || [];
      options.include.push({
        model: getDependency('clientModel'),
        as: 'client'
      });
      delete options.includeClient;
    }
    
    return options;
  }

  get validPropertiesForCreation() {
    return ['clientId', 'displayName', 'phone', 'email', 'type', 'bannedAt', 'bannedById', 'banReason'];
  }

  get validPropertiesForUpdate() {
    return [
      'clientId', 'displayName', 'phone', 'email', 'type', 'bannedAt', 'bannedById', 'banReason', 'authState', 'failedAuthAttempts', 'lastFailedAuthAttemptAt', 'authenticatedAt', 'authenticatedExpiresAt'];
  }

  async getByDisplayName(displayName) {
    if (!displayName)
      throw new Error('El nombre es obligatorio');

    return await this.getFirstOrDefault({ where: { displayName } });
  }

  async getByPhone(phone, options) {
    if (!phone)
      throw new Error('El teléfono es obligatorio');

    return await this.getFirstOrDefault({ ...options, where: { ...options?.where, phone } });
  }

  async getByPhoneOrCreate(phone, data, options) {
    if (!phone)
      throw new Error('El teléfono es obligatorio');

    let requester = await this.getByPhone(phone, options);
    if (!requester) {
      if (typeof data === 'function') {
        data = data();
      }
      
      requester = await this.create(
        {
          type: 'customer',
          ...data,
          phone,
        },
        options
      );
    }

    return requester;
  }

  async create(data, options) {
    if (!data.displayName)
      throw new Error('El nombre es obligatorio');

    if (!data.phone)
      throw new Error('El teléfono es obligatorio');

    return await super.create(data, options);
  }

  async updateByUuid(uuid, data, options) {
    if (!uuid)
      throw new Error('El UUID del solicitante es obligatorio');

    const requester = await this.getByUuid(uuid);
    if (!requester)
      throw new Error('Solicitante no encontrado');

    const globalOptions = { session: options?.session };
    return await this.updateById(requester.id, data, globalOptions);
  }

  async banByUuid(uuid, data, options) {
    const banReason = data?.banReason?.trim();
    if (!banReason)
      throw new Error('El motivo del baneo es obligatorio');

    return await this.updateByUuid(uuid, {
      banReason,
      bannedAt: new Date(),
      bannedById: await this.getCurrentUserId(options),
    }, options);
  }

  async unbanByUuid(uuid, options) {
    return await this.updateByUuid(uuid, {
      banReason: null,
      bannedAt: null,
      bannedById: null,
    }, options);
  }

  async sendMessage(requester, message) {
    return await this.whatsappController.enqueueWhatsAppMessage(message);
  }

  async sendMessageById(requesterId, message, options) {
    const requester = await this.getById(requesterId, options);
    if (!requester)
      throw new Error('Solicitante no encontrado');

    await this.sendMessage(requester, message, options);
  }

  async updateAuthStateById(requesterId, authState, options) {
    return await this.updateById(requesterId, { authState }, options);
  }

  async getFailedAuthBlockedMilliseconds() {
    return await this.settingService.getValueTimePeriodMilliseconds('failedAuthBlockedTime', '1:00:00');
  }

  async getMaxFailedAuthAttempts() {
    return await this.settingService.getValue('maxFailedAuthAttempts', 3);
  }

  async getAuthenticationExpirationMilliseconds() {
    return await this.settingService.getValueTimePeriodMilliseconds('authenticationExpirationDays', '60 00:00:00');
  }

  async replyMessageBySystem(message, replyTo, options) {
    await this.conversationService.replyMessageBySystem(message, replyTo, options);
  }

  async checkState(message, options) {
    const requester = message.sender;
    if (requester.bannedAt) {
      logger.warn(`⚠️ Se recibió un mensaje de un solicitante bloqueado (requesterId=${requester.id}, phone=${requester.phone})`);
      await this.replyMessageBySystem(
        `Lo sentimos, no puedes enviar mensajes porque tu cuenta está bloqueada. Motivo: ${requester.banReason}`,
        message,
        options
      );
      return false;
    }

    if (requester.authState === 'authenticated') {
      if (!requester.authenticatedExpiresAt || new Date() > requester.authenticatedExpiresAt) {
        logger.warn(`ℹ️ La autenticación del solicitante ha expirado (requesterId=${requester.id}, phone=${requester.phone})`);
        await this.replyMessageBySystem(
          `Su sesión ha expirado. Por favor, ingrese su código de cliente para continuar.`,
          message,
          options
        );
        await this.updateAuthStateById(requester.id, 'waiting_client_code', options);
        return false;
      }

      const client = message.conversation?.client;
      if (!client || !client.isActive || client.status !== 'active') {
        logger.warn(`⚠️ Se recibió un mensaje de un solicitante cuyo cliente no está habilitado (requesterId=${requester.id}, phone=${requester.phone}, clientId=${client?.id})`);
        await this.replyMessageBySystem(
          'El cliente no está habilitado para recibir soporte.',
          message,
          options
        );
        await this.conversationService.closeById(message.conversationId, options);
        await this.updateAuthStateById(requester.id, 'initiating', options);
        return false;
      }

      return true;
    }
    
    if (requester.authState === 'locked') {
      logger.warn(`⚠️ Se recibió un mensaje de un solicitante bloqueado (requesterId=${requester.id}, phone=${requester.phone})`);
      if (!requester.lastFailedAuthAttemptAt) {
        requester.lastFailedAuthAttemptAt = new Date();
        this.updateById(requester.id, { lastFailedAuthAttemptAt: requester.lastFailedAuthAttemptAt }, options);
      }

      const failedAuthBlockedMilliseconds = await this.getFailedAuthBlockedMilliseconds();
      const lockedUntil = new Date(requester.lastFailedAuthAttemptAt.getTime() + failedAuthBlockedMilliseconds);
      if (new Date() < lockedUntil) {
        await this.replyMessageBySystem(
          `Lo sentimos, no puedes enviar mensajes porque tu cuenta está temporalmente bloqueada hasta ${lockedUntil.toLocaleString()}.`,
          message,
          options
        );
        return false;
      }

      await this.updateById(requester.id, {
        authState: 'waiting_client_code',
        failedAuthAttempts: 0,
        lastFailedAuthAttemptAt: null,
      }, options);
    }

    if (!requester.authState || requester.authState === 'initiating') {
      await this.replyMessageBySystem(
        'Bienvenido a MineTech.\nPor favor, ingrese su código de cliente para continuar.',
        message,
        options
      );
      await this.updateAuthStateById(requester.id, 'waiting_client_code', options);
      return false;
    }

    if (requester.authState === 'waiting_client_code') {
      const clientCode = message?.text?.trim();
      if (!clientCode) {
        logger.warn(`⚠️ Se recibió un código de cliente inválido (requesterId=${requester.id}, phone=${requester.phone}, code=${clientCode})`);
        await this.replyMessageBySystem(
          'Por favor, ingrese su código de cliente en un mensaje de texto.',
          message,
          options
        );
        return false;
      }

      const client = await this.clientService.getByCode(clientCode, options);
      if (!client || !client.isActive || client.status !== 'active') {
        logger.warn(`⚠️ Se recibió un código de cliente inválido (requesterId=${requester.id}, phone=${requester.phone}, code=${clientCode})`);
        const maxFailedAuthAttempts = await this.getMaxFailedAuthAttempts();
        const failedAuthAttempts = (requester.failedAuthAttempts || 0) + 1;
        if (failedAuthAttempts >= maxFailedAuthAttempts) {
          logger.warn(`⚠️ El solicitante ha excedido el número máximo de intentos fallidos de código de cliente (requesterId=${requester.id}, phone=${requester.phone})`);
          const failedAuthBlockedMilliseconds = await this.getFailedAuthBlockedMilliseconds();
          const waitUntil = new Date(Date.now() + failedAuthBlockedMilliseconds).toLocaleString();
          await this.replyMessageBySystem(
            `Se ha excedido el número máximo de intentos fallidos. Su cuenta ha sido temporalmente bloqueada, debes esperar hasta ${waitUntil} antes de intentarlo nuevamente.`,
            message,
            options
          );
          await this.updateById(requester.id, {
            authState: 'locked',
            lastFailedAuthAttemptAt: new Date(),
          }, options);
          return false;
        }

        let messageText;
        if (!client) {
          messageText = `El código de cliente ingresado no es válido. Por favor, inténtalo de nuevo, quedan ${maxFailedAuthAttempts - failedAuthAttempts} intentos.`;
        } else if (!client.isActive) {
          messageText = `El cliente asociado al código ingresado no está habilitado para recibir soporte. Por favor, inténtalo de nuevo, quedan ${maxFailedAuthAttempts - failedAuthAttempts} intentos.`;
        } else if (client.status !== 'active') {
          messageText = `El cliente asociado al código ingresado se encuentra en estado "${clientStatusName(client.status)}" y no puede recibir soporte. Por favor, inténtalo de nuevo, quedan ${maxFailedAuthAttempts - failedAuthAttempts} intentos.`;
        } else {
          messageText = `El código de cliente ingresado no es válido. Por favor, inténtalo de nuevo, quedan ${maxFailedAuthAttempts - failedAuthAttempts} intentos.`;
        }

        await this.replyMessageBySystem(
          messageText,
          message,
          options
        );
        await this.updateById(requester.id, {
          failedAuthAttempts,
          lastFailedAuthAttemptAt: new Date(),
        }, options);
        return false;
      }

      await this.replyMessageBySystem(
        'Código de cliente recibido.\nAhora ingrese su código de acceso.',
        message,
        options
      );
      await this.updateById(requester.id, {
        authState: 'waiting_access_code',
        clientId: client.id,
        failedAuthAttempts: 0,
        lastFailedAuthAttemptAt: null,
      }, options);

      await this.conversationService.updateById(message.conversation.id, {
        clientId: client.id,
      }, options);

      return false;
    }

    if (requester.authState === 'waiting_access_code') {
      const accessCode = message.text?.trim();
      if (!accessCode) {
        logger.warn(`⚠️ Se recibió un código de acceso inválido (requesterId=${requester.id}, phone=${requester.phone}`);
        await this.replyMessageBySystem(
          'Por favor, ingrese su código de acceso en un mensaje de texto.',
          message,
          options
        );
        return false;
      }

      const isValidAccessCode = await this.clientService.validateAccessCode(requester.clientId, accessCode);
      if (!isValidAccessCode) {
        logger.warn(`⚠️ Se recibió un código de acceso inválido (requesterId=${requester.id}, phone=${requester.phone}`);
        const maxFailedAuthAttempts = await this.getMaxFailedAuthAttempts();
        const failedAuthAttempts = (requester.failedAuthAttempts || 0) + 1;
        if (failedAuthAttempts >= maxFailedAuthAttempts) {
          logger.warn(`⚠️ El solicitante ha excedido el número máximo de intentos fallidos de código de acceso (requesterId=${requester.id}, phone=${requester.phone})`);
          const failedAuthBlockedMilliseconds = await this.getFailedAuthBlockedMilliseconds();
          const waitUntil = new Date(Date.now() + failedAuthBlockedMilliseconds).toLocaleString();
          await this.replyMessageBySystem(
            `Se ha excedido el número máximo de intentos fallidos. Su cuenta ha sido temporalmente bloqueada, debes esperar hasta ${waitUntil} antes de intentarlo nuevamente.`,
            message,
            options
          );
          await this.updateById(requester.id, {
            authState: 'locked',
            lastFailedAuthAttemptAt: new Date(),
          }, options);
          return false;
        }

        await this.replyMessageBySystem(
          `El código de acceso ingresado no es válido. Por favor, inténtalo de nuevo, quedan ${maxFailedAuthAttempts - failedAuthAttempts} intentos.`,
          message,
          options
        );
        await this.updateById(requester.id, {
          failedAuthAttempts,
          lastFailedAuthAttemptAt: new Date(),
        }, options);
        return false;
      }

      const authenticationExpirationMilliseconds = await this.getAuthenticationExpirationMilliseconds();
      await this.replyMessageBySystem(
        'Código de acceso válido.\nAhora puedes enviar tus consultas.',
        message,
        options
      );
      await this.updateById(requester.id, {
        authState: 'authenticated',
        authenticatedAt: new Date(),
        authenticatedExpiresAt: new Date(Date.now() + authenticationExpirationMilliseconds),
        failedAuthAttempts: 0,
        lastFailedAuthAttemptAt: null,
      }, options);
      return false;
    }

    await this.replyMessageBySystem(
      'No entiendo el mensaje.\nPor favor, ingrese su código de cliente para continuar.',
      message,
      options
    );
    await this.updateAuthStateById(requester.id, 'waiting_client_code', options);     
    return false;
  }
}