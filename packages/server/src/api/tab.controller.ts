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

        if (!this.validateAddUpdateTabReqBody()) {
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
                        identifier: this.req.body.identifier,
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Tab added' });
        return;
    }
    /**
     *
     * Update tab
     */
    async updateTab() {
        const email = this.res.locals.email; // Target user

        if (!this.validateAddUpdateTabReqBody()) {
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
                    update: {
                        where: {
                            identifier: this.req.body.identifier,
                        },
                        data: {
                            name: this.req.body.name,
                            order: +this.req.body.order,
                        },
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Tab updated' });

        return;
    }

    /**
     *
     * Validate request body of add tab
     *
     */
    validateAddUpdateTabReqBody(): boolean {
        const { name, order, identifier } = this.req.body;

        if (name === undefined || order === undefined || identifier === undefined) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
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
