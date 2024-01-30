import { ApiEventData } from '.';
import { Logger, PrismaClientSingleton } from '../utils';

export class TabEvent {
    private data: ApiEventData;

    constructor(data: ApiEventData) {
        this.data = data;
    }

    /**
     * Tab deleted
     */
    async deletedTab() {
        if (!this.validateDeletedTabEventData()) {
            Logger.getInstance().logError('Invalid event data');
            return;
        }

        const { tabIdentifier } = this.data.data;
        const prisma = PrismaClientSingleton.prisma;

        const deletedTab = await prisma.userTab.findUnique({
            where: { identifier: tabIdentifier },
        });

        if (!deletedTab) {
            Logger.getInstance().logError('Tab not found');
            return;
        }

        if (!deletedTab.isDeleted) {
            Logger.getInstance().logError('Tab is not deleted');
            return;
        }

        const deletedTabWithCategories = await prisma.userTab.update({
            where: { identifier: tabIdentifier },
            data: {
                isDeleted: true,
                categories: {
                    updateMany: {
                        where: {
                            isDeleted: false,
                        },
                        data: {
                            isDeleted: true,
                        },
                    },
                },
            },
            select: {
                categories: true,
            },
        });

        // Del all links
        await prisma.$transaction([
            prisma.link.updateMany({
                where: {
                    categoryIdentifier: {
                        in: deletedTabWithCategories.categories.map((category) => category.identifier),
                    },
                },
                data: {
                    isDeleted: true,
                },
            }),
        ]);

        return;
    }

    /**
     *
     * Validate data for deletedTab
     */
    private validateDeletedTabEventData() {
        // We need tabIdentifier
        const { data } = this.data;

        if (data === undefined) {
            Logger.getInstance().logError('Invalid event body. data is required');
            return false;
        }

        const { tabIdentifier } = data;

        if (tabIdentifier === undefined) {
            Logger.getInstance().logError('Invalid event body. tabIdentifier is required');
            return false;
        }
    }
}
