import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, TabCategory } from "@/datasource/schema";

export class ChooseCategoryColorComponentController {
  constructor() {}

  /**
   *
   * Update category
   */
  public updateCategoryColor(category: TabCategory) {
    ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.UPDATE_CATEGORY, category));
  }
}
