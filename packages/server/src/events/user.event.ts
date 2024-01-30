import { ApiEventData } from '.';
import greetingEmailRender from '../emails/greeting.email';
import { EmailOptions } from '../schema';
import { Logger, PrismaClientSingleton, sendEmail } from '../utils';

export class UserEvent {
    private data: ApiEventData;

    constructor(data: ApiEventData) {
        this.data = data;
    }

    // Send greeting email
    async sendGreetingEmail() {
        if (!this.validateSendGreetingEmailEventData()) {
            Logger.getInstance().logError('Invalid event data');
            return;
        }

        const { userId, email } = this.data.data;

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
        const template = greetingEmailRender(user);
        const emailData: EmailOptions = {
            subject: 'Welcome to Bookmark Manager',
            html: template,
            to: email,
        };

        const sendId = await sendEmail(emailData);
        Logger.getInstance().logSuccess('Email sent successfully with id: ' + sendId);
    }

    /**
     *
     * Validate data for sendGreetingEmail
     */
    private validateSendGreetingEmailEventData() {
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
    }
}
