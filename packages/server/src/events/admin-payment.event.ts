import Stripe from 'stripe';
import { v4 } from 'uuid';
import { ApiEventData } from '.';
import { Logger, PrismaClientSingleton, getPrice, isDefined, isValidEmail } from '../utils';

export class AdminPaymentEvent {
    private data: ApiEventData;

    constructor(data: ApiEventData) {
        this.data = data;
    }

    /**
     *
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

        const adminUserId = this.data.data.adminUserId;
        const adminEmail = this.data.data.adminEmail;
        const stripe = new Stripe(STRIPE_KEY!);

        try {
            let priceId: string | null = null;

            const upstreamAllPricesActive = await stripe.prices.list({
                active: true,
            });

            const isThere = upstreamAllPricesActive.data.find((item) => {
                return item.nickname?.toLocaleLowerCase() === PLAN_NAME?.toLocaleLowerCase();
            });

            if (upstreamAllPricesActive.data.length > 0 && isThere) {
                // Price already created
                priceId = upstreamAllPricesActive.data[0].id;
                Logger.getInstance().logSuccess('Price already created : ' + upstreamAllPricesActive.data[0].id);
            } else {
                // We need to create a new price
                const price = await stripe.prices.create({
                    unit_amount: getPrice(PLAN_PRICE),
                    metadata: {
                        adminUserId: adminUserId,
                        adminEmail: adminEmail,
                    },
                    nickname: PLAN_NAME,
                    currency: PLAN_CURRENCY || 'usd',
                    recurring: {
                        interval: 'month',
                        interval_count: 1,
                        trial_period_days: +(FREE_TRIAL_DAYS || 30),
                    },
                    product_data: {
                        name: PLAN_NAME || 'Monthly Subscription',
                        statement_descriptor: PLAN_DESCRIPTION,
                        active: true,
                    },
                });

                priceId = price.id;
                Logger.getInstance().logSuccess('Price created : ' + price.id);
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
                                priceId: priceId,
                                price: getPrice(PLAN_PRICE),
                                currency: PLAN_CURRENCY || 'usd',
                                interval: 'month',
                                intervalCount: 1,
                            },
                            update: {
                                description: PLAN_DESCRIPTION || '',
                                name: PLAN_NAME || 'Monthly Subscription',
                                priceId: priceId,
                                price: getPrice(PLAN_PRICE),
                                currency: PLAN_CURRENCY || 'usd',
                                interval: 'month',
                                intervalCount: 1,
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
