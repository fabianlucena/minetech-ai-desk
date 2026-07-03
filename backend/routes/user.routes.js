import { Router } from 'express';
import getDependency from '../dependency.js';

const router = Router();

router.get('/', (...args) => getDependency('userController').getList(...args));

export default router;