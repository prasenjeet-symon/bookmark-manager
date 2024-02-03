import express from 'express';
import { CategoryController } from './category.controller';
import { LinkController } from './link.controller';
import { TabController } from './tab.controller';
import { TagController } from './tag.cotroller';
import { UserSetting } from './user-setting.controller';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send({ message: 'Hello World' });
});
/**
 * 
 * Get user
 */
router.get('/user', (req, res) => new UserController(req, res).getUser());
/**
 * 
 * Update user
 */
router.put('/user', (req, res) => new UserController(req, res).updateUser());
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
router.post('/tabs-incrementally', (req, res) => new TabController(req, res).getTabsIncrementally());
/**
 *
 * Get all categories of given tab
 */
router.post('/categories', (req, res) => new CategoryController(req, res).getAllCategoriesOfTab());
/**
 *
 * Add category in given tab
 */
router.post('/categories/new', (req, res) => new CategoryController(req, res).addCategory());
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
 * Get categories incrementally
 */
router.post('/categories-incrementally', (req, res) => new CategoryController(req, res).getAllCategoriesIncrementally());
/**
 *
 * Add new link
 */
router.post('/links/new', (req, res) => new LinkController(req, res).addLink());
/**
 * Update link
 */
router.put('/links', (req, res) => new LinkController(req, res).updateLink());
/**
 * Delete link
 *
 */
router.delete('/links', (req, res) => new LinkController(req, res).deleteLink());
/**
 * Move a link to another category
 */
router.put('/links/move', (req, res) => new LinkController(req, res).moveLink());
/**
 * Get all links
 */
router.post('/links', (req, res) => new LinkController(req, res).getAllLinks());
/**
 *
 * Get links incrementally
 */
router.post('/links-incrementally', (req, res) => new LinkController(req, res).getLinksIncrementally());
/**
 *
 * Add link to catalog
 */
router.post('/catalog', (req, res) => new LinkController(req, res).addLinkToCatalog());
/**
 *
 * Move link from catalog to given tab and category
 *
 */
router.put('/catalog/move', (req, res) => new LinkController(req, res).moveCatalogLink());
/**
 * Get all catalog link
 */
router.get('/catalog', (req, res) => new LinkController(req, res).getAllCatalogLinks());
/**
 *
 * Get all tags of application
 */
router.get('/tags', (req, res) => new TagController(req, res).getAllTags());
/**
 *
 *
 *
 */
export default router;
