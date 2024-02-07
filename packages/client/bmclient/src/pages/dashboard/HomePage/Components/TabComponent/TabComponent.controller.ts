import { ApplicationToken } from "@/datasource/http/http.manager";
import { UserToTabMapping } from "@/datasource/mapping";
import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, ModelStore, UserTab } from "@/datasource/schema";
import { Observable } from "rxjs";

export class TabComponentController {
  constructor() {}

  /**
   * Get all tabs
   */
  public getTabs(): Observable<ModelStore<UserTab[]>> | undefined {
    const userId = ApplicationToken.getInstance().getUserId;
    if (!userId) {
      return;
    }

    const userToTabMapping = UserToTabMapping.getInstance();
    const tabModel = userToTabMapping.get(userId);
    return tabModel.getTabs();
  }

  /**
   * 
   * Delete tab
   */
  public deleteTab (tab: UserTab) {
    ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.DELETE_TAB, tab));
  }
}
