import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, Link } from "@/datasource/schema";

export class LinkItemComponentController {
  constructor() {}

  /**
   *
   * Delete link
   *
   */
  public deleteLink(tabIdentifier: string, link: Link) {
    ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.DELETE_LINK, { link: link, tabIdentifier: tabIdentifier }));
  }
}
