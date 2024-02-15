import Stripe from 'stripe';
import { v4 } from 'uuid';
import { ApiEventData } from '.';
import { Logger, PrismaClientSingleton, isDefined, isValidEmail } from '../utils';

export class UserPaymentEvent {
    private data: ApiEventData;

    constructor(data: ApiEventData) {
        this.data = data;
    }

    /**
     *
     *
     * Start the subscription
     */
    public async startSubscription() {
        const validator = new UserPaymentEventValidator(this.data);
        if (!validator.validateStartSubscription()) {
            Logger.getInstance().logError('Invalid event data of startSubscription');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;
        const adminEmail = this.data.data.adminEmail;

        const adminSubscriptionPlan = await prisma.admin.findUnique({
            where: { email: adminEmail },
            include: {
                subscription: true,
            },
        });

        if (!adminSubscriptionPlan || !adminSubscriptionPlan.subscription) {
            Logger.getInstance().logError('Admin subscription plan not found');
            return;
        }

        const subscriptionPlan = adminSubscriptionPlan.subscription;

        // Start the subscription on stripe
        const STRIPE_KEY = process.env.STRIPE_KEY;
        const userId = this.data.data.userId;
        const fullName = this.data.data.fullName;
        const email = this.data.data.email;

        const stripe = new Stripe(STRIPE_KEY!, {
            apiVersion: '2023-10-16',
        });

        const customerId = await this.getStripeCustomer(stripe, email, userId, fullName);
        if (!customerId) {
            Logger.getInstance().logError('Customer not found');
            return;
        }

        const OldSubscription = await this.getStripeSubscription(stripe, customerId);
        if (OldSubscription) {
            // Update the subscription
        } else {
            // Create new subscription
            await stripe.subscriptions.create({
                customer: customerId,
                items: [
                    {
                        price: subscriptionPlan.planId,
                    },
                ],
                expand: ['latest_invoice.payment_intent'],
                metadata: {
                    email: email,
                    userId: userId,
                },
            });
        }

        await prisma.user.update({
            where: { email: email },
            data: {
                Subscription: {
                    upsert: {
                        create: {
                            description: subscriptionPlan.description,
                            name: subscriptionPlan.name,
                            planId: subscriptionPlan.planId,
                            price: subscriptionPlan.price,
                            currency: subscriptionPlan.currency,
                            interval: subscriptionPlan.interval,
                            intervalCount: subscriptionPlan.intervalCount,
                            identifier: v4(),
                        },
                        update: {
                            description: subscriptionPlan.description,
                            name: subscriptionPlan.name,
                            planId: subscriptionPlan.planId,
                            price: subscriptionPlan.price,
                            currency: subscriptionPlan.currency,
                            interval: subscriptionPlan.interval,
                            intervalCount: subscriptionPlan.intervalCount,
                        },
                    },
                },
            },
        });

        Logger.getInstance().logSuccess('Subscription started');
        return;
    }

    /**
     *
     *
     * Get stripe customer
     */
    private async getStripeCustomer(stripe: Stripe, email: string, userId: string, fullName: string) {
        try {
            const customer = await stripe.customers.search({
                query: `email:'${email}'`,
                limit: 1,
            });

            if (customer.data.length > 0) {
                return customer.data[0].id;
            } else {
                // We need to create a new customer
                const newCustomer = await stripe.customers.create({
                    email: email,
                    name: fullName,
                    metadata: {
                        email: email,
                        userId: userId,
                    },
                });

                return newCustomer.id;
            }
        } catch (error) {
            Logger.getInstance().logError('Error while creating stripe customer: ' + error);
            return null;
        }
    }

    /**
     *
     *
     * Get customer subscription
     */
    private async getStripeSubscription(stripe: Stripe, customerId: string) {
        try {
            const customer = await stripe.customers.retrieve(customerId);
            if (!customer.deleted && (customer.subscriptions?.data.length || 0) > 0) {
                // Look for subscription
                return customer.subscriptions?.data[0].id;
            } else {
                return undefined;
            }
        } catch (error) {
            return undefined;
        }
    }
}

/**
 *
 *
 * Validator
 */
class UserPaymentEventValidator {
    constructor(private data: ApiEventData) {}

    /**
     *
     * Validate data for startSubscription
     */
    public validateStartSubscription() {
        const { email } = this.data.data;

        if (email === undefined) {
            Logger.getInstance().logError('Invalid event body. email is required');
            return false;
        }

        if (!isDefined(email)) {
            Logger.getInstance().logError('Invalid event body. email is required');
            return false;
        }

        if (!isValidEmail(email)) {
            Logger.getInstance().logError('Invalid email');
            return false;
        }

        return true;
    }
}
