import { Router } from 'express';
import getDependency from '../dependency.js';

const router = Router();

router.get('/', (...args) => getDependency('oauth2ProvidersController').getList(...args));

export default router;