import { Subject } from "rxjs";
import { ApplicationToken } from "./http/http.manager";
import { CategoryToLinkMapping, TabToCategoryMapping, UserToSettingMapping, UserToTabMapping } from "./mapping";
import { ApplicationMutationData, ApplicationMutationIdentifier, Link, TabCategory, UserSetting, UserTab } from "./schema";
import { Logger, getIcoIcon } from "./utils";

export class ApplicationMutation {
  private static instance: ApplicationMutation;
  private mutation: Subject<ApplicationMutationData> = new Subject<ApplicationMutationData>();

  private constructor() {
    this.mutation.subscribe((data) => {
      const identifier = data.identifier;

      switch (identifier) {
        case ApplicationMutationIdentifier.ADD_TAB:
          MutationQueue.getInstance().add(ApplicationMutation._addTab(data.data as UserTab));
          break;

        case ApplicationMutationIdentifier.DELETE_TAB:
          MutationQueue.getInstance().add(ApplicationMutation._deleteTab(data.data as UserTab));
          break;

        case ApplicationMutationIdentifier.UPDATE_TAB:
          MutationQueue.getInstance().add(ApplicationMutation._updateTab(data.data as UserTab));
          break;

        case ApplicationMutationIdentifier.ADD_CATEGORY:
          MutationQueue.getInstance().add(ApplicationMutation._addCategory(data.data as TabCategory));
          break;

        case ApplicationMutationIdentifier.UPDATE_CATEGORY:
          MutationQueue.getInstance().add(ApplicationMutation._updateCategory(data.data as TabCategory));
          break;

        case ApplicationMutationIdentifier.DELETE_CATEGORY:
          MutationQueue.getInstance().add(ApplicationMutation._deleteCategory(data.data as TabCategory));
          break;

        case ApplicationMutationIdentifier.ADD_LINK:
          MutationQueue.getInstance().add(ApplicationMutation._addLink(data.data.link as Link, data.data.tabIdentifier as string));
          break;

        case ApplicationMutationIdentifier.UPDATE_LINK:
          MutationQueue.getInstance().add(ApplicationMutation._updateLink(data.data.link as Link, data.data.tabIdentifier as string));
          break;

        case ApplicationMutationIdentifier.DELETE_LINK:
          MutationQueue.getInstance().add(ApplicationMutation._deleteLink(data.data.link as Link, data.data.tabIdentifier as string));
          break;

        case ApplicationMutationIdentifier.USER_SETTING:
          MutationQueue.getInstance().add(ApplicationMutation._updateUserSetting(data.data as UserSetting));
          break;
      }
    });
  }
  /**
   *
   *
   * Add new tab
   */
  private static async _addTab(data: UserTab) {
    const userId = ApplicationToken.getInstance().getUserId;
    if (!userId) {
      return;
    }

    const userToTabMapping = UserToTabMapping.getInstance();
    const tabModel = userToTabMapping.get(userId);
    await tabModel.addTab(data);
  }
  /**
   *
   * Delete a tab
   */
  private static async _deleteTab(tab: UserTab) {
    const userId = ApplicationToken.getInstance().getUserId;
    if (!userId) {
      return;
    }

    const userToTabMapping = UserToTabMapping.getInstance();
    const tabModel = userToTabMapping.get(userId);
    await tabModel.deleteTab(tab);
  }

  /**
   *
   *
   * Update tab
   */
  private static async _updateTab(tab: UserTab) {
    const userId = ApplicationToken.getInstance().getUserId;
    if (!userId) {
      return;
    }

    const userToTabMapping = UserToTabMapping.getInstance();
    const tabModel = userToTabMapping.get(userId);
    await tabModel.updateTab(tab);
  }
  /**
   *
   * Add new category
   */
  private static async _addCategory(category: TabCategory) {
    const tabToCategoryMapping = TabToCategoryMapping.getInstance();
    const categoryModel = tabToCategoryMapping.get(category.tabIdentifier);
    await categoryModel.addCategory(category);
  }

  /**
   *
   * Update category
   */
  private static async _updateCategory(category: TabCategory) {
    const tabToCategoryMapping = TabToCategoryMapping.getInstance();
    const categoryModel = tabToCategoryMapping.get(category.tabIdentifier);
    await categoryModel.updateCategory(category);
  }

  /**
   *
   * Delete category
   */
  private static async _deleteCategory(category: TabCategory) {
    const tabToCategoryMapping = TabToCategoryMapping.getInstance();
    const categoryModel = tabToCategoryMapping.get(category.tabIdentifier);
    await categoryModel.deleteCategory(category);
  }

  /**
   *
   * Add new link
   */
  private static async _addLink(link: Link, tabIdentifier: string) {
    const categoryToLinkMapping = CategoryToLinkMapping.getInstance();
    const linkModel = categoryToLinkMapping.get(link.categoryIdentifier, tabIdentifier);
    const iconLink = await getIcoIcon(link.url);
    console.log(iconLink);
    link.icon = iconLink;
    await linkModel.addLink(link);
  }
  /**
   * 
   * Update link
   */
  private static async _updateLink(link: Link, tabIdentifier: string) {
    const categoryToLinkMapping = CategoryToLinkMapping.getInstance();
    const linkModel = categoryToLinkMapping.get(link.categoryIdentifier, tabIdentifier);
    await linkModel.updateLink(link);
  }

  /**
   * 
   * Delete link
   */
  private static async _deleteLink(link: Link, tabIdentifier: string) {
    const categoryToLinkMapping = CategoryToLinkMapping.getInstance();
    const linkModel = categoryToLinkMapping.get(link.categoryIdentifier, tabIdentifier);
    await linkModel.deleteLink(link);
  }

  /**
   * Update user setting
   */
  private static async _updateUserSetting(setting: UserSetting) {
    const userId = ApplicationToken.getInstance().getUserId;
    if (!userId) {
      return;
    }

    const userToSettingMapping = UserToSettingMapping.getInstance();
    const settingModel = userToSettingMapping.get(userId);
    await settingModel.updateUserSetting(setting);
  }

  /**
   *
   *
   *
   *
   *
   */
  public static getInstance(): ApplicationMutation {
    if (!ApplicationMutation.instance) {
      ApplicationMutation.instance = new ApplicationMutation();
    }
    return ApplicationMutation.instance;
  }

  /**
   *
   * Dispatch
   */
  public dispatch(data: ApplicationMutationData) {
    this.mutation.next(data);
  }
}
/**
 *
 *
 * Mutation Queue
 */
export class MutationQueue {
  private static instance: MutationQueue;
  private queue: Subject<Promise<void>> = new Subject<Promise<void>>();

  private constructor() {
    this.queue.subscribe((data) => {
      console.log(data);
      this.mutate(data);
      Logger.getInstance().logSuccess("Mutation completed");
    });
  }

  public static getInstance() {
    if (!MutationQueue.instance) {
      MutationQueue.instance = new MutationQueue();
    }
    return MutationQueue.instance;
  }

  /**
   * Mutate
   */
  private async mutate(func: Promise<void>) {
    try {
      await func;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *
   * Add
   */
  public add(func: Promise<void>) {
    this.queue.next(func);
  }
}
