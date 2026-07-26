import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('conversations.list'), (...args) => getDependency('conversationController').getList(...args));
router.get('/:uuid', checkPermissionMiddleware('conversations.read'), (...args) => getDependency('conversationController').getByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('conversations.delete'), (...args) => getDependency('conversationController').deleteByUuid(...args));
router.patch('/:uuid/restore', checkPermissionMiddleware('conversations.restore'), (...args) => getDependency('conversationController').restoreByUuid(...args));

export default router;