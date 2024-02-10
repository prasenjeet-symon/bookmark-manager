import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, Link } from "@/datasource/schema";

export class UpdateLinkComponentController {
    constructor() {}

    /**
     * 
     * Update link
     */
    public updateLink(link: Link, tabIdentifier: string) {
        ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.UPDATE_LINK, { link: link, tabIdentifier: tabIdentifier }));
    }
}