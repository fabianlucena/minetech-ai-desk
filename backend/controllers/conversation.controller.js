import getDependency from '../dependency.js';
import { ConversationDTO } from '../dto/conversation.dto.js';

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