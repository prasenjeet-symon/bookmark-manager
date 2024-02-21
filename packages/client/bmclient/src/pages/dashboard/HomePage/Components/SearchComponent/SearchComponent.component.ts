import { ApplicationToken } from "@/datasource/http/http.manager";
import { UserToTabMapping } from "@/datasource/mapping";
import { of } from "rxjs";

export class SearchComponentController {
  constructor() {}

  /**
   * Search all links
   */
  public search(queryString: string) {
    const userId = ApplicationToken.getInstance().getUserId;
    if (!userId) {
      return;
    }

    const userToTabMapping = UserToTabMapping.getInstance();
    const tabModel = userToTabMapping.get(userId);
    tabModel.search(queryString);
  }

  /**
   *
   * Get searched links
   */
  public getSearchedLinks() {
    const userId = ApplicationToken.getInstance().getUserId;
    if (!userId) {
      return of([]);
    }

    const userToTabMapping = UserToTabMapping.getInstance();
    const tabModel = userToTabMapping.get(userId);
    return tabModel.linkWithSearch();
  }
}
