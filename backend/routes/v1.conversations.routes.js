import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();


router.get('/', checkPermissionMiddleware('conversations.list'), (...args) => getDependency('conversationController').getList(...args));
router.get('/:uuid', checkPermissionMiddleware('conversations.read'), (...args) => getDependency('conversationController').getByUuid(...args));

export default router;