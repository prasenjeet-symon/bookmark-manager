import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, Link } from "@/datasource/schema";

export class AddBookmarkPageController {
  constructor() {}

  /**
   *
   * Add new link
   */
  public addLink(link: Link, tabIdentifier: string) {
    ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.ADD_LINK, { link: link, tabIdentifier: tabIdentifier }));
  }
}
