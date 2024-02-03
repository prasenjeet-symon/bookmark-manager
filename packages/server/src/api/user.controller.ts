import { Request, Response } from 'express';
import { Logger, PrismaClientSingleton } from '../utils';

export class UserController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Get user details
     */
    public async getUser() {
        if (!this.validateGetUserReqBody()) {
            Logger.getInstance().logError('Invalid request body of get user');
            return;
        }

        const email = this.res.locals.email;
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

        this.res.status(200).json(user);
        Logger.getInstance().logWarning('Get user success');
        return;
    }

    /**
     *
     * Validate request body of get user
     */
    public validateGetUserReqBody(): boolean {
        return true;
    }
}
