import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('tickets.list'), (...args) => getDependency('ticketController').getList(...args));
router.get('/:uuid', checkPermissionMiddleware('tickets.read'), (...args) => getDependency('ticketController').getByUuid(...args));

export default router;