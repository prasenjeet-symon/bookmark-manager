import { createServer } from './server';
import { Logger, signUpAdmin } from './utils';

require('dotenv').config();
const PORT = process.env.PORT ? +process.env.PORT : 8081;
const app = createServer();

signUpAdmin()
    .then(() => {
        Logger.getInstance().logSuccess('Admin user created');
    })
    .catch((error) => {
        Logger.getInstance().logError(error);
    })
    .finally(() => {
        app.listen(PORT, () => {
            Logger.getInstance().logSuccess(`Server running on port ${PORT}`);
        });
    });
