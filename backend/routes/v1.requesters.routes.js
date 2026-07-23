import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('requesters.list'), (...args) => getDependency('requesterController').getList(...args));
router.get('/:uuid', checkPermissionMiddleware('requesters.read'), (...args) => getDependency('requesterController').getByUuid(...args));
router.post('/', checkPermissionMiddleware('requesters.create'), (...args) => getDependency('requesterController').create(...args));
router.put('/:uuid', checkPermissionMiddleware('requesters.update'), (...args) => getDependency('requesterController').updateByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('requesters.delete'), (...args) => getDependency('requesterController').deleteByUuid(...args));
router.patch('/:uuid/restore', checkPermissionMiddleware('requesters.restore'), (...args) => getDependency('requesterController').restoreByUuid(...args));

export default router;