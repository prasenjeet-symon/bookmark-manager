import { Request, Response } from 'express';
import fs from 'fs';
import { JSDOM } from 'jsdom';
import multer, { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { Bookmark } from '../schema';
import {
    Logger,
    PrismaClientSingleton,
    generateChecksum,
    getCurrentTimestampInSecondsUTC,
    isDefined,
    timestampToDate,
} from '../utils';
import { TaskManagerController } from './task-manager.controller';

export class ImportBookmarkController {
    private req: Request;
    private res: Response;
    private static rootFir = 'temporary';
    private static tempDirPath = 'temporary/bookmark';

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Upload import bookmark file
     */
    public async uploadBookmark() {
        const validator = new ImportBookmarkValidator(this.req, this.res);

        if (!validator.validateUploadBookmark()) {
            Logger.getInstance().logError('Invalid request body of upload bookmark');
            return;
        }

        const filePath = this.req.file?.destination + '/' + this.req.file?.filename;

        try {
            // Read all the links from the bookmark file and store it in the database
            const htmlData = fs.readFileSync(filePath, 'utf-8');

            const bookmarks: Bookmark[] = [];
            const dom = new JSDOM(htmlData);
            const document = dom.window.document;
            const linkElements = document.querySelectorAll('a');
            linkElements.forEach((link) => {
                const url = link.getAttribute('href');
                const icon = link.getAttribute('icon');
                const timestampSec = link.getAttribute('add_date');
                const datetime = timestampToDate(+(timestampSec || +new Date()));
                const title = link.textContent || '';

                if (url) {
                    bookmarks.push({ url, icon, checksum: generateChecksum(url), datetime: datetime, title: title });
                }
            });

            // Add all this link to user catalog in transactions
            const email = this.res.locals.email;
            const prisma = PrismaClientSingleton.prisma;
            await new TaskManagerController(this.req, this.res).addNewTask();
            await TaskManagerController.markTaskUploading(this.req.body.taskUUID, 100);

            const hiddenTags = [
                'uncategorized',
                'catalog',
                'other',
                `catalog__${getCurrentTimestampInSecondsUTC()}__${v4()}`,
            ];

            await TaskManagerController.markTaskProcessing(this.req.body.taskUUID, 50);

            await prisma.$transaction(
                bookmarks.map((bookmark) => {
                    return prisma.user.update({
                        where: { email: email },
                        data: {
                            links: {
                                upsert: {
                                    where: { identifier: bookmark.checksum },
                                    create: {
                                        identifier: bookmark.checksum,
                                        order: 1,
                                        title: bookmark.title,
                                        url: bookmark.url,
                                        icon: bookmark.icon,
                                        createdAt: bookmark.datetime,
                                        linkTags: {
                                            create: [
                                                ...(JSON.parse(this.req.body.tags) as string[]).map((tag) => ({
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
                                        order: 1,
                                        title: bookmark.title,
                                        url: bookmark.url,
                                        icon: bookmark.icon,
                                        createdAt: bookmark.datetime,
                                    },
                                },
                            },
                        },
                    });
                })
            );

            await TaskManagerController.markTaskProcessing(this.req.body.taskUUID, 100);
            await TaskManagerController.markTaskSuccessful(this.req.body.taskUUID, 'Bookmark imported successfully');

            this.res.status(200).json({ message: 'Bookmark imported successfully' });
            Logger.getInstance().logSuccess('Bookmark imported successfully');
            return;
        } catch (error: any) {
            Logger.getInstance().logError(error);
            await TaskManagerController.markTaskError(this.req.body.taskUUID, 'Error importing bookmark');
            this.res.status(500).json({ error: 'Error importing bookmark' });
            return;
        }
    }

    /**
     *
     * Bookmark storage
     */
    public static bookmarkStorage() {
        const importBookmarkStorage = diskStorage({
            destination: (req, file, cb) => {
                if (!fs.existsSync(ImportBookmarkController.rootFir)) {
                    fs.mkdirSync(ImportBookmarkController.rootFir);
                }

                if (!fs.existsSync(ImportBookmarkController.tempDirPath)) {
                    fs.mkdirSync(ImportBookmarkController.tempDirPath);
                }

                cb(null, ImportBookmarkController.tempDirPath);
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            },
        });

        const importBookmarkUpload = multer({
            storage: importBookmarkStorage,
            limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
            fileFilter: (req, file, cb) => {
                if (
                    file.mimetype === 'text/csv' ||
                    file.mimetype === 'text/plain' ||
                    file.mimetype === 'text/tab-separated-values' ||
                    file.mimetype === 'text/html'
                ) {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            },
        });

        return importBookmarkUpload.single('bookmarkFile');
    }
}

class ImportBookmarkValidator {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Validator for import bookmark upload
     */
    public validateUploadBookmark() {
        const { file } = this.req;

        if (file === undefined) {
            this.res.status(400).json({ error: 'file is required' });
            Logger.getInstance().logError('file is required');
            return false;
        }

        if (!isDefined(file)) {
            this.res.status(400).json({ error: 'file is required' });
            Logger.getInstance().logError('file is required');
            return false;
        }

        const { tags } = this.req.body;

        if (tags === undefined) {
            this.res.status(400).json({ error: 'tags is required' });
            Logger.getInstance().logError('tags is required');
            return false;
        }

        if (!isDefined(tags)) {
            this.res.status(400).json({ error: 'tags is required' });
            Logger.getInstance().logError('tags is required');
            return false;
        }

        const { taskUUID } = this.req.body;

        if (taskUUID === undefined) {
            this.res.status(400).json({ error: 'taskUUID is required field' });
            Logger.getInstance().logError('taskUUID is required field');
            return false;
        }

        if (!isDefined(taskUUID)) {
            this.res.status(400).json({ error: 'taskUUID is required field' });
            Logger.getInstance().logError('taskUUID is required field');
            return;
        }

        return true;
    }
}
