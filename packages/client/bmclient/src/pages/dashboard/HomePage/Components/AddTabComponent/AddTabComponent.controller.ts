import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, UserTab } from "@/datasource/schema";

export class AddTabComponentController {
  constructor() {}

  /**
   * Add new tab
   */
  public addTab(tab: UserTab) {
    ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.ADD_TAB, tab));
  }
}
