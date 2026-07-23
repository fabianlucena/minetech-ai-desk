import { Router } from 'express';
import getDependency from '../dependency.js';

const router = Router();

router.get('/providers', (...args) => getDependency('oauth2ProvidersController').getList(...args));
router.get('/callback/:provider/:action', (...args) => getDependency('oauth2Controller').callback(...args));

export default router;