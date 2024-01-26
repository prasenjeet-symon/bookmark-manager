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
     * Add new tab
     *
     */
    async addTab() {
        const email = this.res.locals.email; // Target user

        if (!this.validateAddTabReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;

        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                userTabs: {
                    create: {
                        name: this.req.body.name,
                        order: +this.req.body.order,
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Tab added' });
        return;
    }

    /**
     *
     * Validate request body of add tab
     *
     */
    validateAddTabReqBody(): boolean {
        const { name, order } = this.req.body;

        if (name === undefined || order === undefined) {
            this.res.status(400).json({ error: 'name and order are required' });
            Logger.getInstance().logError('name and order are required');
            return false;
        }

        // order is number
        if (typeof order !== 'number') {
            this.res.status(400).json({ error: 'order must be a number' });
            Logger.getInstance().logError('order must be a number');
            return false;
        }

        return true;
    }
}
