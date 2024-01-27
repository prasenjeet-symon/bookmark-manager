import { Request, Response } from 'express';
import { Logger, PrismaClientSingleton } from '../utils';

export class CategoryController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Get all categories of given tab identifier
     */
    async getAllCategoriesOfTab() {
        if (!this.validateGetAllCategoriesOfTabReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;
        const email = this.res.locals.email;

        const userWithTabWithCategories = await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                userTabs: {
                    where: {
                        identifier: this.req.body.identifier,
                    },
                    include: {
                        categories: true,
                    },
                },
            },
        });

        if (!userWithTabWithCategories) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        if (userWithTabWithCategories.userTabs.length === 0) {
            this.res.status(400).json({ error: 'Tab not found' });
            Logger.getInstance().logError('Tab not found');
            return;
        }

        const categories = userWithTabWithCategories.userTabs[0].categories;

        this.res.status(200).json({ categories });

        return;
    }

    /**
     * Validate request body of get all categories of given tab
     */
    validateGetAllCategoriesOfTabReqBody(): boolean {
        const { identifier } = this.req.body;

        if (identifier === undefined) {
            this.res.status(400).json({ error: 'Missing identifier' });
            Logger.getInstance().logError('Missing identifier');
            return false;
        }

        return true;
    }
}
