import express from 'express';
import { WebhookController } from './webhook.controller';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send({ message: 'Hello World from Public' });
});

/**
 * Stripe webhook
 */
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const webhookController = new WebhookController(req, res);
    await webhookController.stripeWebhook();
});

export default router;
