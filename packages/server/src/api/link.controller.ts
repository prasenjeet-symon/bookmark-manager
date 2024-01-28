import { Request, Response } from 'express';
import { Logger, PrismaClientSingleton, isInteger } from '../utils';

export class LinkController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Add new link to the given category ( where category may be optional )
     *
     */
    async addLink() {
        if (!this.validateAddLinkReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const email = this.res.locals.email;
        const { tabIdentifier, categoryIdentifier, identifier, tags } = this.req.body;
        const prisma = PrismaClientSingleton.prisma;

        await prisma.user.update({
            where: { email: email },
            data: {
                userTabs: {
                    update: {
                        where: { identifier: tabIdentifier },
                        data: {
                            categories: {
                                update: {
                                    where: { identifier: categoryIdentifier },
                                    data: {
                                        links: {
                                            upsert: {
                                                where: { identifier: identifier },
                                                create: {
                                                    identifier: identifier,
                                                    order: +this.req.body.order,
                                                    title: this.req.body.title,
                                                    url: this.req.body.url,
                                                    icon: this.req.body.icon || null,
                                                    notes: this.req.body.notes || null,
                                                    linkTags: {
                                                        create: [
                                                            ...(tags as string[]).map((tag) => ({
                                                                tag: {
                                                                    connectOrCreate: {
                                                                        where: { identifier: tag.trim().toLowerCase() },
                                                                        create: {
                                                                            identifier: tag.trim().toLowerCase(),
                                                                            name: tag.trim().toLowerCase(),
                                                                            order: 1,
                                                                        },
                                                                    },
                                                                },
                                                            })),
                                                        ],
                                                    },
                                                    user: {
                                                        connect: {
                                                            userId: this.res.locals.userId,
                                                        },
                                                    },
                                                },
                                                update: {
                                                    title: this.req.body.title,
                                                    url: this.req.body.url,
                                                    icon: this.req.body.icon || null,
                                                    notes: this.req.body.notes || null,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Link added successfully' });
        return;
    }
    /**
     *
     * Update a link
     */
    async updateLink() {
        if (!this.validateAddLinkReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const email = this.res.locals.email;
        const { tabIdentifier, categoryIdentifier, identifier, tags } = this.req.body;
        const prisma = PrismaClientSingleton.prisma;

        // We have to delete all the tags before updating
        await prisma.user.update({
            where: { email: email },
            data: {
                userTabs: {
                    update: {
                        where: { identifier: tabIdentifier },
                        data: {
                            categories: {
                                update: {
                                    where: { identifier: categoryIdentifier },
                                    data: {
                                        links: {
                                            update: {
                                                where: { identifier: identifier },
                                                data: {
                                                    linkTags: {
                                                        deleteMany: {},
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // Update the link and create new tags
        await prisma.user.update({
            where: { email: email },
            data: {
                userTabs: {
                    update: {
                        where: { identifier: tabIdentifier },
                        data: {
                            categories: {
                                update: {
                                    where: { identifier: categoryIdentifier },
                                    data: {
                                        links: {
                                            update: {
                                                where: { identifier: identifier },
                                                data: {
                                                    order: +this.req.body.order,
                                                    title: this.req.body.title,
                                                    url: this.req.body.url,
                                                    icon: this.req.body.icon || null,
                                                    notes: this.req.body.notes || null,
                                                    linkTags: {
                                                        create: [
                                                            ...(tags as string[]).map((tag) => ({
                                                                tag: {
                                                                    connectOrCreate: {
                                                                        where: { identifier: tag.trim().toLowerCase() },
                                                                        create: {
                                                                            identifier: tag.trim().toLowerCase(),
                                                                            name: tag.trim().toLowerCase(),
                                                                            order: 1,
                                                                        },
                                                                    },
                                                                },
                                                            })),
                                                        ],
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Link updated successfully' });
        return;
    }
    /**
     *
     * Delete link
     */
    async deleteLink() {
        if (!this.validateDeleteLinkReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;
        const email = this.res.locals.email;
        const { tabIdentifier, categoryIdentifier, identifier } = this.req.body;

        await prisma.user.update({
            where: { email: email },
            data: {
                userTabs: {
                    update: {
                        where: { identifier: tabIdentifier },
                        data: {
                            categories: {
                                update: {
                                    where: { identifier: categoryIdentifier },
                                    data: {
                                        links: {
                                            update: {
                                                where: { identifier: identifier },
                                                data: {
                                                    isDeleted: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Link deleted successfully' });
        return;
    }
    /**
     *
     * Move a link from one category to another
     */
    async moveLink() {
        if (!this.validateMoveLinkReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;
        const email = this.res.locals.email;
        const { tabIdentifier, categoryIdentifier, finalCategoryIdentifier, identifier } = this.req.body;

        const userWithTabWithCategoryWithLink = await prisma.user.findUnique({
            where: { email: email },
            include: {
                userTabs: {
                    where: { identifier: tabIdentifier },
                    include: {
                        categories: {
                            where: { identifier: categoryIdentifier },
                            include: {
                                links: {
                                    where: { identifier: identifier },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (
            userWithTabWithCategoryWithLink === null ||
            userWithTabWithCategoryWithLink.userTabs.length === 0 ||
            userWithTabWithCategoryWithLink.userTabs[0].categories.length === 0 ||
            userWithTabWithCategoryWithLink.userTabs[0].categories[0].links.length === 0
        ) {
            this.res.status(404).json({ error: 'Link not found' });
            Logger.getInstance().logError('Link not found');
            return;
        }

        // Move link to new category
        await prisma.link.update({
            where: {
                identifier: identifier,
            },
            data: {
                category: {
                    connect: {
                        identifier: finalCategoryIdentifier,
                    },
                },
            },
        });

        this.res.status(200).json({ message: 'Link moved successfully' });
        return;
    }
    /**
     *
     * Validate request body of move link
     */
    validateMoveLinkReqBody(): boolean {
        // We need tabIdentifier, categoryIdentifier, identifier
        const { tabIdentifier, categoryIdentifier, finalCategoryIdentifier, identifier } = this.req.body;

        if (
            tabIdentifier === undefined ||
            categoryIdentifier === undefined ||
            finalCategoryIdentifier === undefined ||
            identifier === undefined
        ) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        return true;
    }
    /**
     *
     * Validate request body of delete link
     */
    validateDeleteLinkReqBody(): boolean {
        // We need tabIdentifier, categoryIdentifier, identifier
        const { tabIdentifier, categoryIdentifier, identifier } = this.req.body;

        if (tabIdentifier === undefined || categoryIdentifier === undefined || identifier === undefined) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        return true;
    }
    /**
     *
     * Validate request body of add link
     *
     */
    validateAddLinkReqBody(): boolean {
        const { tabIdentifier, categoryIdentifier, identifier } = this.req.body;

        if (tabIdentifier === undefined || categoryIdentifier === undefined || identifier === undefined) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        const { order, title, url, icon, notes, tags } = this.req.body;

        if (order === undefined || title === undefined || url === undefined || tags === undefined) {
            this.res.status(400).json({ error: 'Invalid parameters' });
            Logger.getInstance().logError('Invalid parameters');
            return false;
        }

        if (!isInteger(order)) {
            this.res.status(400).json({ error: 'Order must be an integer' });
            Logger.getInstance().logError('Order must be an integer');
            return false;
        }

        // tags should be an array of strings
        if (!Array.isArray(tags)) {
            this.res.status(400).json({ error: 'Tags must be an array of strings' });
            Logger.getInstance().logError('Tags must be an array of strings');
            return false;
        }

        const isAllTagsValid = tags.every((tag) => typeof tag === 'string');
        if (!isAllTagsValid) {
            this.res.status(400).json({ error: 'Tags must be an array of strings' });
            Logger.getInstance().logError('Tags must be an array of strings');
            return false;
        }

        return true;
    }
}
