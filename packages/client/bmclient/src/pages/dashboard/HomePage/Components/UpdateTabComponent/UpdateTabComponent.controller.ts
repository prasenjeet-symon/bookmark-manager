import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, UserTab } from "@/datasource/schema";

export class UpdateTabComponentController {
  constructor() {}

  /**
   * Update tab
   */
  public updateTab (tab: UserTab) {
     ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.UPDATE_TAB, tab));
  }
}
