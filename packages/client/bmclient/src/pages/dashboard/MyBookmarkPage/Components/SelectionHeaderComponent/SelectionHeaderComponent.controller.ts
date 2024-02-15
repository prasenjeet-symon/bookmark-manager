import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, Link, TabCategory } from "@/datasource/schema";

export class SelectionHeaderComponentController {
  constructor() {}

  /**
   *
   * Delete links
   */
  public deleteLinks(links: Link[]) {
    links.forEach((link) => {
      ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.DELETE_CATALOG_LINK, link));
    });
  }

  /**
   *
   * Move multiple links
   */
  public moveLinksToCategory(links: Link[], category: TabCategory) {
    links.forEach((link) => {
      ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.MOVE_CATALOG_LINK, { link: link, category: category }));
    });
  }
}
