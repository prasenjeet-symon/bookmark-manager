import { Request, Response } from 'express';
import { Logger, PrismaClientSingleton } from '../utils';

export class TabController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Get tabs of user
     *
     */
    async getTabs() {
        const email = this.res.locals.email; // Target user

        const prisma = PrismaClientSingleton.prisma;

        const tabs = await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                userTabs: true,
            },
        });

        if (!tabs) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        this.res.status(200).json(tabs.userTabs);

        return;
    }
    /**
     * 
     * 
     */
}
