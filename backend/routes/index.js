import { Router } from 'express';
import helloRouter from './hello.routes.js';
import usersRouter from './users.routes.js';
import loginRouter from './login.routes.js';
import autoLoginRouter from './auto-login.routes.js';
import techniciansRouter from './technician.routes.js';

const router = Router();

router.use('/hello', helloRouter);
router.use('/users', usersRouter);
router.use('/login', loginRouter);
router.use('/auto-login', autoLoginRouter);
router.use('/technicians', techniciansRouter);

export default router;