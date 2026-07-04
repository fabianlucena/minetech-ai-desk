import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('users.list'), (...args) => getDependency('userController').getList(...args));
router.get('/roles', checkPermissionMiddleware('users.list', 'users.read'), (...args) => getDependency('userController').getAsignableRoles(...args));
router.get('/:uuid', checkPermissionMiddleware('users.read'), (...args) => getDependency('userController').getByUuid(...args));
router.post('/', checkPermissionMiddleware('users.create'), (...args) => getDependency('userController').create(...args));
router.put('/:uuid', checkPermissionMiddleware('users.update'), (...args) => getDependency('userController').updateByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('users.delete'), (...args) => getDependency('userController').deleteByUuid(...args));

export default router;