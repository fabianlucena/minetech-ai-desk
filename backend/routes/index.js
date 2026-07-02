import { Router } from 'express';
import helloRouter from './hello.routes.js';
import userRouter from './user.routes.js';
import loginRouter from './login.routes.js';
import autoLoginRouter from './auto-login.routes.js';

const router = Router();

router.use('/hello', helloRouter);
router.use('/users', userRouter);
router.use('/login', loginRouter);
router.use('/auto-login', autoLoginRouter);

export default router;