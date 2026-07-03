import { Router } from 'express';
import getDependency from '../dependency.js';

const router = Router();

router.get('/', (...args) => getDependency('helloController').get(...args));

export default router;