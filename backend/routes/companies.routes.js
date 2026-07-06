import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';

const router = Router();

router.get('/', checkPermissionMiddleware('companies.list'), (...args) => getDependency('companyController').getList(...args));
router.get('/:uuid', checkPermissionMiddleware('companies.read'), (...args) => getDependency('companyController').getByUuid(...args));
router.post('/', checkPermissionMiddleware('companies.create'), (...args) => getDependency('companyController').create(...args));
router.put('/:uuid', checkPermissionMiddleware('companies.update'), (...args) => getDependency('companyController').updateByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('companies.delete'), (...args) => getDependency('companyController').deleteByUuid(...args));
router.patch('/:uuid/restore', checkPermissionMiddleware('companies.restore'), (...args) => getDependency('companyController').restoreByUuid(...args));

export default router;