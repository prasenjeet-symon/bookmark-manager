import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, TabCategory } from "@/datasource/schema";

export class UpdateCategoryComponentController {
  constructor() {}

  /**
   *
   * Update category
   */
  public updateCategory(category: TabCategory) {
    ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.UPDATE_CATEGORY, category));
  }
}
