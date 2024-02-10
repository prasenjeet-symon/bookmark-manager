import { ApplicationToken } from "@/datasource/http/http.manager";
import { UserToTabMapping } from "@/datasource/mapping";

export class DropdownTabComponentController {
  constructor() {}

  /**
   * Get all tabs of user
   */
  public getTabs() {
    const userId = ApplicationToken.getInstance().getUserId;
    if (!userId) {
      return;
    }

    const userToTabMapping = UserToTabMapping.getInstance();
    const tabModel = userToTabMapping.get(userId);
    return tabModel.getTabs();
  }
}
