import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { Logger, PrismaClientSingleton, createJwt, hashPassword, isValidEmail, isValidPassword } from '../utils';

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
}
