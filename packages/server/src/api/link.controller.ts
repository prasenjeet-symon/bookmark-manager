import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { Logger, PrismaClientSingleton, getCurrentTimestampInSecondsUTC, isInteger } from '../utils';

export class LinkController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }
    /**
     *
     * Get all catalog links
     */
    async getAllCatalogLinks() {
        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        const userWithLinks = await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                links: {
                    where: {
                        category: {
                            is: null,
                        },
                    },
                    include: {
                        linkTags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                },
            },
        });

        if (!userWithLinks) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        const links = userWithLinks.links.map((link) => {
            return {
                ...link,
                tags: link.linkTags.map((s) => s.tag.name),
            };
        });

        this.res.status(200).json(links);
        return;
    }
    /**
     *
     * Add link to catalog
     */
    async addLinkToCatalog() {
        if (!this.validateAddLinkToCatalogReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;
        const hiddenTags = [
            'uncategorized',
            'catalog',
            'other',
            `catalog__${getCurrentTimestampInSecondsUTC()}__${v4()}`,
        ];

        await prisma.user.update({
            where: { email: email },
            data: {
                links: {
                    upsert: {
                        where: { identifier: this.req.body.identifier },
                        create: {
                            identifier: this.req.body.identifier,
                            order: +this.req.body.order,
                            title: this.req.body.title,
                            url: this.req.body.url,
                            icon: this.req.body.icon || null,
                            notes: this.req.body.notes || null,
                            color: this.req.body.color || null,
                            linkTags: {
                                create: [
                                    ...(this.req.body.tags as string[]).map((tag) => ({
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
                            linkHiddenTags: {
                                create: [
                                    ...(hiddenTags as string[]).map((tag) => ({
                                        tag: {
                                            connectOrCreate: {
                                                where: { identifier: tag.trim() },
                                                create: {
                                                    identifier: tag.trim(),
                                                    name: tag.trim(),
                                                    order: 1,
                                                },
                                            },
                                        },
                                    })),
                                ],
                            },
                        },
                        update: {
                            order: +this.req.body.order,
                            title: this.req.body.title,
                            color: this.req.body.color || null,
                            url: this.req.body.url,
                            icon: this.req.body.icon || null,
                            notes: this.req.body.notes || null,
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
     * Get links incrementally
     */
    async getLinksIncrementally() {
        const { lastUpdatedTime } = this.req.body;

        if (lastUpdatedTime === undefined) {
            // Return all links
            return this.getAllLinks();
        } else {
            // Return links updated after lastUpdatedTime
            return this.getLinksUpdated();
        }
    }
    /**
     *
     * Get all links updated after lastUpdatedTime
     */
    async getLinksUpdated() {
        if (!this.validateGetLinksUpdatedReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const { tabIdentifier, categoryIdentifier, lastUpdatedTime } = this.req.body;
        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        const userWithTabWithCategoryWithLinks = await prisma.user.findUnique({
            where: { email: email },
            include: {
                userTabs: {
                    where: { identifier: tabIdentifier },
                    include: {
                        categories: {
                            where: { identifier: categoryIdentifier },
                            include: {
                                links: {
                                    where: { updatedAt: { gte: lastUpdatedTime } },
                                    include: {
                                        linkTags: {
                                            include: {
                                                tag: true,
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

        if (!userWithTabWithCategoryWithLinks) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        if (userWithTabWithCategoryWithLinks.userTabs.length === 0) {
            this.res.status(400).json({ error: 'Tab not found' });
            Logger.getInstance().logError('Tab not found');
            return;
        }

        if (userWithTabWithCategoryWithLinks.userTabs[0].categories.length === 0) {
            this.res.status(400).json({ error: 'Category not found' });
            Logger.getInstance().logError('Category not found');
            return;
        }

        const links = userWithTabWithCategoryWithLinks.userTabs[0].categories[0].links.map((link) => {
            return {
                ...link,
                tags: link.linkTags.map((linkTag) => linkTag.tag.name),
            };
        });

        this.res.status(200).json(links);
        return;
    }

    /**
     * Get all links
     */
    async getAllLinks() {
        if (!this.validateGetAllLinksReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const email = this.res.locals.email;
        const { tabIdentifier, categoryIdentifier } = this.req.body;
        const prisma = PrismaClientSingleton.prisma;

        const userWithTabWithCategoryWithLinks = await prisma.user.findUnique({
            where: { email: email },
            include: {
                userTabs: {
                    where: { identifier: tabIdentifier },
                    include: {
                        categories: {
                            where: { identifier: categoryIdentifier },
                            include: {
                                links: {
                                    include: {
                                        linkTags: {
                                            include: {
                                                tag: true,
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

        if (!userWithTabWithCategoryWithLinks) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        if (userWithTabWithCategoryWithLinks.userTabs.length === 0) {
            this.res.status(400).json({ error: 'Tab not found' });
            Logger.getInstance().logError('Tab not found');
            return;
        }

        if (userWithTabWithCategoryWithLinks.userTabs[0].categories.length === 0) {
            this.res.status(400).json({ error: 'Category not found' });
            Logger.getInstance().logError('Category not found');
            return;
        }

        const links = userWithTabWithCategoryWithLinks.userTabs[0].categories[0].links.map((link) => {
            return {
                ...link,
                tags: link.linkTags.map((linkTag) => linkTag.tag.name),
            };
        })

        this.res.status(200).json(links);
        return;
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
        const hiddenTagTabIdentifier = `${tabIdentifier}__${getCurrentTimestampInSecondsUTC()}__${v4()}`;
        const hiddenTagCategoryIdentifier = `${categoryIdentifier}__${getCurrentTimestampInSecondsUTC()}__${v4()}`;
        const hiddenTags = [hiddenTagTabIdentifier, hiddenTagCategoryIdentifier];

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
                                                    color: this.req.body.color || null,
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
                                                    linkHiddenTags: {
                                                        create: [
                                                            ...hiddenTags.map((tag) => ({
                                                                tag: {
                                                                    connectOrCreate: {
                                                                        where: { identifier: tag.trim() },
                                                                        create: {
                                                                            identifier: tag.trim(),
                                                                            name: tag.trim(),
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
                                                    color: this.req.body.color || null,
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
                                                    color: this.req.body.color || null,
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
        const hiddenTags = [`deleted__${getCurrentTimestampInSecondsUTC()}__${v4()}`];

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
                                                    linkHiddenTags: {
                                                        create: [
                                                            ...hiddenTags.map((tag) => ({
                                                                tag: {
                                                                    connectOrCreate: {
                                                                        where: { identifier: tag.trim() },
                                                                        create: {
                                                                            identifier: tag.trim(),
                                                                            name: tag.trim(),
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
        const hiddenTags = [`${finalCategoryIdentifier}__${getCurrentTimestampInSecondsUTC()}__${v4()}`];

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

        // Check of the final category exists
        const finalCategory = await prisma.category.findUnique({
            where: { identifier: finalCategoryIdentifier },
        });

        if (!finalCategory) {
            this.res.status(404).json({ error: 'Category not found' });
            Logger.getInstance().logError('Category not found');
            return;
        }

        if (finalCategory.isDeleted) {
            this.res.status(404).json({ error: 'Category is deleted' });
            Logger.getInstance().logError('Category is deleted');
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
                linkHiddenTags: {
                    create: [
                        ...hiddenTags.map((tag) => ({
                            tag: {
                                connectOrCreate: {
                                    where: { identifier: tag.trim() },
                                    create: {
                                        identifier: tag.trim(),
                                        name: tag.trim(),
                                        order: 1,
                                    },
                                },
                            },
                        })),
                    ],
                },
            },
        });

        this.res.status(200).json({ message: 'Link moved successfully' });
        return;
    }
    /**
     *
     * Move catalog link to the category
     */
    async moveCatalogLink() {
        if (!this.validateMoveCatalogLinkReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;
        const email = this.res.locals.email;
        const { finalCategoryIdentifier, identifier } = this.req.body;
        const hiddenTags = [`${finalCategoryIdentifier}__${getCurrentTimestampInSecondsUTC()}__${v4()}`];

        const userWithLink = await prisma.user.findUnique({
            where: { email: email },
            include: {
                links: {
                    where: { identifier: identifier },
                },
            },
        });

        if (!userWithLink) {
            this.res.status(404).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        if (userWithLink.links.length === 0) {
            this.res.status(404).json({ error: 'Link not found' });
            Logger.getInstance().logError('Link not found');
            return;
        }

        // Get category's parent ( TAB )
        const categoryWithTab = await prisma.category.findUnique({
            where: { identifier: finalCategoryIdentifier },
            include: {
                tab: true,
            },
        });

        if (!categoryWithTab) {
            this.res.status(404).json({ error: 'Category not found' });
            Logger.getInstance().logError('Category not found');
            return;
        }

        if (categoryWithTab.isDeleted) {
            this.res.status(404).json({ error: 'Category is deleted' });
            Logger.getInstance().logError('Category is deleted');
            return;
        }

        if (!categoryWithTab.tab) {
            this.res.status(404).json({ error: 'Tab not found' });
            Logger.getInstance().logError('Tab not found');
            return;
        }

        const tabIdentifier = categoryWithTab.tab.identifier;
        hiddenTags.push(`${tabIdentifier}__${getCurrentTimestampInSecondsUTC()}`);

        // Move link to new category
        await prisma.link.update({
            where: {
                identifier: identifier,
            },
            data: {
                category: {
                    connect: { identifier: finalCategoryIdentifier },
                },
                linkHiddenTags: {
                    create: [
                        ...hiddenTags.map((tag) => ({
                            tag: {
                                connectOrCreate: {
                                    where: { identifier: tag.trim() },
                                    create: {
                                        identifier: tag.trim(),
                                        name: tag.trim(),
                                        order: 1,
                                    },
                                },
                            },
                        })),
                    ],
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
    /**
     *
     * Validate req body of get all links
     *
     */
    validateGetAllLinksReqBody(): boolean {
        const { tabIdentifier, categoryIdentifier } = this.req.body;

        if (tabIdentifier === undefined || categoryIdentifier === undefined) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        return true;
    }

    /**
     *
     * Validate req body of get links updated
     *
     */
    validateGetLinksUpdatedReqBody(): boolean {
        const { tabIdentifier, categoryIdentifier, lastUpdatedTime } = this.req.body;

        if (tabIdentifier === undefined || categoryIdentifier === undefined || lastUpdatedTime === undefined) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        return true;
    }
    /**
     *
     * Validate req body of add link to catalog
     */
    validateAddLinkToCatalogReqBody(): boolean {
        const { identifier } = this.req.body;

        if (identifier === undefined) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        const { order, title, url, icon, notes, color, tags } = this.req.body;

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

    /**
     *
     * Validate req body of move catalog link
     */
    validateMoveCatalogLinkReqBody(): boolean {
        const { finalCategoryIdentifier, identifier } = this.req.body;

        if (finalCategoryIdentifier === undefined || identifier === undefined) {
            this.res.status(400).json({ error: 'Missing parameters' });
            Logger.getInstance().logError('Missing parameters');
            return false;
        }

        return true;
    }
}
