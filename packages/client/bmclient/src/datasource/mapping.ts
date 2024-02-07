import { UserTabModel } from "./models/user-tab.model";

export class UserToTabMapping {
  private static instance: UserToTabMapping;
  private userToTabMap: Map<string, UserTabModel> = new Map();

  private constructor() {}

  public static getInstance(): UserToTabMapping {
    if (!UserToTabMapping.instance) {
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
