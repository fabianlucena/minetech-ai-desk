import { Router } from 'express';
import getDependency from '../dependency.js';

const router = Router();

router.post('/', (...args) => getDependency('loginController').autoLogin(...args));

export default router;