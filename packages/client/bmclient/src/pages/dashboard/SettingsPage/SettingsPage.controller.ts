import { ApplicationToken } from "@/datasource/http/http.manager";
import { UserToSettingMapping } from "@/datasource/mapping";
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
}
