import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('shifts.list'), (...args) => getDependency('shiftController').getList(...args));
router.get('/technicians', checkPermissionMiddleware('shifts.list', 'shifts.read'), (...args) => getDependency('shiftController').getTechnicians(...args));
router.get('/types', checkPermissionMiddleware('shifts.list', 'shifts.read'), (...args) => getDependency('shiftController').getTypes(...args));
router.get('/:uuid', checkPermissionMiddleware('shifts.read'), (...args) => getDependency('shiftController').getByUuid(...args));
router.post('/', checkPermissionMiddleware('shifts.create'), (...args) => getDependency('shiftController').create(...args));
router.put('/:uuid', checkPermissionMiddleware('shifts.update'), (...args) => getDependency('shiftController').updateByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('shifts.delete'), (...args) => getDependency('shiftController').deleteByUuid(...args));
router.patch('/:uuid/restore', checkPermissionMiddleware('shifts.restore'), (...args) => getDependency('shiftController').restoreByUuid(...args));

export default router;