import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { ApiEvent, ApiEventNames } from '../events';
import {
    Logger,
    PrismaClientSingleton,
    createJwt,
    getClientIP,
    getClientLocation,
    getJwtExpirationDate,
    getUserAgent,
    hashPassword,
    isTokenActive,
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
        const { fullName } = this.req.body;
        const ipLocation = await getClientLocation(this.req);

        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                fullName: fullName || '',
                userId: v4(),
                timeZone: ipLocation?.timezone || '',
                userSetting: {
                    create: {
                        numberOfColumns: 'THREE',
                    },
                },
            },
            select: {
                userId: true,
                email: true,
                fullName: true,
                timeZone: true,
            },
        });

        const token = await createJwt(newUser.userId, newUser.email, false, null, ipLocation?.timezone || null);

        // Add session
        await prisma.user.update({
            where: {
                userId: newUser.userId,
            },
            data: {
                sessions: {
                    upsert: {
                        where: { sessionToken: token },
                        create: {
                            sessionToken: token,
                            expires: getJwtExpirationDate(token),
                            ipAddress: getClientIP(this.req),
                            userAgent: getUserAgent(this.req),
                            city: ipLocation?.city || '',
                            country: ipLocation?.country || '',
                            loc: ipLocation?.loc || '',
                            org: ipLocation?.org || '',
                            postal: ipLocation?.postal || '',
                            region: ipLocation?.region || '',
                            timezone: ipLocation?.timezone || '',
                        },
                        update: {
                            expires: getJwtExpirationDate(token),
                            ipAddress: getClientIP(this.req),
                            userAgent: getUserAgent(this.req),
                            city: ipLocation?.city || '',
                            country: ipLocation?.country || '',
                            loc: ipLocation?.loc || '',
                            org: ipLocation?.org || '',
                            postal: ipLocation?.postal || '',
                            region: ipLocation?.region || '',
                            timezone: ipLocation?.timezone || '',
                        },
                    },
                },
            },
        });

        this.res.status(200).json({
            token: token,
            userId: newUser.userId,
            email: newUser.email,
            fullName: newUser.fullName,
            timeZone: ipLocation?.timezone || null,
        });

        Logger.getInstance().logSuccess('User created');
        console.log(`User created: ${newUser.userId}`);

        ApiEvent.getInstance().dispatch(ApiEventNames.USER_CREATED, {
            userId: newUser.userId,
            email: newUser.email,
        });

        ApiEvent.getInstance().dispatch(ApiEventNames.INIT_USER_FREE_TRIAL, {
            email: newUser.email,
        });

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

        const ipLocation = await getClientLocation(this.req);
        const token = await createJwt(user.userId, user.email, false, null, ipLocation?.timezone || null);

        // Add session
        await prisma.user.update({
            where: {
                userId: user.userId,
            },
            data: {
                sessions: {
                    upsert: {
                        where: { sessionToken: token },
                        create: {
                            sessionToken: token,
                            expires: getJwtExpirationDate(token),
                            ipAddress: getClientIP(this.req),
                            userAgent: getUserAgent(this.req),
                            city: ipLocation?.city || '',
                            country: ipLocation?.country || '',
                            loc: ipLocation?.loc || '',
                            org: ipLocation?.org || '',
                            postal: ipLocation?.postal || '',
                            region: ipLocation?.region || '',
                            timezone: ipLocation?.timezone || '',
                        },
                        update: {
                            expires: getJwtExpirationDate(token),
                            ipAddress: getClientIP(this.req),
                            userAgent: getUserAgent(this.req),
                            city: ipLocation?.city || '',
                            country: ipLocation?.country || '',
                            loc: ipLocation?.loc || '',
                            org: ipLocation?.org || '',
                            postal: ipLocation?.postal || '',
                            region: ipLocation?.region || '',
                            timezone: ipLocation?.timezone || '',
                        },
                    },
                },
            },
        });

        this.res.status(200).json({
            token: token,
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            timeZone: ipLocation?.timezone || null,
        });

        Logger.getInstance().logSuccess('User logged in');

        return;
    }
    /**
     *
     * Logout user
     */
    async logout() {
        // We have to remove the session
        // Should have token
        if (!this.validLogoutReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const { token } = this.req.body;
        const prisma = PrismaClientSingleton.prisma;
        const email = this.res.locals.email;

        const userWithSession = await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                sessions: {
                    where: { sessionToken: token },
                },
            },
        });

        if (!userWithSession) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        if (userWithSession.sessions.length === 0) {
            this.res.status(400).json({ error: 'Session not found' });
            Logger.getInstance().logError('Session not found');
            return;
        }

        await prisma.user.update({
            where: {
                userId: userWithSession.userId,
            },
            data: {
                sessions: {
                    update: {
                        where: { sessionToken: token },
                        data: {
                            isDeleted: true,
                        },
                    },
                },
            },
        });

        this.res.status(200).json({ success: 'User logged out' });
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

        const token = await createJwt(user.userId, user.email, false, '1d', null);

        this.res.status(200).json({
            message: 'Forgot password link sent to your email',
        });

        ApiEvent.getInstance().dispatch(ApiEventNames.SEND_PASSWORD_RESET_LINK_EMAIL, {
            email: user.email,
            token: token,
        });

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

        const isTokenAct = isTokenActive(token);

        if (!isTokenAct) {
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

        const ipLocation = await getClientLocation(this.req);
        const jwtToken = await createJwt(user.userId, user.email, false, null, ipLocation?.timezone || null);

        // Add session
        await prisma.user.update({
            where: {
                userId: user.userId,
            },
            data: {
                sessions: {
                    upsert: {
                        where: { sessionToken: jwtToken },
                        create: {
                            sessionToken: jwtToken,
                            expires: getJwtExpirationDate(jwtToken),
                            ipAddress: getClientIP(this.req),
                            userAgent: getUserAgent(this.req),
                            city: ipLocation?.city || '',
                            country: ipLocation?.country || '',
                            loc: ipLocation?.loc || '',
                            org: ipLocation?.org || '',
                            postal: ipLocation?.postal || '',
                            region: ipLocation?.region || '',
                            timezone: ipLocation?.timezone || '',
                        },
                        update: {
                            expires: getJwtExpirationDate(jwtToken),
                            ipAddress: getClientIP(this.req),
                            userAgent: getUserAgent(this.req),
                            city: ipLocation?.city || '',
                            country: ipLocation?.country || '',
                            loc: ipLocation?.loc || '',
                            org: ipLocation?.org || '',
                            postal: ipLocation?.postal || '',
                            region: ipLocation?.region || '',
                            timezone: ipLocation?.timezone || '',
                        },
                    },
                },
            },
        });

        this.res.status(200).json({
            token: jwtToken,
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            timeZone: ipLocation?.timezone || '',
        });

        Logger.getInstance().logSuccess('Password reset');

        ApiEvent.getInstance().dispatch(ApiEventNames.SEND_RESET_PASSWORD_SUCCESS_EMAIL, {
            userId: user.userId,
            email: user.email,
        });

        // TODO We need to logout from all devices after password reset
        return;
    }
    /**
     *
     *
     * Is token valid
     */
    async isTokenValid() {
        if (!this.validReqBodyIsTokenValid()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const { token } = this.req.body;

        const isActiveToken = isTokenActive(token);

        if (!isActiveToken) {
            this.res.status(400).json({ error: 'Token expired' });
            Logger.getInstance().logError('Token expired');
            return;
        }

        this.res.status(200).json({ valid: true });
        Logger.getInstance().logSuccess('Token valid');
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

    /**
     *
     * Valid req body for is token valid
     */
    validReqBodyIsTokenValid(): boolean {
        const { token } = this.req.body;

        if (!token) {
            this.res.status(400).json({ error: 'token is required' });
            Logger.getInstance().logError('token is required');
            return false;
        }

        return true;
    }
    /**
     *
     * Validate logout request body
     */
    validLogoutReqBody(): boolean {
        const { token } = this.req.body;

        if (token === undefined) {
            this.res.status(400).json({ error: 'token is required' });
            Logger.getInstance().logError('token is required');
            return false;
        }

        if (!token) {
            this.res.status(400).json({ error: 'token is required' });
            Logger.getInstance().logError('token is required');
            return false;
        }

        return true;
    }
}
