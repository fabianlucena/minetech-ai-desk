import { Router } from 'express';
import getDependency from '../dependency.js';
import checkPermissionMiddleware from '../middlewares/check_permission_middleware.js';
import multer from 'multer';

const router = Router();

router.get('/', checkPermissionMiddleware('ragDocuments.list'), (...args) => getDependency('ragDocumentController').getList(...args));
router.get('/:uuid', checkPermissionMiddleware('ragDocuments.read'), (...args) => getDependency('ragDocumentController').getByUuid(...args));
router.post('/', checkPermissionMiddleware('ragDocuments.create'), multer().array('file'), (...args) => getDependency('ragDocumentController').create(...args));
router.put('/:uuid', checkPermissionMiddleware('ragDocuments.update'), (...args) => getDependency('ragDocumentController').updateByUuid(...args));
router.patch('/:uuid/restore', checkPermissionMiddleware('ragDocuments.restore'), (...args) => getDependency('ragDocumentController').restoreByUuid(...args));
router.delete('/:uuid', checkPermissionMiddleware('ragDocuments.delete'), (...args) => getDependency('ragDocumentController').deleteByUuid(...args));

export default router;