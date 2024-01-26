import { Request, Response } from 'express';
import { v4 } from 'uuid';
import {
    Logger,
    PrismaClientSingleton,
    createJwt,
    hashPassword,
    isTokenExpired,
    isValidEmail,
    isValidPassword,
} from '../utils';

export class SignupController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     * Asynchronous function for user signup.
     */
    async signup() {
        if (!this.validReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const { email, password } = this.req.body;

        // Check if the user already exit with the same email
        const prisma = PrismaClientSingleton.prisma;

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (user) {
            this.res.status(400).json({ error: 'User already exists' });
            Logger.getInstance().logError('User already exists');
            return;
        }

        // We can create new user with this email
        const hashedPassword = hashPassword(password);
        const { fullName, timeZone } = this.req.body;

        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                fullName: fullName || '',
                userId: v4(),
                timeZone: timeZone || null,
            },
            select: {
                userId: true,
                email: true,
                fullName: true,
                timeZone: true,
            },
        });

        const token = await createJwt(newUser.userId, newUser.email);

        this.res.status(200).json({
            token: token,
            userId: newUser.userId,
            email: newUser.email,
            fullName: newUser.fullName,
            timeZone: newUser.timeZone,
        });

        Logger.getInstance().logSuccess('User created');
        return;
    }
    /**
     *
     * Login
     */
    async login() {
        if (!this.validReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const { email, password } = this.req.body;

        const prisma = PrismaClientSingleton.prisma;

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                userId: true,
                email: true,
                password: true,
                fullName: true,
                timeZone: true,
            },
        });

        if (!user) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        const validPassword = hashPassword(password) === user.password;

        if (!validPassword) {
            this.res.status(400).json({ error: 'Invalid password' });
            Logger.getInstance().logError('Invalid password');
            return;
        }

        const token = await createJwt(user.userId, user.email);

        this.res.status(200).json({
            token: token,
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            timeZone: user.timeZone,
        });

        Logger.getInstance().logSuccess('User logged in');

        return;
    }
    /**
     *
     * Forgot password
     */
    async forgotPassword() {
        // We just need to check if the user with given email exit or not
        // If it exit then send the email with forgot password link
        // That link contains token and user id that can we use to reset password
        if (!this.validReqBodyForgotPassword()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const { email } = this.req.body;

        const prisma = PrismaClientSingleton.prisma;

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        const token = await createJwt(user.userId, user.email, false, '10m');

        this.res.status(200).json({
            userId: user.userId,
            email: user.email,
        });

        // SEND EMAIL HERE WITH FORGOT PASSWORD LINK THAT CONTAINS TOKEN AND USER ID
        return;
    }
    /**
     *
     * Reset password
     */
    async resetPassword() {
        if (!this.validReqBodyResetPassword()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const { userId, password, token } = this.req.body;

        // Do user exit with the given user id
        const prisma = PrismaClientSingleton.prisma;

        const user = await prisma.user.findFirst({
            where: {
                userId: userId,
            },
        });

        if (!user) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        const isTokenActive = isTokenExpired(token);

        if (!isTokenActive) {
            this.res.status(400).json({ error: 'Token expired' });
            Logger.getInstance().logError('Token expired');
            return;
        }

        const hashedPassword = hashPassword(password);

        await prisma.user.update({
            where: {
                email: user.email,
            },
            data: {
                password: hashedPassword,
            },
        });

        const jwtToken = await createJwt(user.userId, user.email);

        this.res.status(200).json({
            token: jwtToken,
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            timeZone: user.timeZone,
        });

        Logger.getInstance().logSuccess('Password reset');
        return;
    }

    /**
     *  Validates request body
     * @returns {boolean}
     */
    validReqBody(): boolean {
        const { email, password } = this.req.body;

        if (!email || !password) {
            this.res.status(400).json({ error: 'Email and password are required' });
            Logger.getInstance().logError('Email and password are required');
            return false;
        }

        if (!isValidEmail(email)) {
            this.res.status(400).json({ error: 'Invalid email' });
            Logger.getInstance().logError('Invalid email');
            return false;
        }

        const passwordValidation = isValidPassword(password);
        if (!passwordValidation.valid) {
            this.res.status(400).json({ error: passwordValidation.message });
            Logger.getInstance().logError(passwordValidation.message || 'Invalid password');
            return false;
        }

        return true;
    }

    /**
     * Valid req body for forgot password
     */
    validReqBodyForgotPassword(): boolean {
        const { email } = this.req.body;

        if (!email) {
            this.res.status(400).json({ error: 'Email is required' });
            Logger.getInstance().logError('Email is required');
            return false;
        }

        if (!isValidEmail(email)) {
            this.res.status(400).json({ error: 'Invalid email' });
            Logger.getInstance().logError('Invalid email');
            return false;
        }

        return true;
    }
    /**
     *
     * Valid req body for reset password
     */
    validReqBodyResetPassword(): boolean {
        const { userId, token, password } = this.req.body;

        if (!userId || !token || !password) {
            this.res.status(400).json({ error: 'userId, token and password are required' });
            Logger.getInstance().logError('userId, token and password are required');
            return false;
        }

        const passwordValidation = isValidPassword(password);

        if (!passwordValidation.valid) {
            this.res.status(400).json({ error: passwordValidation.message });
            Logger.getInstance().logError(passwordValidation.message || 'Invalid password');
            return false;
        }

        return true;
    }
}
