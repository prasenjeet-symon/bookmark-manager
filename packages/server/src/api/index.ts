import express from 'express';
import { UserSetting } from './user-setting.controller';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send({ message: 'Hello World' });
});
/**
 *
 * Get user settings
 */
router.get('/user-setting', (req, res) => new UserSetting(req, res).getUserSetting());

export default router;
