import { Router } from 'express';
import getDependency from '../dependency.js';

const router = Router();

router.get('/', (...args) => getDependency('whatsappController').startWhatsappWebhookServer(...args));
router.post('/', (...args) => getDependency('whatsappController').processIncomingWhatsApp(...args));

export default router;