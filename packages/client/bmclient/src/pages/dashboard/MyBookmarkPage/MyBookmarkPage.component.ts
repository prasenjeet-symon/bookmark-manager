import { ApplicationToken } from "@/datasource/http/http.manager";
import { UserToCatalogMapping } from "@/datasource/mapping";
import { Link } from "@/datasource/schema";

export class MyBookmarkPageController {
  constructor() {}

  /**
   * Get all catalog links
   */
  public getCatalogLinks() {
    const userId = ApplicationToken.getInstance().getUserId;
    const userToCatalogMapping = UserToCatalogMapping.getInstance();
    const catalogModel = userToCatalogMapping.get(userId || "");
    return catalogModel.getLinks();
  }

  /** 
   * 
   * Toggle link selection
   */
  public toggleLinkSelection(link: Link){
    const userId = ApplicationToken.getInstance().getUserId;
    const userToCatalogMapping = UserToCatalogMapping.getInstance();
    const catalogModel = userToCatalogMapping.get(userId || "");
    catalogModel.toggleLink(link);
  }

  /** 
   * 
   * Clear selection
   */
  public clearSelection(){
    const userId = ApplicationToken.getInstance().getUserId;
    const userToCatalogMapping = UserToCatalogMapping.getInstance();
    const catalogModel = userToCatalogMapping.get(userId || "");
    catalogModel.resetSelection();
  }

  /** 
   * 
   * Search catalog
   */
  public searchCatalog(query: string){
    const userId = ApplicationToken.getInstance().getUserId;
    const userToCatalogMapping = UserToCatalogMapping.getInstance();
    const catalogModel = userToCatalogMapping.get(userId || "");
    catalogModel.search(query);
  }
}
