import { Router } from 'express';
import getDependency from '../dependency.js';

const router = Router();

router.get('/', (...args) => getDependency('userController').getAll(...args));

export default router;