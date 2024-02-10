import { CategoryToLinkMapping } from "@/datasource/mapping";
import { ApplicationMutation } from "@/datasource/mutation";
import { ApplicationMutationData, ApplicationMutationIdentifier, TabCategory } from "@/datasource/schema";

export class CategoryItemComponentController {
  constructor() {}

  /**
   * 
   * Get all links of category
   */
  public getLinks(category: TabCategory) {
     const categoryToLinkMapping = CategoryToLinkMapping.getInstance();
     const linkModel = categoryToLinkMapping.get(category.identifier, category.tabIdentifier);
     return linkModel.getCategoryLink();
  }


  /**
   *
   * Delete category
   */
  public deleteCategory(category: TabCategory) {
    ApplicationMutation.getInstance().dispatch(new ApplicationMutationData(ApplicationMutationIdentifier.DELETE_CATEGORY, category));
  }
}
