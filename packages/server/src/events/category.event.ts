import { ApiEventData } from '.';
import { Logger, PrismaClientSingleton } from '../utils';

export class CategoryEvent {
    private data: ApiEventData;

    constructor(data: ApiEventData) {
        this.data = data;
    }

    /**
     * Category deleted
     */
    async deletedCategory() {
        if (!this.validateDeletedCategoryEventData()) {
            Logger.getInstance().logError('Invalid event data');
            return;
        }

        const { categoryIdentifier } = this.data.data;
        const prisma = PrismaClientSingleton.prisma;

        // Is category really deleted?
        const deletedCategory = await prisma.category.findUnique({
            where: { identifier: categoryIdentifier },
        });

        if (!deletedCategory) {
            Logger.getInstance().logError('Category not found');
            return;
        }

        if (!deletedCategory.isDeleted) {
            Logger.getInstance().logError('Category is not deleted');
            return;
        }

        await prisma.category.update({
            where: { identifier: categoryIdentifier },
            data: {
                isDeleted: true,
                links: {
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
                links: true,
            },
        });

        return;
    }

    /**
     *
     * Validate data for deletedCategory
     */
    validateDeletedCategoryEventData() {
        const { data } = this.data;

        if (data === undefined) {
            Logger.getInstance().logError('Invalid event data');
            return false;
        }

        const { categoryIdentifier } = data;

        if (categoryIdentifier === undefined) {
            Logger.getInstance().logError('Invalid event data');
            return false;
        }

        return true;
    }
}
