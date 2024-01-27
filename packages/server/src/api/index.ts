import express from 'express';
import { CategoryController } from './category.controller';
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
 * Add new tab
 */
router.post('/tabs', (req, res) => new TabController(req, res).addTab());
/**
 *
 * Update tab
 */
router.put('/tabs', (req, res) => new TabController(req, res).updateTab());
/**
 *
 * Delete tab
 */
router.delete('/tabs', (req, res) => new TabController(req, res).deleteTab());
/**
 *
 * Get tabs incrementally
 */
router.get('/tabs-incrementally', (req, res) => new TabController(req, res).getTabsIncrementally());
/**
 *
 * Get all categories of given tab
 */
router.get('/categories', (req, res) => new CategoryController(req, res).getAllCategoriesOfTab());
/**
 *
 * Add category in given tab
 */
router.post('/categories', (req, res) => new CategoryController(req, res).addCategory());
/**
 *
 * Update category in given tab
 */
router.put('/categories', (req, res) => new CategoryController(req, res).updateCategory());
/**
 *
 * Delete category from given tab
 */
router.delete('/categories', (req, res) => new CategoryController(req, res).deleteCategory());
/**
 *
 *
 *
 */
export default router;
