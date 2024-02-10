import { Request, Response } from 'express';
import { ApiEvent, ApiEventNames } from '../events';
import { Logger, PrismaClientSingleton, isInteger } from '../utils';

export class CategoryController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }
    /**
     *
     * Get categories incrementally
     */
    async getAllCategoriesIncrementally() {
        if (!this.validateGetAllCategoriesIncrementallyReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const { lastUpdatedTime } = this.req.body;

        if (lastUpdatedTime === undefined) {
            // Return all categories
            return this.getAllCategoriesOfTab();
        } else {
            // Return categories updated after lastUpdatedTime
            return this.getAllCategoriesUpdated();
        }
    }
    /**
     *
     * Get all categories updated after lastUpdatedTime
     */
    async getAllCategoriesUpdated() {
        if (!this.validateGetAllCategoriesUpdatedReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const { tabIdentifier, lastUpdatedTime } = this.req.body;
        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        const userWithTabWithCategoriesUpdated = await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                userTabs: {
                    where: {
                        identifier: tabIdentifier,
                    },
                    include: {
                        categories: {
                            where: {
                                updatedAt: {
                                    gte: lastUpdatedTime,
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!userWithTabWithCategoriesUpdated) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        if (userWithTabWithCategoriesUpdated.userTabs.length === 0) {
            this.res.status(400).json({ error: 'Tab not found' });
            Logger.getInstance().logError('Tab not found');
            return;
        }

        const categories = userWithTabWithCategoriesUpdated.userTabs[0].categories;
        this.res.status(200).json(categories);
        return;
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
                        identifier: this.req.body.tabIdentifier,
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
        this.res.status(200).json(categories);
        return;
    }
    /**
     *
     * Add new category in given tab
     */
    async addCategory() {
        if (!this.validateAddUpdateCategoryReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;
        const email = this.res.locals.email;

        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                userTabs: {
                    update: {
                        where: {
                            identifier: this.req.body.tabIdentifier,
                        },
                        data: {
                            categories: {
                                upsert: {
                                    where: { identifier: this.req.body.identifier },
                                    create: {
                                        color: this.req.body.color || null,
                                        identifier: this.req.body.identifier,
                                        name: this.req.body.name,
                                        order: +this.req.body.order,
                                        icon: this.req.body.icon || null,
                                    },
                                    update: {
                                        color: this.req.body.color || null,
                                        name: this.req.body.name,
                                        order: +this.req.body.order,
                                        icon: this.req.body.icon || null,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Category added successfully' });
        return;
    }
    /**
     *
     * Update category
     */
    async updateCategory() {
        if (!this.validateAddUpdateCategoryReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;

        await prisma.user.update({
            where: {
                email: this.res.locals.email,
            },
            data: {
                userTabs: {
                    update: {
                        where: {
                            identifier: this.req.body.tabIdentifier,
                        },
                        data: {
                            categories: {
                                update: {
                                    where: {
                                        identifier: this.req.body.identifier,
                                    },
                                    data: {
                                        color: this.req.body.color,
                                        name: this.req.body.name,
                                        order: +this.req.body.order,
                                        icon: this.req.body.icon || null,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Category updated successfully' });
        return;
    }
    /**
     *
     * Delete category from given tab
     */
    async deleteCategory() {
        if (!this.validateDeleteCategoryReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;
        const email = this.res.locals.email;

        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                userTabs: {
                    update: {
                        where: {
                            identifier: this.req.body.tabIdentifier,
                        },
                        data: {
                            categories: {
                                update: {
                                    where: {
                                        identifier: this.req.body.identifier,
                                    },
                                    data: {
                                        isDeleted: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Category deleted successfully' });
        ApiEvent.getInstance().dispatch(ApiEventNames.CATEGORY_DELETED, {
            categoryIdentifier: this.req.body.identifier,
        });

        return;
    }
    /**
     * Validate request body of get all categories of given tab
     */
    validateGetAllCategoriesOfTabReqBody(): boolean {
        const { tabIdentifier } = this.req.body;

        if (tabIdentifier === undefined) {
            this.res.status(400).json({ error: 'Missing identifier' });
            Logger.getInstance().logError('Missing identifier');
            return false;
        }

        return true;
    }

    /**
     *
     * Validate request body of add/update category
     */
    validateAddUpdateCategoryReqBody(): boolean {
        const { color, identifier, name, order, tabIdentifier, icon } = this.req.body;

        if (
            identifier === undefined ||
            name === undefined ||
            order === undefined ||
            tabIdentifier === undefined
        ) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        if (!isInteger(order)) {
            this.res.status(400).json({ error: 'order must be a number' });
            Logger.getInstance().logError('order must be a number');
            return false;
        }

        return true;
    }
    /**
     *
     * Validate request body of delete category
     */
    validateDeleteCategoryReqBody(): boolean {
        const { identifier, tabIdentifier } = this.req.body;

        if (identifier === undefined || tabIdentifier === undefined) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        return true;
    }

    /**
     * Validate request body of get all categories incrementally
     */
    validateGetAllCategoriesIncrementallyReqBody(): boolean {
        const { tabIdentifier } = this.req.body;

        if (tabIdentifier === undefined) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        return true;
    }
    /**
     *
     * Validate request body of get all categories updated
     */
    validateGetAllCategoriesUpdatedReqBody(): boolean {
        const { lastUpdatedTime, tabIdentifier } = this.req.body;

        if (lastUpdatedTime === undefined || tabIdentifier === undefined) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        return true;
    }
}
