import { ApiEvent, ApiEventData, ApiEventNames } from '.';
import farewellEmailRender from '../emails/farewell.email';
import greetingEmailRender from '../emails/greeting.email';
import { EmailOptions } from '../schema';
import { Logger, PrismaClientSingleton, sendEmail } from '../utils';

export class UserEvent {
    private data: ApiEventData;

    constructor(data: ApiEventData) {
        this.data = data;
    }

    /**
     * User created
     */
    async createdUser() {
        if (!this.validateUserCreatedEventData()) {
            Logger.getInstance().logError('Invalid event data');
            return;
        }

        const { userId, email } = this.data.data;
        const prisma = PrismaClientSingleton.prisma;

        const createdUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!createdUser) {
            Logger.getInstance().logError('User not found');
            return;
        }

        if (createdUser.isDeleted) {
            Logger.getInstance().logError('User is deleted');
            return;
        }

        // Send greeting email
        ApiEvent.getInstance().dispatch(ApiEventNames.SEND_GREETING_EMAIL, {
            email: email,
            userId: userId,
        });
    }

    /**
     * User is deleted
     */
    async deleteUser() {
        if (!this.validateDeleteUserEventData()) {
            Logger.getInstance().logError('Invalid event data');
            return;
        }

        const { userId, email } = this.data.data;
        const prisma = PrismaClientSingleton.prisma;

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            Logger.getInstance().logError('User not found');
            return;
        }

        // Is user really deleted?
        if (!user.isDeleted) {
            Logger.getInstance().logError('User is not deleted');
            return;
        }

        // We need to delete all it's children
        // Tab -> Category -> Link
        const deletedUserWithTabs = await prisma.user.update({
            where: { userId: userId },
            data: {
                isDeleted: true,
                userTabs: {
                    updateMany: {
                        where: {
                            isDeleted: false,
                        },
                        data: { isDeleted: true },
                    },
                },
                links: {
                    updateMany: {
                        where: {
                            isDeleted: false,
                        },
                        data: { isDeleted: true },
                    },
                },
            },
            select: {
                userTabs: true,
            },
        });

        const [_, deletedCategories] = await prisma.$transaction([
            prisma.category.updateMany({
                where: {
                    tabIdentifier: {
                        in: deletedUserWithTabs.userTabs.map((tab) => tab.identifier),
                    },
                    isDeleted: false,
                },
                data: {
                    isDeleted: true,
                },
            }),
            prisma.category.findMany({
                where: {
                    tabIdentifier: {
                        in: deletedUserWithTabs.userTabs.map((tab) => tab.identifier),
                    },
                },
            }),
        ]);

        // Delete links of categories
        await prisma.$transaction([
            prisma.link.updateMany({
                where: {
                    categoryIdentifier: {
                        in: deletedCategories.map((category) => category.identifier),
                    },
                    isDeleted: false,
                },
                data: {
                    isDeleted: true,
                },
            }),
        ]);

        return;
    }

    // Send greeting email
    async sendGreetingEmail() {
        if (!this.validateSendGreetingEmailEventData()) {
            Logger.getInstance().logError('Invalid event data');
            return;
        }

        const { userId, email } = this.data.data;
        const { COMPANY_NAME, COMPANY_BASE_URL } = process.env;

        // Fetch user
        const prisma = PrismaClientSingleton.prisma;
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            Logger.getInstance().logError('User not found');
            return;
        }

        // Send email
        const template = greetingEmailRender(user, COMPANY_NAME!, COMPANY_BASE_URL!);
        const emailData: EmailOptions = {
            subject: 'Welcome to Bookmark Manager',
            html: template,
            to: email,
        };

        const sendId = await sendEmail(emailData);
        Logger.getInstance().logSuccess('Email sent successfully with id: ' + sendId);
    }
    /**
     * Send farewells email
     */
    async sendFarewellsEmail() {
        if (!this.validateSendFarewellsEmailEventData()) {
            Logger.getInstance().logError('Invalid event data');
            return;
        }

        const { userId, email } = this.data.data;
        const { COMPANY_NAME, COMPANY_BASE_URL } = process.env;
        const prisma = PrismaClientSingleton.prisma;

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            Logger.getInstance().logError('User not found');
            return;
        }

        const template = farewellEmailRender(user);

        const emailData: EmailOptions = {
            subject: 'Goodbye from Bookmark Manager',
            html: template,
            to: email,
        };

        const sendId = await sendEmail(emailData);
        Logger.getInstance().logSuccess('Email sent successfully with id: ' + sendId);
        return;
    }

    /**
     *
     * Validate data for sendGreetingEmail
     */
    private validateSendGreetingEmailEventData() {
        // We need COMPANY_NAME and  COMPANY_BASE_URL from env
        const { COMPANY_NAME, COMPANY_BASE_URL } = process.env;

        if (COMPANY_NAME === undefined || COMPANY_BASE_URL === undefined) {
            Logger.getInstance().logError(
                'Missing environment variables. COMPANY_NAME and COMPANY_BASE_URL are required'
            );

            return false;
        }

        const { data } = this.data;

        if (data === undefined) {
            Logger.getInstance().logError('Invalid event body. data is required');
            return false;
        }

        const { userId, email } = data;

        if (userId === undefined || email === undefined) {
            Logger.getInstance().logError('Invalid event body. userId and email are required');
            return false;
        }

        return true;
    }
    /**
     *
     * Validate data for deleteUser
     */
    private validateDeleteUserEventData() {
        const { data } = this.data;

        if (data === undefined) {
            Logger.getInstance().logError('Invalid event body. data is required');
            return false;
        }

        const { userId, email } = data;

        if (userId === undefined || email === undefined) {
            Logger.getInstance().logError('Invalid event body. userId and email are required');
            return false;
        }

        return true;
    }
    /**
     *
     * Validate data for sendFarewellsEmail
     */
    private validateSendFarewellsEmailEventData() {
        // We need COMPANY_NAME and  COMPANY_BASE_URL from env
        const { COMPANY_NAME, COMPANY_BASE_URL } = process.env;

        if (COMPANY_NAME === undefined || COMPANY_BASE_URL === undefined) {
            Logger.getInstance().logError(
                'Missing environment variables. COMPANY_NAME and COMPANY_BASE_URL are required'
            );

            return false;
        }

        const { data } = this.data;

        if (data === undefined) {
            Logger.getInstance().logError('Invalid event body. data is required');
            return false;
        }

        const { userId, email } = data;

        if (userId === undefined || email === undefined) {
            Logger.getInstance().logError('Invalid event body. userId and email are required');
            return false;
        }

        return true;
    }

    /**
     * Validate data for user created
     */
    private validateUserCreatedEventData() {
        const { data } = this.data;

        if (data === undefined) {
            Logger.getInstance().logError('Invalid event body. data is required');
            return false;
        }

        const { userId, email } = data;

        if (userId === undefined || email === undefined) {
            Logger.getInstance().logError('Invalid event body. userId and email are required');
            return false;
        }

        return true;
    }
}
