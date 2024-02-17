import { isBefore } from 'date-fns';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { v4 } from 'uuid';
import { ApiEvent, ApiEventNames } from '../events';
import { Logger, PrismaClientSingleton, getPrice, isDefined } from '../utils';

export class PaymentController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }
    /**
     *
     * Get is subscription active
     */
    public async getIsSubscriptionActive() {
        const validator = new PaymentControllerValidator(this.req, this.res);
        if (!validator.validateGetIsSubscriptionActive()) {
            Logger.getInstance().logError('Invalid request body of getIsSubscriptionActive');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;
        const email = this.res.locals.email;

        const userWithSubscription = await prisma.user.findUnique({
            where: { email: email },
            include: {
                Subscription: true,
            },
        });

        if (!userWithSubscription || !userWithSubscription.Subscription) {
            this.res.status(400).json({ error: 'User has no subscription' });
            Logger.getInstance().logError('User has no subscription');
            return;
        }

        const subscription = userWithSubscription.Subscription;

        this.res.status(200).json({
            isActive: subscription.isActive,
            subscriptionId: subscription.subscriptionId,
            sessionId: subscription.sessionId,
        });

        Logger.getInstance().logSuccess('Subscription status retrieved');
        return;
    }

    /**
     *
     * Get free trial
     */
    public async getFreeTrial() {
        const validator = new PaymentControllerValidator(this.req, this.res);
        if (!validator.validateGetFreeTrial()) {
            Logger.getInstance().logError('Invalid request body of getFreeTrial');
            return;
        }

        try {
            const isUnderFreeTrial = await this.isUnderFreeTrial();

            this.res.status(200).json({ message: isUnderFreeTrial ? 'true' : 'false' });
            Logger.getInstance().logSuccess('Free trial retrieved');
            return;
        } catch (error) {
            this.res.status(500).json({ error: 'User has no free trial' });
            Logger.getInstance().logError('User has no free trial');
            return;
        }
    }

    /**
     *
     * Cancel subscription
     */
    public async cancelSubscription() {
        const validator = new PaymentControllerValidator(this.req, this.res);
        if (!validator.validateCancelSubscription()) {
            Logger.getInstance().logError('Invalid request body of startSubscription');
            return;
        }

        const STRIPE_KEY = process.env.STRIPE_KEY;
        const stripe = new Stripe(STRIPE_KEY!);
        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        const userWithSubscription = await prisma.user.findUnique({
            where: { email: email },
            include: {
                Subscription: true,
            },
        });

        if (!userWithSubscription || !userWithSubscription.Subscription) {
            this.res.status(400).json({ error: 'User has no subscription' });
            Logger.getInstance().logError('User has no subscription');
            return;
        }

        await this._cancelSubscription(stripe, userWithSubscription.Subscription.sessionId);

        ApiEvent.getInstance().dispatch(ApiEventNames.SEND_SUBSCRIPTION_CANCELLATION_EMAIL, {
            email: email,
        });

        this.res.status(200).json({ message: 'Subscription canceled' });
        Logger.getInstance().logSuccess('Subscription canceled');
        return;
    }

    /**
     *
     * Start premium
     */
    public async startPremium() {
        const validator = new PaymentControllerValidator(this.req, this.res);
        if (!validator.validateStartSubscription()) {
            Logger.getInstance().logError('Invalid request body of startSubscription');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;
        const STRIPE_KEY = process.env.STRIPE_KEY;
        const adminEmail = process.env.ADMIN_EMAIL!;
        const email = this.res.locals.email;
        const stripe = new Stripe(STRIPE_KEY!);

        const isUnderFreeTrial = await this.isUnderFreeTrial();
        if (isUnderFreeTrial) {
            // Cannot start premium because user is under free trial
            this.res.status(400).json({ error: 'User is under free trial' });
            Logger.getInstance().logError('User is under free trial');
            return;
        }

        const basePrice = await prisma.admin.findUnique({
            where: { email: adminEmail },
            include: {
                subscription: true,
            },
        });

        if (!basePrice || !basePrice.subscription) {
            Logger.getInstance().logError('Admin subscription plan not found');
            this.res.status(500).json({ error: 'Admin base subscription plan not found' });
            return;
        }

        const userWithSubscription = await prisma.user.findUnique({
            where: { email: email },
            include: {
                Subscription: true,
            },
        });

        let priceId = null;
        if (userWithSubscription && userWithSubscription.Subscription && userWithSubscription.Subscription.priceId !== '') {
            priceId = userWithSubscription.Subscription.priceId;
        } else {
            // We need to create new price
            // No subscription found for this user
            const price = await stripe.prices.create({
                metadata: {
                    adminEmail: adminEmail,
                    email: email,
                },
                unit_amount: getPrice(basePrice.subscription.price),
                nickname: basePrice.subscription.name,
                currency: basePrice.subscription.currency,
                recurring: {
                    interval: 'month',
                    interval_count: basePrice.subscription.intervalCount,
                },
                product_data: {
                    name: basePrice.subscription.name,
                    statement_descriptor: basePrice.subscription.description,
                    active: true,
                },
            });

            priceId = price.id;
        }

        // If session exit and
        // If subscription is active then do nothing , no need to create new subscription
        // If subscription is cancelled then create new session
        // If subscription is not paid then return URL of existing session
        // Otherwise create new session
        try {
            if (!userWithSubscription || !userWithSubscription.Subscription) {
                throw new Error('Subscription is cancelled');
            }

            const isActive = await this.isSubscriptionActive(stripe, userWithSubscription.Subscription.sessionId);
            if (isActive) {
                this.res.status(500).json({ error: 'Subscription is already active' });
                Logger.getInstance().logError('Subscription is already active');
                return;
            }

            const isUnpaid = await this.isSubscriptionUnpaid(stripe, userWithSubscription.Subscription.sessionId);
            if (isUnpaid) {
                this.res.status(200).json({ message: isUnpaid });
                Logger.getInstance().logSuccess('Subscription already exit and unpaid. Url is : ' + isUnpaid);
                return;
            }

            throw new Error('Subscription is cancelled');
        } catch (error: any) {
            Logger.getInstance().logWarning('Will create new session for user : ' + email);
            Logger.getInstance().logError(error.message);

            // Cancel and success url
            const successUrl = process.env.CLIENT_BASE_URL + '/dashboard/settings';
            const cancelUrl = process.env.CLIENT_BASE_URL + '/dashboard';
            // Create new session
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    email: email,
                },
            });

            Logger.getInstance().logSuccess('New subscription id is : ' + session.subscription?.toString());

            // Add/update user's subscription
            await prisma.user.update({
                where: { email: email },
                data: {
                    Subscription: {
                        upsert: {
                            create: {
                                description: basePrice.subscription.description,
                                name: basePrice.subscription.name,
                                price: getPrice(basePrice.subscription.price),
                                priceId: priceId,
                                sessionId: session.id,
                                currency: basePrice.subscription.currency,
                                interval: 'month',
                                intervalCount: basePrice.subscription.intervalCount,
                                identifier: v4(),
                                isActive: false,
                                subscriptionId: session.subscription?.toString() || '',
                            },
                            update: {
                                description: basePrice.subscription.description,
                                name: basePrice.subscription.name,
                                price: getPrice(basePrice.subscription.price),
                                priceId: priceId,
                                sessionId: session.id,
                                currency: basePrice.subscription.currency,
                                interval: 'month',
                                intervalCount: basePrice.subscription.intervalCount,
                                isActive: false,
                                subscriptionId: session.subscription?.toString() || '',
                            },
                        },
                    },
                },
            });

            this.res.status(200).json({ message: session.url });
            Logger.getInstance().logSuccess('Subscription created. Url is : ' + session.url);
            return;
        }
    }

    /**
     *
     *
     * Is subscription active
     */
    public async isSubscriptionActive(stripe: Stripe, sessionId: string) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            const subscriptionId = session.subscription?.toString();
            if (!subscriptionId) {
                throw new Error('Subscription id not found');
            }

            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            if (subscription.status === 'active') {
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            Logger.getInstance().logError('Error checking subscription active status');
            Logger.getInstance().logError(error.message);
            return false;
        }
    }

    /**
     *
     * Is subscription cancelled
     */
    public async isSubscriptionCancelled(stripe: Stripe, sessionId: string) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            const subscriptionId = session.subscription?.toString();
            if (!subscriptionId) {
                throw new Error('Subscription id not found');
            }

            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            if (subscription.status === 'canceled') {
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            Logger.getInstance().logError('Error checking subscription cancelled status');
            Logger.getInstance().logError(error.message);
            return false;
        }
    }

    /**
     *
     * Is subscription unpaid
     *
     */
    public async isSubscriptionUnpaid(stripe: Stripe, sessionId: string) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            const subscriptionId = session.subscription?.toString();
            if (!subscriptionId) {
                throw new Error('Subscription id not found');
            }

            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            if (subscription.status === 'unpaid') {
                return session.url;
            } else {
                return null;
            }
        } catch (error: any) {
            Logger.getInstance().logError('Error checking subscription unpaid status');
            Logger.getInstance().logError(error.message);
            return null;
        }
    }

    /**
     *
     * Cancel subscription
     */
    private async _cancelSubscription(stripe: Stripe, sessionId: string) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            const subscriptionId = session.subscription?.toString();
            if (!subscriptionId) {
                throw new Error('Subscription id not found');
            }

            await stripe.subscriptions.cancel(subscriptionId);
            Logger.getInstance().logSuccess('Subscription canceled');
        } catch (error: any) {
            Logger.getInstance().logError('Error canceling subscription');
            Logger.getInstance().logError(error.message);
            return;
        }
    }

    /**
     *
     * Is under free trial
     */
    public async isUnderFreeTrial() {
        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        const userWithFreeTrial = await prisma.user.findUnique({
            where: { email: email },
            include: {
                FreeTrial: true,
            },
        });

        if (!userWithFreeTrial || !userWithFreeTrial.FreeTrial) {
            Logger.getInstance().logError('Free trial not found');
            return false;
        }

        const expires = userWithFreeTrial.FreeTrial.expires;
        const today = new Date();

        if (isBefore(today, expires)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     *
     * Is subscription paid
     */
    public async isSubscriptionPaid() {
        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;
    }
}

/**
 *
 *
 * Validator
 */
class PaymentControllerValidator {
    constructor(private req: Request, private res: Response) {}

    /**
     *
     * Validate data for startSubscription
     */
    public validateStartSubscription() {
        const { STRIPE_KEY, ADMIN_EMAIL } = process.env;

        if (STRIPE_KEY === undefined || ADMIN_EMAIL === undefined) {
            this.res.status(400).json({ error: 'Missing Stripe key or admin email' });
            Logger.getInstance().logError('Missing Stripe key or admin email');
            return false;
        }

        if (!isDefined(STRIPE_KEY) || !isDefined(ADMIN_EMAIL)) {
            this.res.status(400).json({ error: 'Missing Stripe key or admin email' });
            Logger.getInstance().logError('Missing Stripe key or admin email');
            return false;
        }

        return true;
    }

    /**
     *
     * Validate cancel subscription method
     */
    public validateCancelSubscription() {
        return true;
    }

    /**
     *
     * Validate for validateGetFreeTrial
     */
    public validateGetFreeTrial() {
        return true;
    }

    /**
     *
     * Validate for validateGetIsSubscriptionActive
     */
    public validateGetIsSubscriptionActive() {
        return true;
    }
}
