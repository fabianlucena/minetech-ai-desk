import { Router } from 'express';
import getDependency from '../dependency.js';

const router = Router();

router.post('/', (...args) => getDependency('loginController').login(...args));

export default router;