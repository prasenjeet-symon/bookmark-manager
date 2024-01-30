import { URL } from 'url';
import { ApiEventData } from '.';
import passwordResetSuccessEmailRender from '../emails/password-reset-done.email';
import passwordResetEmailRender from '../emails/password-reset-link.email';
import { EmailOptions } from '../schema';
import { Logger, PrismaClientSingleton, sendEmail } from '../utils';

export class AuthenticationEvent {
    private data: ApiEventData;

    constructor(data: ApiEventData) {
        this.data = data;
    }

    /**
     * Send password reset link
     */
    async sendPasswordResetLinkEmail() {
        if (!this.validateSendPasswordResetLinkEmailEventData()) {
            Logger.getInstance().logError('Invalid event data');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;
        const { token, email } = this.data.data;
        const { RESET_PASSWORD_BASE_URL } = process.env;

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            Logger.getInstance().logError('User not found');
            return;
        }

        const link = new URL(RESET_PASSWORD_BASE_URL || '');
        link.searchParams.append('token', token);
        link.searchParams.append('userId', user.userId);

        const template = passwordResetEmailRender(user, link.toString());

        const emailData: EmailOptions = {
            subject: 'Reset your password',
            html: template,
            to: email,
        };

        const sendId = await sendEmail(emailData);
        Logger.getInstance().logSuccess('Email sent successfully with id: ' + sendId);
        return;
    }
    /**
     *
     * Password reset success email
     */
    async sendResetPasswordSuccessEmail() {
        if (!this.validateSendResetPasswordSuccessEmailData()) {
            Logger.getInstance().logError('Invalid event data');
            return;
        }

        const { email, userId } = this.data.data;
        const prisma = PrismaClientSingleton.prisma;

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            Logger.getInstance().logError('User not found');
            return;
        }

        const template = passwordResetSuccessEmailRender(user);

        const emailData: EmailOptions = {
            subject: 'Password reset successful',
            html: template,
            to: email,
        };

        const sendId = await sendEmail(emailData);
        Logger.getInstance().logSuccess('Email sent successfully with id: ' + sendId);
        return;
    }

    /**
     * Validate data for sendPasswordResetLinkEmail
     */
    private validateSendPasswordResetLinkEmailEventData() {
        // We need RESET_PASSWORD_BASE_URL from env
        const { RESET_PASSWORD_BASE_URL } = process.env;
        if (RESET_PASSWORD_BASE_URL === undefined) {
            Logger.getInstance().logError('RESET_PASSWORD_BASE_URL is not defined. Please set it in .env file');
            return false;
        }

        const { data } = this.data;

        if (data === undefined) {
            Logger.getInstance().logError('Invalid event body. data is required');
            return false;
        }

        const { token, email } = data;

        if (token === undefined || email === undefined) {
            Logger.getInstance().logError('Invalid event body. token and email are required');
            return false;
        }

        return true;
    }

    /**
     *
     * Validate data for sendResetPasswordSuccessEmail
     */
    private validateSendResetPasswordSuccessEmailData() {
        // We need email and user id
        const { data } = this.data;

        if (data === undefined) {
            Logger.getInstance().logError('Invalid event body. data is required');
            return false;
        }

        const { email, userId } = data;

        if (email === undefined || userId === undefined) {
            Logger.getInstance().logError('Invalid event body. email and userId are required');
            return false;
        }

        return true;
    }
}
