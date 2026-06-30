import { Router } from 'express';
import helloRouter from './hello.routes.js';
import userRouter from './user.routes.js';

const router = Router();

router.use('/hello', helloRouter);
router.use('/users', userRouter);

export default router;