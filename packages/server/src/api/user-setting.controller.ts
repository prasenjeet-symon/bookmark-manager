import { Request, Response } from 'express';
import { Logger, PrismaClientSingleton } from '../utils';

export class UserSetting {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Get user setting
     */
    async getUserSetting() {
        const email = this.res.locals.email; // Target user

        // Check if the setting exit or not
        const prisma = PrismaClientSingleton.prisma;

        const userWithSetting = await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                userSetting: true,
            },
        });

        if (!userWithSetting) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        this.res.status(200).json({
            userSetting: userWithSetting.userSetting,
        });

        return;
    }
}
