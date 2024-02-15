import { Request, Response } from 'express';
import { Logger, PrismaClientSingleton, isDefined } from '../utils';

export class TaskManagerController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     *
     * Delete task
     */
    public async deleteTask() {
        const validator = new TaskManagerValidator(this.req, this.res);
        if (!validator.validateDeleteTask()) {
            Logger.getInstance().logError('Error validating delete task method');
            return;
        }

        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

         await prisma.user.update({
            where: { email: email },
            data: {
                tasks: {
                    update: {
                        where: { identifier: this.req.body.taskUUID },
                        data: {
                            isDeleted: true,
                        }
                    }
                },
            },
        });

        this.res.status(200).json({ message: 'Task deleted successfully' });
        Logger.getInstance().logSuccess('Delete task successfully');
        return;
    }

    /**
     *
     * Get task status
     */
    public async getTaskStatus() {
        const validator = new TaskManagerValidator(this.req, this.res);
        if (!validator.validateGetTaskStatus()) {
            Logger.getInstance().logError('Error validating get task status method');
            return;
        }

        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        const userTasks = await prisma.user.findUnique({
            where: { email: email },
            include: {
                tasks: {
                    where: { isDeleted: false },
                },
            },
        });

        if (!userTasks) {
            this.res.status(404).json({ error: 'User not found' });
            Logger.getInstance().logError('User not found');
            return;
        }

        const tasks = userTasks.tasks;

        this.res.status(200).json(tasks);
        Logger.getInstance().logSuccess('Get task status successfully');
        return;
    }

    /**
     *
     * Mark task error
     */
    public static async markTaskError(taskUUID: string, message: string) {
        if (!TaskManagerValidator.validateMarkTaskError(taskUUID, message)) {
            Logger.getInstance().logError('Error validating mark task error');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;

        await prisma.taskManager.update({
            where: { identifier: taskUUID },
            data: {
                status: 'error',
                message: message,
            },
        });

        Logger.getInstance().logSuccess('Marked task to error successfully');
        return;
    }

    /**
     *
     * Mark task successful
     */
    public static async markTaskSuccessful(taskUUID: string, message: string) {
        if (!TaskManagerValidator.validateMarkTaskSuccessful(taskUUID, message)) {
            Logger.getInstance().logError('Error validating mark task successful method');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;

        await prisma.taskManager.update({
            where: { identifier: taskUUID },
            data: {
                status: 'success',
                message: message,
            },
        });

        Logger.getInstance().logSuccess('Marked task to successful');
        return;
    }

    /**
     *
     * Mark task processing
     */
    public static async markTaskProcessing(taskUUID: string, progress: number) {
        if (!TaskManagerValidator.validateMarkTaskProcessing(taskUUID, progress)) {
            Logger.getInstance().logError('Error validating mark task processing method');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;

        await prisma.taskManager.update({
            where: { identifier: taskUUID },
            data: {
                status: 'processing',
                progress: progress,
            },
        });

        Logger.getInstance().logSuccess('Marked task to processing successfully');
        return;
    }

    /**
     *
     * Mark task uploading
     */
    public static async markTaskUploading(taskUUID: string, progress: number) {
        if (!TaskManagerValidator.validateMarkTaskUploading(taskUUID, progress)) {
            Logger.getInstance().logError('Error validating mark task uploading method');
            return;
        }

        const prisma = PrismaClientSingleton.prisma;

        await prisma.taskManager.update({
            where: { identifier: taskUUID },
            data: {
                status: 'uploading',
                progress: progress,
            },
        });

        Logger.getInstance().logSuccess('Task status updated successfully');
        return;
    }

    /**
     *
     * Add new task
     */
    public async addNewTask() {
        const validator = new TaskManagerValidator(this.req, this.res);
        if (!validator.validateAddTask()) {
            Logger.getInstance().logError('Error validating add new task method');
            return;
        }

        const email = this.res.locals.email;
        const prisma = PrismaClientSingleton.prisma;

        // Initial status
        await prisma.user.update({
            where: { email: email },
            data: {
                tasks: {
                    upsert: {
                        where: { identifier: this.req.body.taskUUID },
                        create: {
                            error: '',
                            message: '',
                            identifier: this.req.body.taskUUID,
                        },
                        update: {
                            error: '',
                            message: '',
                        },
                    },
                },
            },
        });

        Logger.getInstance().logSuccess('Task added successfully');
        return;
    }
}

/**
 *
 *
 *
 * Task manager validator
 */
class TaskManagerValidator {
    constructor(private req: Request, private res: Response) {}

    /**
     *
     * Validate add task
     */
    public validateAddTask() {
        const { taskUUID } = this.req.body;

        if (taskUUID === undefined) {
            this.res.status(400).json({ error: 'taskUUID is required' });
            Logger.getInstance().logError('taskUUID is required field');
            return false;
        }

        if (!isDefined(taskUUID)) {
            this.res.status(400).json({ error: 'taskUUID is required' });
            Logger.getInstance().logError('taskUUID is required field');
            return false;
        }

        return true;
    }

    /**
     *
     * Validate mark task uploading
     */
    public static validateMarkTaskUploading(taskUUID: string, progress: number) {
        if (taskUUID === undefined || progress === undefined) {
            Logger.getInstance().logError('taskUUID and progress are required field');
            return false;
        }

        if (!isDefined(taskUUID) || !isDefined(progress)) {
            Logger.getInstance().logError('taskUUID and progress are required field');
            return false;
        }

        return true;
    }

    /**
     *
     *
     * Validate mark task processing
     */
    public static validateMarkTaskProcessing(taskUUID: string, progress: number) {
        if (taskUUID === undefined || progress === undefined) {
            Logger.getInstance().logError('taskUUID and progress are required field');
            return false;
        }

        if (!isDefined(taskUUID) || !isDefined(progress)) {
            Logger.getInstance().logError('taskUUID and progress are required field');
            return false;
        }

        return true;
    }

    /**
     *
     * Validate mark task successful
     */
    public static validateMarkTaskSuccessful(taskUUID: string, message: string) {
        if (taskUUID === undefined || message === undefined) {
            Logger.getInstance().logError('taskUUID and message are required parameters');
            return false;
        }

        if (!isDefined(taskUUID) || !isDefined(message)) {
            Logger.getInstance().logError('taskUUID and message are required parameters');
            return false;
        }

        return true;
    }

    /**
     *
     *
     * Validate mark task error
     */
    public static validateMarkTaskError(taskUUID: string, message: string) {
        if (taskUUID === undefined || message === undefined) {
            Logger.getInstance().logError('taskUUID and message are required parameters');
            return false;
        }

        if (!isDefined(taskUUID) || !isDefined(message)) {
            Logger.getInstance().logError('taskUUID and message are required parameters');
            return false;
        }

        return true;
    }

    /**
     *
     * Validate get task status
     */
    public validateGetTaskStatus() {
        return true;
    }

    /**
     *
     * Validate delete task
     */
    public validateDeleteTask() {
        const { taskUUID } = this.req.body;

        if (taskUUID === undefined) {
            this.res.status(400).json({ error: 'taskUUID is required' });
            Logger.getInstance().logError('taskUUID is required field');
            return false;
        }

        if (!isDefined(taskUUID)) {
            this.res.status(400).json({ error: 'taskUUID is required' });
            Logger.getInstance().logError('taskUUID is required field');
            return false;
        }

        return true;
    }
}
