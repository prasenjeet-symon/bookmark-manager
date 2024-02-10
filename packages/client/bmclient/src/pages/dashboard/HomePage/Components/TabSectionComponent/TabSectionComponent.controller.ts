import { TabToCategoryMapping } from "@/datasource/mapping";

export class TabSectionComponentController {
  constructor() {}

  /**
   *
   * Get all category of the tab
   */
  public getCategory(tabIdentifier: string) {
    const tabToCategoryMapping = TabToCategoryMapping.getInstance();
    const categoryModel = tabToCategoryMapping.get(tabIdentifier);
    return categoryModel.getCategories();
  }
}
