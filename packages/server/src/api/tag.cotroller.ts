import { Request, Response } from 'express';
import { PrismaClientSingleton } from '../utils';

export class TagController {
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
    }

    /**
     * Get all tags of application
     */
    async getAllTags() {
        const prisma = PrismaClientSingleton.prisma;
        const email = this.res.locals.email;
        const allTags = await prisma.tag.findMany({
            where: {
                isDeleted: false,
            },
        });

        this.res.status(200).json(allTags);
        return;
    }
}
