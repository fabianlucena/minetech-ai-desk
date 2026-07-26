import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('settings.list'), (...args) => getDependency('settingController').getList(...args));
router.get('/:uuid', checkPermissionMiddleware('settings.read'), (...args) => getDependency('settingController').getByUuid(...args));
router.post('/', checkPermissionMiddleware('settings.create'), (...args) => getDependency('settingController').create(...args));
router.put('/:uuid', checkPermissionMiddleware('settings.update'), (...args) => getDependency('settingController').updateByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('settings.delete'), (...args) => getDependency('settingController').deleteByUuid(...args));

export default router;