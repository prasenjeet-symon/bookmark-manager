import { TabToCategoryMapping } from "@/datasource/mapping";

export class DropdownCategoryComponentController {
  constructor() {}

  /**
   *
   * Get all category of given tab
   */
  public getCategories(tabIdentifier: string) {
    const tabToCategoryMapping = TabToCategoryMapping.getInstance();
    const categoryModel = tabToCategoryMapping.get(tabIdentifier);
    return categoryModel.getCategories();
  }
}
