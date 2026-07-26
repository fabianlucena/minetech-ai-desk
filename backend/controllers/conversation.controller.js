import getDependency from '../dependency.js';
import { ConversationDTO } from '../dto/conversation.dto.js';
import { ConversationMessageDTO } from '../dto/conversation_message.dto.js';

export async function getList(req, res) {
  const conversationService = getDependency('conversationService');
  const conversations = await conversationService.getList({
    includeDeleted: !!req.query.includeDeleted,
    includeRequester: true,
    includeClient: true,
    session: req.session,
  });
  res.json(conversations.map(u => new ConversationDTO(u)));
}

export async function getByUuid(req, res) {
  const conversationService = getDependency('conversationService');
  const conversation = await conversationService.getByUuid(req.params.uuid, {
    session: req.session,
  });
  res.json(new ConversationDTO(conversation));
}

export async function deleteByUuid(req, res) {
  const conversationService = getDependency('conversationService');
  await conversationService.deleteByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function restoreByUuid(req, res) {
  const conversationService = getDependency('conversationService');
  await conversationService.restoreByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function closeByUuid(req, res) {
  const conversationService = getDependency('conversationService');
  await conversationService.closeByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function getMessagesByUuid(req, res) {
  const conversationService = getDependency('conversationService');
  await conversationService.getMessagesByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.json(conversations.map(u => new ConversationMessageDTO(u)));
}