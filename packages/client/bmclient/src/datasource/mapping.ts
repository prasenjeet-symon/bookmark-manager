import { CategoryLinkModel } from "./models/category-link.model";
import { TabCategoryModel } from "./models/tab-category.model";
import { UserCatalogModel } from "./models/user-catalog.model";
import { UserDetailModel } from "./models/user-detail.model";
import { UserSettingModel } from "./models/user-setting.model";
import { UserTabModel } from "./models/user-tab.model";
import { Logger } from "./utils";

/**
 *
 *
 * User to setting mapping
 */
export class UserToSettingMapping {
  private static instance: UserToSettingMapping;
  private userToSettingMap: Map<string, UserSettingModel> = new Map();

  private constructor() {}

  public static getInstance(): UserToSettingMapping {
    if (!UserToSettingMapping.instance) {
      Logger.getInstance().logSuccess("UserToSettingMapping instance created");
      UserToSettingMapping.instance = new UserToSettingMapping();
    }
    return UserToSettingMapping.instance;
  }

  // Get setting model
  get(key: string): UserSettingModel {
    if (this.userToSettingMap.has(key)) {
      return this.userToSettingMap.get(key)!;
    }

    const setting = new UserSettingModel(key);

    this.userToSettingMap.set(key, setting);
    return setting;
  }
}

export class UserToTabMapping {
  private static instance: UserToTabMapping;
  private userToTabMap: Map<string, UserTabModel> = new Map();

  private constructor() {}

  public static getInstance(): UserToTabMapping {
    if (!UserToTabMapping.instance) {
      Logger.getInstance().logSuccess("UserToTabMapping instance created");
      UserToTabMapping.instance = new UserToTabMapping();
    }
    return UserToTabMapping.instance;
  }

  // Get tab model
  get(key: string): UserTabModel {
    if (this.userToTabMap.has(key)) {
      return this.userToTabMap.get(key)!;
    }

    const tab = new UserTabModel(key);
    this.userToTabMap.set(key, tab);
    return tab;
  }
}

/**
 *
 *
 * Tab to category mapping
 */
export class TabToCategoryMapping {
  private static instance: TabToCategoryMapping;
  private tabToCategoryMap: Map<string, TabCategoryModel> = new Map();

  private constructor() {}

  public static getInstance(): TabToCategoryMapping {
    if (!TabToCategoryMapping.instance) {
      Logger.getInstance().logSuccess("TabToCategoryMapping instance created");
      TabToCategoryMapping.instance = new TabToCategoryMapping();
    }
    return TabToCategoryMapping.instance;
  }

  // Get category model
  get(key: string): TabCategoryModel {
    if (this.tabToCategoryMap.has(key)) {
      return this.tabToCategoryMap.get(key)!;
    }

    const category = new TabCategoryModel(key);
    this.tabToCategoryMap.set(key, category);
    return category;
  }
}

/**
 *
 * Category to link mapping
 */
export class CategoryToLinkMapping {
  private static instance: CategoryToLinkMapping;
  private categoryToLinkMap: Map<string, CategoryLinkModel> = new Map();

  private constructor() {}

  public static getInstance(): CategoryToLinkMapping {
    if (!CategoryToLinkMapping.instance) {
      Logger.getInstance().logSuccess("CategoryToLinkMapping instance created");
      CategoryToLinkMapping.instance = new CategoryToLinkMapping();
    }
    return CategoryToLinkMapping.instance;
  }

  // Get link model
  get(key: string, tabIdentifier: string): CategoryLinkModel {
    if (this.categoryToLinkMap.has(key)) {
      return this.categoryToLinkMap.get(key)!;
    }

    const link = new CategoryLinkModel(key, tabIdentifier);
    this.categoryToLinkMap.set(key, link);
    return link;
  }
}
/**
 *
 * User to catalog mapping
 */
export class UserToCatalogMapping {
  private static instance: UserToCatalogMapping;
  private userToCatalogMap: Map<string, UserCatalogModel> = new Map();

  private constructor() {}

  public static getInstance(): UserToCatalogMapping {
    if (!UserToCatalogMapping.instance) {
      Logger.getInstance().logSuccess("UserToCatalogMapping instance created");
      UserToCatalogMapping.instance = new UserToCatalogMapping();
    }
    return UserToCatalogMapping.instance;
  }

  // Get catalog model
  get(key: string): UserCatalogModel {
    if (this.userToCatalogMap.has(key)) {
      return this.userToCatalogMap.get(key)!;
    }

    const catalog = new UserCatalogModel(key);
    this.userToCatalogMap.set(key, catalog);

    return catalog;
  }
}

/**
 *
 *
 * Root to user detail model mapping
 */
export class UserToUserDetailMapping {
  private static instance: UserToUserDetailMapping;
  private userToUserDetailMap: Map<string, UserDetailModel> = new Map();

  private constructor() {}

  public static getInstance(): UserToUserDetailMapping {
    if (!UserToUserDetailMapping.instance) {
      Logger.getInstance().logSuccess("UserToUserDetailMapping instance created");
      UserToUserDetailMapping.instance = new UserToUserDetailMapping();
    }
    return UserToUserDetailMapping.instance;
  }

  // Get user detail model
  get(key: string): UserDetailModel {
    if (this.userToUserDetailMap.has(key)) {
      return this.userToUserDetailMap.get(key)!;
    }

    const userDetail = new UserDetailModel(key);
    this.userToUserDetailMap.set(key, userDetail);

    return userDetail;
  }
}
