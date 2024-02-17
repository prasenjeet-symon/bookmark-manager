import express from 'express';
import path from 'path';
import router from './api';
import routerAdmin from './api-admin';
import routerAuth from './api-auth';
import routerMedia from './api-media';
import routerPublic from './api-public';
import { authenticateUser } from './utils';

export function createServer() {
    const cors = require('cors');
    const app = express();

    app.use(cors());

    app.use(
        express.json({
            limit: '50mb',
        })
    );
    
    app.use(express.urlencoded({ extended: true }));
    app.use('/server/media', express.static(path.join(process.cwd(), 'public')));
    app.use('/server/auth', routerAuth);
    app.use('/server/api-public', routerPublic);
    app.use('/server/api', authenticateUser, router);
    app.use('/server/api/media', authenticateUser, routerMedia);
    app.use('/server/api-admin', routerAdmin);

    app.get('/server/', (req, res) => {
        res.send({ message: 'Hello World' });
    });

    return app;
}
