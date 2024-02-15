import Stripe from 'stripe';
import { v4 } from 'uuid';
import { ApiEventData } from '.';
import { Logger, PrismaClientSingleton, isDefined, isInteger, isValidEmail } from '../utils';

export class AdminPaymentEvent {
    private data: ApiEventData;

    constructor(data: ApiEventData) {
        this.data = data;
    }

    /**
     *
     * Create new subscription plan
     */
    public async newSubscriptionPlan() {
        const validator = new AdminPaymentEventValidator(this.data);
        if (!validator.validateNewSubscriptionPlan()) {
            Logger.getInstance().logError('Invalid event data of newSubscriptionPlan');
            return;
        }

        const STRIPE_KEY = process.env.STRIPE_KEY;
        const PLAN_PRICE = process.env.PLAN_PRICE; // in cent
        const PLAN_NAME = process.env.PLAN_NAME;
        const PLAN_CURRENCY = process.env.PLAN_CURRENCY;
        const PLAN_DESCRIPTION = process.env.PLAN_DESCRIPTION;
        const FREE_TRIAL_DAYS = process.env.FREE_TRIAL_DAYS;
        const adminIdentifier = this.data.data.adminIdentifier;
        const adminEmail = this.data.data.adminEmail;

        const stripe = new Stripe(STRIPE_KEY!, {
            apiVersion: '2023-10-16', // specify the Stripe API version
        });

        try {
            let planId: string | null = null;

            // Old subscription
            const subscriptionOld = await stripe.prices.list({
                active: true,
            });

            const isThere = subscriptionOld.data.find((item) => {
                return item.nickname === PLAN_NAME && item.metadata?.adminIdentifier === adminIdentifier;
            });

            if (subscriptionOld.data.length > 0 && isThere) {
                planId = subscriptionOld.data[0].id;
                Logger.getInstance().logSuccess('Subscription already created : ' + subscriptionOld.data[0].id);
            } else {
                const price = await stripe.prices.create({
                    unit_amount: +(PLAN_PRICE || 0),
                    metadata: {
                        adminIdentifier: adminIdentifier,
                    },
                    nickname: PLAN_NAME,
                    currency: PLAN_CURRENCY || 'usd',
                    recurring: {
                        interval: 'month',
                        interval_count: 1,
                        trial_period_days: +(FREE_TRIAL_DAYS || 30),
                    },
                    product_data: {
                        // Selling services
                        name: PLAN_NAME || 'Monthly Subscription',
                        statement_descriptor: PLAN_DESCRIPTION,
                        active: true,
                    },
                });

                planId = price.id;
                Logger.getInstance().logSuccess('Subscription created : ' + price.id);
            }

            const prisma = PrismaClientSingleton.prisma;

            await prisma.admin.update({
                where: { email: adminEmail },
                data: {
                    subscription: {
                        upsert: {
                            create: {
                                description: PLAN_DESCRIPTION || '',
                                identifier: v4(),
                                name: PLAN_NAME || 'Monthly Subscription',
                                planId: planId,
                                price: +(PLAN_PRICE || 0),
                                currency: PLAN_CURRENCY || 'usd',
                            },
                            update: {
                                description: PLAN_DESCRIPTION || '',
                                identifier: v4(),
                                name: PLAN_NAME || 'Monthly Subscription',
                                planId: planId,
                                price: +(PLAN_PRICE || 0),
                                currency: PLAN_CURRENCY || 'usd',
                            },
                        },
                    },
                },
            });

            Logger.getInstance().logSuccess('Subscription updated');
            return;
        } catch (error: any) {
            Logger.getInstance().logError(error.message);
            return;
        }
    }
}

/**
 *
 *
 *
 *
 */
class AdminPaymentEventValidator {
    constructor(private data: ApiEventData) {}

    /**
     *
     * Validate data for newSubscriptionPlan
     */
    public validateNewSubscriptionPlan() {
        const { STRIPE_KEY, PLAN_PRICE, PLAN_NAME, PLAN_CURRENCY, PLAN_DESCRIPTION } = process.env;

        if (
            STRIPE_KEY === undefined ||
            PLAN_PRICE === undefined ||
            PLAN_NAME === undefined ||
            PLAN_CURRENCY === undefined ||
            PLAN_DESCRIPTION === undefined
        ) {
            Logger.getInstance().logError(
                'Missing environment variables. STRIPE_KEY, PLAN_PRICE, PLAN_NAME, PLAN_CURRENCY, PLAN_DESCRIPTION are required'
            );
            return false;
        }

        if (
            !isDefined(STRIPE_KEY) ||
            !isDefined(PLAN_PRICE) ||
            !isDefined(PLAN_NAME) ||
            !isDefined(PLAN_CURRENCY) ||
            !isDefined(PLAN_DESCRIPTION)
        ) {
            Logger.getInstance().logError(
                'Missing environment variables. STRIPE_KEY, PLAN_PRICE, PLAN_NAME, PLAN_CURRENCY, PLAN_DESCRIPTION are required'
            );
            return false;
        }

        if (!isInteger(PLAN_PRICE)) {
            Logger.getInstance().logError('Invalid PLAN_PRICE');
            return false;
        }

        const { adminIdentifier, adminEmail } = this.data.data;

        if (adminIdentifier === undefined || adminEmail === undefined) {
            Logger.getInstance().logError('adminIdentifier and adminEmail are required parameters');
            return false;
        }

        if (!isDefined(adminIdentifier) || !isDefined(adminEmail)) {
            Logger.getInstance().logError('adminIdentifier and adminEmail are required parameters');
            return false;
        }

        if (!isValidEmail(adminEmail)) {
            Logger.getInstance().logError('Invalid email');
            return false;
        }

        return true;
    }
}
