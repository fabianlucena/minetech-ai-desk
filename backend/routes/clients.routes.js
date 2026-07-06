import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('clients.list'), (...args) => getDependency('clientController').getList(...args));
router.get('/:uuid', checkPermissionMiddleware('clients.read'), (...args) => getDependency('clientController').getByUuid(...args));
router.post('/', checkPermissionMiddleware('clients.create'), (...args) => getDependency('clientController').create(...args));
router.put('/:uuid', checkPermissionMiddleware('clients.update'), (...args) => getDependency('clientController').updateByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('clients.delete'), (...args) => getDependency('clientController').deleteByUuid(...args));
router.patch('/:uuid/restore', checkPermissionMiddleware('clients.restore'), (...args) => getDependency('clientController').restoreByUuid(...args));

export default router;