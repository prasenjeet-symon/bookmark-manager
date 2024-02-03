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
     * Update user details
     */
    public async updateUser() {
        if (!this.validateUpdateUserReqBody()) {
            Logger.getInstance().logError('Invalid request body of update user');
            return;
        }

        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                dateOfBirth: this.req.body.dateOfBirth,
                fullName: this.req.body.fullName,
                mobile: this.req.body.mobile,
                profilePicture: this.req.body.profilePicture,
                timeZone: this.req.body.timeZone,
            },
        });

        this.res.status(200).json({ message: 'Update user success' });
        Logger.getInstance().logWarning('Update user success');
        return;
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

    /**
     *
     * Validate request body of update user
     */
    public validateUpdateUserReqBody(): boolean {
        const { dateOfBirth, fullName, mobile, profilePicture, timeZone } = this.req.body;

        if (
            dateOfBirth === undefined ||
            fullName === undefined ||
            mobile === undefined ||
            profilePicture === undefined ||
            timeZone === undefined
        ) {
            this.res
                .status(400)
                .json({ error: 'dateOfBirth, fullName, mobile, profilePicture, timeZone are required' });
            Logger.getInstance().logError('dateOfBirth, fullName, mobile, profilePicture, timeZone are required');
            return false;
        }

        return true;
    }
}
