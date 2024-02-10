import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, TabCategory } from "@/datasource/schema";

export class AddCategoryComponentController {
  constructor() {}

  /**
   *
   * Add new category
   */
  public addCategory(category: TabCategory) {
    ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.ADD_CATEGORY, category));
  }
}
