import { Request, Response } from 'express';
import { Logger, PrismaClientSingleton } from '../utils';

export class UserSetting {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Get user setting
     */
    async getUserSetting() {
        const email = this.res.locals.email; // Target user

        // Check if the setting exit or not
        const prisma = PrismaClientSingleton.prisma;

        const userWithSetting = await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                userSetting: true,
            },
        });

        if (!userWithSetting) {
            this.res.status(400).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        this.res.status(200).json({
            userSetting: userWithSetting.userSetting,
        });

        return;
    }

    /**
     *
     * Update user setting
     */
    async updateUserSetting() {
        const email = this.res.locals.email; // Target user

        // Validate body for the required data
        if (!this.validReqBody()) {
            Logger.getInstance().logError('Invalid request body');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;

        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                userSetting: {
                    update: {
                        allowDragDropToMoveLink: this.req.body.allowDragDropToMoveLink,
                        isDarkMode: this.req.body.isDarkMode,
                        numberOfColumns: this.req.body.numberOfColumns,
                        showNoteInTooltip: this.req.body.showNoteInTooltip,
                        showNumberOfBookmarkInCategory: this.req.body.showNumberOfBookmarkInCategory,
                        showNumberOfBookmarkInTab: this.req.body.showNumberOfBookmarkInTab,
                        showTagsInTooltip: this.req.body.showTagsInTooltip,
                    },
                },
            },
        });
    }
    /**
     *
     *  Validate updateUserSetting request body
     */
    validReqBody(): boolean {
        const {
            allowDragDropToMoveLink,
            isDarkMode,
            numberOfColumns,
            showNoteInTooltip,
            showNumberOfBookmarkInCategory,
            showNumberOfBookmarkInTab,
            showTagsInTooltip,
        } = this.req.body;

        if (
            allowDragDropToMoveLink === undefined ||
            isDarkMode === undefined ||
            numberOfColumns === undefined ||
            showNoteInTooltip === undefined ||
            showNumberOfBookmarkInCategory === undefined ||
            showNumberOfBookmarkInTab === undefined ||
            showTagsInTooltip === undefined
        ) {
            this.res.status(400).json({ error: 'Required fields are missing' });
            Logger.getInstance().logError('Required fields are missing');
            return false;
        }

        return true;
    }
}
