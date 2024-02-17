import { addDays } from 'date-fns';
import { v4 } from 'uuid';
import { ApiEvent, ApiEventData, ApiEventNames } from '.';
import renderSubscriptionCancelledEmail from '../emails/cancelled-subs';
import renderFreeTrialInitiatedEmail from '../emails/free-trial-init';
import renderSubscriptionActivatedEmail from '../emails/subscription-init';
import { EmailOptions } from '../schema';
import { Logger, PrismaClientSingleton, formatPrice, getPrice, isDefined, isValidEmail, sendEmail } from '../utils';

export class UserPaymentEvent {
    private data: ApiEventData;

    constructor(data: ApiEventData) {
        this.data = data;
    }

    /**
     *
     * Start free trial
     *
     */
    public async startFreeTrial() {
        const validator = new UserPaymentEventValidator(this.data);
        if (!validator.validateStartFreeTrial()) {
            Logger.getInstance().logError('Invalid event data of startFreeTrial');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;
        const { email } = this.data.data;
        const trialDays = process.env.FREE_TRIAL_DAYS;

        await prisma.user.update({
            where: { email: email },
            data: {
                FreeTrial: {
                    upsert: {
                        create: {
                            expires: addDays(new Date(), +trialDays!),
                            identifier: v4(),
                        },
                        update: {
                            expires: addDays(new Date(), +trialDays!),
                        },
                    },
                },
                Subscription: {
                    upsert: {
                        create: {
                            description: '',
                            identifier: v4(),
                            name: '',
                            price: getPrice(0),
                            priceId: '',
                            sessionId: '',
                            subscriptionId: '',
                        },
                        update: {
                            description: '',
                            name: '',
                            price: getPrice(0),
                            priceId: '',
                            sessionId: '',
                            subscriptionId: '',
                        },
                    },
                },
            },
        });

        ApiEvent.getInstance().dispatch(ApiEventNames.SEND_FREE_TRIAL_INITIATED_EMAIL, {
            email: email,
        });

        Logger.getInstance().logSuccess('Free trial started');
        return;
    }

    /**
     *
     *
     * Send free trial email
     */
    public async sendFreeTrialEmail() {
        const validator = new UserPaymentEventValidator(this.data);
        if (!validator.validateSendFreeTrialEmail()) {
            Logger.getInstance().logError('Invalid event data of sendFreeTrialEmail');
            return;
        }

        const { email } = this.data.data;
        const { COMPANY_NAME, COMPANY_BASE_URL, FREE_TRIAL_DAYS } = process.env;
        const prisma = PrismaClientSingleton.prisma;

        if (+FREE_TRIAL_DAYS! === 0) {
            Logger.getInstance().logSuccess('No free trial');
            return;
        }

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            Logger.getInstance().logError('User not found');
            return;
        }

        const template = renderFreeTrialInitiatedEmail(user, COMPANY_NAME!, COMPANY_BASE_URL!, +FREE_TRIAL_DAYS!);
        const emailData: EmailOptions = {
            subject: 'Free trial has been initiated',
            html: template,
            to: email,
        };

        const sendId = await sendEmail(emailData);
        Logger.getInstance().logSuccess('Email sent successfully with id: ' + sendId);
        return;
    }

    /**
     *
     * Send email subscription cancelled
     */
    public async sendSubscriptionCancelledEmail() {
        const validator = new UserPaymentEventValidator(this.data);
        if (!validator.validateSendSubscriptionCancelledEmail()) {
            Logger.getInstance().logError('Invalid event data of sendSubscriptionCancelledEmail');
            return;
        }

        const { email } = this.data.data;
        const { COMPANY_NAME } = process.env;

        const prisma = PrismaClientSingleton.prisma;

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            Logger.getInstance().logError('User not found');
            return;
        }

        const template = renderSubscriptionCancelledEmail(user, COMPANY_NAME!);

        const emailData: EmailOptions = {
            subject: 'Subscription has been cancelled',
            html: template,
            to: email,
        };

        const sendId = await sendEmail(emailData);

