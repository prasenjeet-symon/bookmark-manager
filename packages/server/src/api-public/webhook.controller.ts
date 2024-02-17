import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ApiEvent, ApiEventNames } from '../events';
import { CheckoutSession, SubscriptionEvent } from '../schema';
import { Logger, PrismaClientSingleton } from '../utils';

export class WebhookController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     *
     * Stripe webhook
     */
    public async stripeWebhook() {
        const validator = new WebhookValidator(this.req, this.res);
        if (!validator.validateStripeWebhook()) {
            Logger.getInstance().logError('Error validating stripe webhook');
            return;
        }

        const STRIPE_KEY = process.env.STRIPE_KEY;
        const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
        const signature = this.req.headers['stripe-signature'];
        const stripe = new Stripe(STRIPE_KEY!);
        const rawBodyBuffer = this.req.body;

        let event;
        try {
            // Need to verify signature in future
            event = rawBodyBuffer;
        } catch (error) {
            this.res.status(209).json({ error: 'Invalid webhook signature' });
            Logger.getInstance().logError('Error validating stripe webhook');
            console.error(error);
            return;
        }

        if (event.type === 'checkout.session.completed') {
            // Triggered when a user is subscribed to a subscription plan
            const eventData = event as CheckoutSession;
            const subscriptionId = eventData.data.object.subscription;
            const userEmail = eventData.data.object.metadata.email;
            const prisma = PrismaClientSingleton.prisma;

            await prisma.user.update({
                where: { email: userEmail },
                data: {
                    Subscription: {
                        update: {
                            isActive: true,
                            subscriptionId: subscriptionId,
                        },
                    },
                },
            });

            ApiEvent.getInstance().dispatch(ApiEventNames.SEND_SUBSCRIPTION_ACTIVATION_EMAIL, {
                email: userEmail,
                subscriptionId: subscriptionId,
            });

            this.res.status(200).json({ success: true });
            Logger.getInstance().logSuccess('Webhook : Subscription created successfully');
            return;
        } else if (event.type === 'customer.subscription.deleted') {
            // Triggered when a user cancels their subscription
            const eventData = event as SubscriptionEvent;
            const subscriptionId = eventData.data.object.id;
            const prisma = PrismaClientSingleton.prisma;

            await prisma.subscription.updateMany({
                where: {
                    subscriptionId: subscriptionId,
                },
                data: {
                    isActive: false,
                },
            });

            this.res.status(200).json({ success: true });
            Logger.getInstance().logSuccess('Webhook: Subscription cancelled successfully');
            return;
        } else {
            this.res.status(209).json({ error: 'Unknown event type' });
            Logger.getInstance().logError('Unknown event type');
            return;
        }
    }
}

/**
 *
 *
 *
 * Webhook validator
 */
class WebhookValidator {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     *
     * Validate stripe webhook
     */
    public validateStripeWebhook() {
        return true;
    }
}
