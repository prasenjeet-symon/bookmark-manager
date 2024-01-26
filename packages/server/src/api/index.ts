import express from 'express';
import { TabController } from './tab.controller';
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
/**
 *
 * Update user settings
 */
router.put('/user-setting', (req, res) => new UserSetting(req, res).updateUserSetting());
/**
 *
 * Get user's tabs
 *
 */
router.get('/tabs', (req, res) => new TabController(req, res).getTabs());
/**
 *
 *
 */
export default router;