        Logger.getInstance().logSuccess('Email sent successfully with id: ' + sendId);
        return;
    }

    /**
     *
     * Send email subscription initiated
     */
    public async sendSubscriptionInitiatedEmail() {
        const validator = new UserPaymentEventValidator(this.data);
        if (!validator.validateSendSubscriptionInitiatedEmail()) {
            Logger.getInstance().logError('Invalid event data of sendSubscriptionInitiatedEmail');
            return;
        }

        const { email } = this.data.data;
        const { COMPANY_NAME, COMPANY_BASE_URL, PLAN_PRICE, PLAN_CURRENCY } = process.env;

        const prisma = PrismaClientSingleton.prisma;

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            Logger.getInstance().logError('User not found');
            return;
        }

        const price = formatPrice(PLAN_CURRENCY!, +PLAN_PRICE!);
        const template = renderSubscriptionActivatedEmail(user, COMPANY_NAME!, COMPANY_BASE_URL!, 'Prepaid', price);

        const emailData: EmailOptions = {
            subject: 'Subscription has been activated',
            html: template,
            to: email,
        };

        const sendId = await sendEmail(emailData);

        Logger.getInstance().logSuccess('Email sent successfully with id: ' + sendId);
        return;
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
     * Validate data for startFreeTrial
     */
    public validateStartFreeTrial() {
        const { FREE_TRIAL_DAYS } = process.env;
        const { email } = this.data.data;

        if (email === undefined || FREE_TRIAL_DAYS === undefined) {
            Logger.getInstance().logError('Invalid event data of startFreeTrial');
            return false;
        }

        if (!isDefined(FREE_TRIAL_DAYS) || !isDefined(email)) {
            Logger.getInstance().logError('Invalid event data of startFreeTrial');
            return false;
        }

        return true;
    }

    /**
     *
     *
     * validateSendFreeTrialEmail
     */
    public validateSendFreeTrialEmail() {
        const { email } = this.data.data;

        if (email === undefined) {
            Logger.getInstance().logError('email is required in event data of sendFreeTrialEmail');
            return false;
        }

        if (!isDefined(email)) {
            Logger.getInstance().logError('email is required in event data of sendFreeTrialEmail');
            return false;
        }

        if (!isValidEmail(email)) {
            Logger.getInstance().logError('Invalid email in event data of sendFreeTrialEmail');
            return false;
        }

        const { COMPANY_NAME, COMPANY_BASE_URL, FREE_TRIAL_DAYS } = process.env;

        if (COMPANY_NAME === undefined || COMPANY_BASE_URL === undefined || FREE_TRIAL_DAYS === undefined) {
            Logger.getInstance().logError('Missing environment variables. COMPANY_NAME, COMPANY_BASE_URL and FREE_TRIAL_DAYS are required');
            return false;
        }

        if (!isDefined(COMPANY_NAME) || !isDefined(COMPANY_BASE_URL) || !isDefined(FREE_TRIAL_DAYS)) {
            Logger.getInstance().logError('Missing environment variables. COMPANY_NAME, COMPANY_BASE_URL and FREE_TRIAL_DAYS are required');
            return false;
        }

        return true;
    }

    /**
     *
     * Validate data for sendSubscriptionCancelledEmail
     */
    public validateSendSubscriptionCancelledEmail() {
        const { email } = this.data.data;

        if (email === undefined) {
            Logger.getInstance().logError('email is required in event data of sendSubscriptionCancelledEmail');
            return false;
        }

        if (!isDefined(email)) {
            Logger.getInstance().logError('email is required in event data of sendSubscriptionCancelledEmail');
            return false;
        }

        if (!isValidEmail(email)) {
            Logger.getInstance().logError('Invalid email in event data of sendSubscriptionCancelledEmail');
            return false;
        }

        const { COMPANY_NAME } = process.env;

        if (COMPANY_NAME === undefined) {
            Logger.getInstance().logError('Missing environment variable. COMPANY_NAME is required');
            return false;
        }

        if (!isDefined(COMPANY_NAME)) {
            Logger.getInstance().logError('Missing environment variable. COMPANY_NAME is required');
            return false;
        }

        return true;
    }

    /**
     *
     * Validate data for sendSubscriptionInitiatedEmail
     */
    public validateSendSubscriptionInitiatedEmail() {
        const { email } = this.data.data;

        if (email === undefined) {
            Logger.getInstance().logError('email is required in event data of sendSubscriptionInitiatedEmail');
            return false;
        }

        if (!isDefined(email)) {
            Logger.getInstance().logError('email is required in event data of sendSubscriptionInitiatedEmail');
            return false;
        }

        if (!isValidEmail(email)) {
            Logger.getInstance().logError('Invalid email in event data of sendSubscriptionInitiatedEmail');
            return false;
        }

        const { COMPANY_NAME, COMPANY_BASE_URL, PLAN_PRICE, PLAN_CURRENCY } = process.env;

        if (COMPANY_NAME === undefined || COMPANY_BASE_URL === undefined || PLAN_PRICE === undefined || PLAN_CURRENCY === undefined) {
            Logger.getInstance().logError('Missing environment variables. COMPANY_NAME, COMPANY_BASE_URL, PLAN_PRICE and PLAN_CURRENCY are required');
            return false;
        }

        if (!isDefined(COMPANY_NAME) || !isDefined(COMPANY_BASE_URL) || !isDefined(PLAN_PRICE) || !isDefined(PLAN_CURRENCY)) {
            Logger.getInstance().logError('Missing environment variables. COMPANY_NAME, COMPANY_BASE_URL, PLAN_PRICE and PLAN_CURRENCY are required');
            return false;
        }

        return true;
    }
}
