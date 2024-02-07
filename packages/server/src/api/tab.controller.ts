import { Request, Response } from 'express';
import { ApiEvent, ApiEventNames } from '../events';
import { Logger, PrismaClientSingleton, isInteger } from '../utils';

export class TabController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }
    /**
     * Get tabs of user incrementally
     */
    async getTabsIncrementally() {
        const { lastUpdatedTime } = this.req.body;

        if (lastUpdatedTime === undefined) {
            // Return all tabs
            return this.getTabs();
        } else {
            // Return tabs that is greater than lastUpdatedTime
            return this.getUpdatedTabs();
        }
    }

    /**
     *
     * Get all updated tabs that is greater than the last updated time
     */
    async getUpdatedTabs() {
        if (!this.validateGetUpdatedTabsReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        const userWithTabs = await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                userTabs: {
                    where: {
                        updatedAt: {
                            gte: this.req.body.lastUpdatedTime,
                        },
                    },
                },
            },
        });

        if (!userWithTabs) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        this.res.status(200).json(userWithTabs.userTabs);
        return;
    }
    /**
     *
     * Get tabs of user
     *
     */
    async getTabs() {
        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        const userWithTabs = await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                userTabs: true,
            },
        });

        if (!userWithTabs) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        this.res.status(200).json(userWithTabs.userTabs);
        return;
    }
    /**
     *
     * Add new tab
     *
     */
    async addTab() {
        if (!this.validateAddUpdateTabReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                userTabs: {
                    upsert: {
                        where: { identifier: this.req.body.identifier },
                        create: {
                            name: this.req.body.name,
                            color: this.req.body.color || null,
                            order: +this.req.body.order,
                            identifier: this.req.body.identifier,
                        },
                        update: {
                            name: this.req.body.name,
                            color: this.req.body.color || null, 
                            order: +this.req.body.order,
                            identifier: this.req.body.identifier,
                        },
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Tab added successfully' });
        return;
    }
    /**
     *
     * Update tab
     */
    async updateTab() {
        if (!this.validateAddUpdateTabReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const email = this.res.locals.email;
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
                            color: this.req.body.color || null,
                            order: +this.req.body.order,
                        },
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Tab updated successfully' });
        return;
    }
    /**
     *
     * Delete tab
     */
    async deleteTab() {
        if (!this.validateDeleteTabReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                userTabs: {
                    update: {
                        where: { identifier: this.req.body.identifier },
                        data: {
                            isDeleted: true,
                        },
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Tab deleted successfully' });
        ApiEvent.getInstance().dispatch(ApiEventNames.TAB_DELETED, {
            tabIdentifier: this.req.body.identifier,
        });

        return;
    }
    /**
     *
     * Validate request body of add tab
     *
     */
    validateAddUpdateTabReqBody(): boolean {
        const { name, order, identifier, color } = this.req.body;

        if (name === undefined || order === undefined || identifier === undefined) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        // order is number
        if (!isInteger(order)) {
            this.res.status(400).json({ error: 'order must be a integer number' });
            Logger.getInstance().logError('order must be a number');
            return false;
        }

        return true;
    }

    /**
     *
     * Validation of request body of delete tab
     */
    validateDeleteTabReqBody(): boolean {
        const { identifier } = this.req.body;

        if (identifier === undefined) {
            this.res.status(400).json({ error: 'Missing identifier' });
            Logger.getInstance().logError('Missing identifier');
            return false;
        }

        return true;
    }

    /**
     * Validate request body of get updated tabs
     */
    validateGetUpdatedTabsReqBody(): boolean {
        const { lastUpdatedTime } = this.req.body;

        if (lastUpdatedTime === undefined) {
            this.res.status(400).json({ error: 'Missing lastUpdatedTime' });
            Logger.getInstance().logError('Missing lastUpdatedTime');
            return false;
        }

        return true;
    }
}
