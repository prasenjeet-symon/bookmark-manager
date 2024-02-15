import { Request, Response } from 'express';
import fs from 'fs';
import { v4 } from 'uuid';
import { Bookmark } from '../schema';
import { Logger, PrismaClientSingleton, dateToTimestampInSeconds, generateChecksum } from '../utils';
import { TaskManagerController } from './task-manager.controller';

export class ExportBookmarkController {
    private req: Request;
    private res: Response;
    private rootFolder = 'public';
    private exportedBookmarkFolder = `${this.rootFolder}/exported-bookmarks`;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Export bookmark as HTML file
     */
    public async exportBookmarkHTML() {
        try {
            const validator = new ExportBookmarkValidator(this.req, this.res);
            if (!validator.validateExportBookmarkHTML()) {
                Logger.getInstance().logError('validation error in export bookmark HTML');
                return;
            }

            const email = this.res.locals.email;
            const prisma = PrismaClientSingleton.prisma;
            await new TaskManagerController(this.req, this.res).addNewTask();
            await TaskManagerController.markTaskUploading(this.req.body.taskUUID, 0);
            await TaskManagerController.markTaskUploading(this.req.body.taskUUID, 100);

            const process = async () => {
                await TaskManagerController.markTaskProcessing(this.req.body.taskUUID, 50);
                // Extract all links of this user
                const userWithLinks = await prisma.user.findUnique({
                    where: { email: email },
                    include: {
                        links: true,
                    },
                });

                if (!userWithLinks) {
                    this.res.status(404).json({ error: 'User not found' });
                    Logger.getInstance().logError('User not found');
                    return;
                }

                const links = userWithLinks.links;
                const bookmark: Bookmark[] = links.map((link) => {
                    return {
                        checksum: generateChecksum(link.url),
                        datetime: link.createdAt,
                        icon: link.icon,
                        title: link.title,
                        url: link.url,
                    } as Bookmark;
                });

                // Prepare the HTML
                const HTMLString = this.prepareHTMLBookmark(bookmark);
                const filePath = this.saveToPublicFolder(HTMLString);

                await TaskManagerController.markTaskProcessing(this.req.body.taskUUID, 100);
                await TaskManagerController.markTaskSuccessful(this.req.body.taskUUID, filePath);
                Logger.getInstance().logSuccess('Export bookmark task completed successfully');
                return filePath;
            };

            process()
                .catch(() => {
                    return TaskManagerController.markTaskError(this.req.body.taskUUID, 'Error in export bookmark');
                });

            this.res.status(200).json({ message: 'Export bookmark task started' });
            Logger.getInstance().logSuccess('Export bookmark task started');
            return;
        } catch (error) {
            await TaskManagerController.markTaskError(this.req.body.taskUUID, 'Error in export bookmark');
            Logger.getInstance().logError('Error in export bookmark');
            this.res.status(500).json({ error: 'Error in export bookmark' });
            return;
        }
    }

    /**
     *
     *
     * Prepare HTML Bookmark
     */
    private prepareHTMLBookmark(bookmarks: Bookmark[]) {
        return `
        <!DOCTYPE NETSCAPE-Bookmark-file-1>
        <!-- This is an automatically generated file.
             It will be read and overwritten.
             DO NOT EDIT! -->
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><H3 ADD_DATE="1659728032" LAST_MODIFIED="1619637219" PERSONAL_TOOLBAR_FOLDER="true"> Linkify</H3>
                <DL><p>
                    ${bookmarks
                        .map(
                            (p) =>
                                `<DT><A HREF="${p.url}" ADD_DATE="${dateToTimestampInSeconds(p.datetime)}">${
                                    p.title
                                }</A>`
                        )
                        .join('')}
        `;
    }

    /**
     *
     * Save to public folder to user to download
     */
    private saveToPublicFolder(bookmarkHTML: string) {
        if (!fs.existsSync(this.rootFolder)) {
            fs.mkdirSync(this.rootFolder);
        }

        if (!fs.existsSync(this.exportedBookmarkFolder)) {
            fs.mkdirSync(this.exportedBookmarkFolder);
        }

        // Save our HTML File
        const filePath = `${this.exportedBookmarkFolder}/bookmark_${v4()}.html`;
        fs.writeFileSync(filePath, bookmarkHTML);

        return filePath.replace(this.rootFolder, '');
    }
}

class ExportBookmarkValidator {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Validate export bookmark HTML
     */
    public validateExportBookmarkHTML() {
        return true;
    }
}
