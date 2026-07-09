import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('turns.list'), (...args) => getDependency('turnController').getList(...args));
router.get('/technicians', checkPermissionMiddleware('turns.list', 'turns.read'), (...args) => getDependency('turnController').getTechnicians(...args));
router.get('/types', checkPermissionMiddleware('turns.list', 'turns.read'), (...args) => getDependency('turnController').getTypes(...args));
router.get('/:uuid', checkPermissionMiddleware('turns.read'), (...args) => getDependency('turnController').getByUuid(...args));
router.post('/', checkPermissionMiddleware('turns.create'), (...args) => getDependency('turnController').create(...args));
router.put('/:uuid', checkPermissionMiddleware('turns.update'), (...args) => getDependency('turnController').updateByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('turns.delete'), (...args) => getDependency('turnController').deleteByUuid(...args));
router.patch('/:uuid/restore', checkPermissionMiddleware('turns.restore'), (...args) => getDependency('turnController').restoreByUuid(...args));

export default router;