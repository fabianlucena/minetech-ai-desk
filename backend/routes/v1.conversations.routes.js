import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('conversations.list'), (...args) => getDependency('conversationController').getList(...args));
router.get('/:uuid', checkPermissionMiddleware('conversations.read'), (...args) => getDependency('conversationController').getByUuid(...args));
router.get('/:uuid/messages', checkPermissionMiddleware('conversationMessages.read'), (...args) => getDependency('conversationController').getMessagesByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('conversations.delete'), (...args) => getDependency('conversationController').deleteByUuid(...args));
router.patch('/:uuid/restore', checkPermissionMiddleware('conversations.restore'), (...args) => getDependency('conversationController').restoreByUuid(...args));
router.patch('/:uuid/close', checkPermissionMiddleware('conversations.update', 'conversations.close'), (...args) => getDependency('conversationController').closeByUuid(...args));

export default router;