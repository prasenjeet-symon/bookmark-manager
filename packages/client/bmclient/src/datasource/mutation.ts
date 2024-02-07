import { Subject } from "rxjs";
import { ApplicationToken } from "./http/http.manager";
import { UserToTabMapping } from "./mapping";
import { ApplicationMutationData, ApplicationMutationIdentifier, UserTab } from "./schema";
import { Logger } from "./utils";

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
