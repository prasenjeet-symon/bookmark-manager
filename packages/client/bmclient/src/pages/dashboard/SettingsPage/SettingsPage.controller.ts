import { ApplicationToken, Subscription } from "@/datasource/http/http.manager";
import { UserToSettingMapping, UserToUserDetailMapping } from "@/datasource/mapping";
import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, UserSetting } from "@/datasource/schema";

export class SettingPageController {
  constructor() {}

  /**
   *
   * Get user setting
   */
  public getUserSetting() {
    const userToSettingMapping = UserToSettingMapping.getInstance();
    const settingModel = userToSettingMapping.get(ApplicationToken.getInstance().getUserId || "");
    return settingModel.userSetting;
  }

  /**
   *
   * Update setting
   */
  public updateUserSetting(userSetting: UserSetting) {
    ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.USER_SETTING, userSetting));
  }

  /**
   *
   * Get subscription status
   */
  public getSubscriptionStatus() {
    return Subscription.getInstance().status$;
  }

  /**
   *
   *
   * Listen for subscription status
   */
  public listenForSubscriptionStatus() {
    Subscription.getInstance().listen();
  }

  /**
   *
   * Get user
   */
  public getUser() {
    const mapping = UserToUserDetailMapping.getInstance();
    const model = mapping.get("");
    return model.getUserDetails();
  }
}
