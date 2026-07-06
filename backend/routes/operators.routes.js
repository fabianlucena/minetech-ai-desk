import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('operators.list'), (...args) => getDependency('operatorController').getList(...args));
router.get('/:uuid', checkPermissionMiddleware('operators.read'), (...args) => getDependency('operatorController').getByUuid(...args));
router.post('/', checkPermissionMiddleware('operators.create'), (...args) => getDependency('operatorController').create(...args));
router.put('/:uuid', checkPermissionMiddleware('operators.update'), (...args) => getDependency('operatorController').updateByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('operators.delete'), (...args) => getDependency('operatorController').deleteByUuid(...args));
router.patch('/:uuid/restore', checkPermissionMiddleware('operators.restore'), (...args) => getDependency('operatorController').restoreByUuid(...args));

export default router;