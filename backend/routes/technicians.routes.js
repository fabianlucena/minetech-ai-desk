import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('technicians.list'), (...args) => getDependency('technicianController').getList(...args));
router.get('/:uuid', checkPermissionMiddleware('technicians.read'), (...args) => getDependency('technicianController').getByUuid(...args));
router.post('/', checkPermissionMiddleware('technicians.create'), (...args) => getDependency('technicianController').create(...args));
router.put('/:uuid', checkPermissionMiddleware('technicians.update'), (...args) => getDependency('technicianController').updateByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('technicians.delete'), (...args) => getDependency('technicianController').deleteByUuid(...args));
router.patch('/:uuid/restore', checkPermissionMiddleware('technicians.restore'), (...args) => getDependency('technicianController').restoreByUuid(...args));

export default router;