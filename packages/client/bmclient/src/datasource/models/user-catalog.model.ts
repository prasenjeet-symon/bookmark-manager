import { BehaviorSubject, firstValueFrom, map, switchMap } from "rxjs";
import { singleCall } from "../http/http.manager";
import { LocalDatabase } from "../localstore.api";
import { NetworkApi } from "../network.api";
import { Link, ModelStore, ModelStoreStatus, MutationModelData, MutationModelIdentifier, MutationType, TabCategory } from "../schema";
import { Constants, Logger, MutationModel, deepCopyList } from "../utils";

export class UserCatalogModel {
  private readonly _nodeId: string; // userId
  private readonly _storeName: string;
  private _database: LocalForage;

  // Source
  private _source: BehaviorSubject<ModelStore<Link[]>> = new BehaviorSubject<ModelStore<Link[]>>({
    status: ModelStoreStatus.BOOTING,
    data: [],
  });

  // Selected links source
  private _selectedLinks = new BehaviorSubject<Link[]>([]);
  // For search
  private _search = new BehaviorSubject<string>("");

  // Prev and next data
  private _prevData: Link[] = [];
  private _nextData: Link[] = [];

  constructor(nodeId: string) {
    this._nodeId = nodeId;
    this._storeName = `user_catalog_store_${nodeId}`;

    MutationModel.getInstance().observable.subscribe((data) => {
      if (data.identifier === MutationModelIdentifier.CATALOG) {
        this._get();
      }
    });

    this._database = LocalDatabase.getInstance().database.createInstance({
      description: "Store for user detail",
      storeName: this._storeName,
      version: Constants.LOCAL_STORE_VERSION,
    });

    this._getLocal().then(() => {
      this._get();
    });
  }

  /**
   *
   * Get local data
   */
  private async _getLocal() {
    // Get all items
    const keys = await this._database.keys();
    const rowItems = await Promise.all(keys.map((key) => this._database.getItem<string>(key)));
    const data = rowItems
      .filter((item) => item !== null)
      .map((item) => {
        return Link.fromJson(item!);
      });

    this._prevData = data;
    this._nextData = data;

    this._emit();
  }

  /**
   *
   * Save local data
   */
  private async _saveLocal() {
    await this._database.clear();
    await Promise.all(this._nextData.map((item) => this._database.setItem(item.identifier, item.toJson())));
  }

  /**
   *
   * Get from network
   */
  private _get() {
    new NetworkApi().getCatalog().subscribe((val) => {
      const { data, status } = val;
      if (status === 200) {
        this._nextData = data;
        this._prevData = data;
        this._emit();
        this._saveLocal();
      }
    });
  }

  /**
   *
   * Emit
   */
  private _emit() {
    this._source.next(new ModelStore(this._nextData, ModelStoreStatus.READY));
  }

  /**
   *
   * Toggle link selection
   */
  public async toggleLink(link: Link) {
    const oldLink = await firstValueFrom(this._selectedLinks.asObservable());
    const foundLink = oldLink.find((l) => l.identifier === link.identifier);
    if (foundLink) {
      // Remove
      this._selectedLinks.next(oldLink.filter((l) => l.identifier !== link.identifier));
    } else {
      // Add it
      this._selectedLinks.next([...oldLink, link]);
    }
  }

  /**
   *
   * Reset selection
   */
  public resetSelection() {
    this._selectedLinks.next([]);
  }

  /**
   *
   * Search
   */
  public search(query: string) {
    // Add your search logic here
    this._search.next(query);
  }

  /**
   *
   * Get links with selection
   */
  public getLinks() {
    const linkWithSelection$ = this._selectedLinks.pipe(
      switchMap((selectedLinksStore) => {
        return this._source
          .pipe(
            map((innerLinksStore) => {
              // only non deleted
              return new ModelStore<Link[]>(
                innerLinksStore.data.filter((link) => link.isDeleted === false && link.categoryIdentifier === null),
                innerLinksStore.status
              );
            })
          )
          .pipe(
            map((innerLinksStore) => {
              const linksWithSelection = innerLinksStore.data.map((link) => {
                const foundLink = selectedLinksStore.find((l) => l.identifier === link.identifier);
                if (foundLink) {
                  return { ...link, selected: true } as Link;
                } else {
                  return { ...link, selected: false } as Link;
                }
              });

              return new ModelStore<Link[]>(linksWithSelection, innerLinksStore.status);
            })
          );
      })
    );

    return this._search.pipe(
      switchMap((searchQuery) => {
        return linkWithSelection$.pipe(
          map((linkWithSelection) => {
            if (searchQuery) {
              return new ModelStore<Link[]>(
                linkWithSelection.data.filter((link) => {
                  const titleMatched = new RegExp(searchQuery, "ig").test(link.title || "");
                  const isUrlMatched = new RegExp(searchQuery, "ig").test(link.url || "");
                  const isTagMatched = new RegExp(searchQuery, "ig").test(link.tags.join(" ") || "");

                  return titleMatched || isUrlMatched || isTagMatched;
                }),
                linkWithSelection.status
              );
            } else {
              return linkWithSelection;
            }
          })
        );
      })
    );
  }

  /**
   *
   * Delete link
   */
  public async deleteLink(link: Link) {
    this._prevData = deepCopyList(this._nextData);

    this._nextData = this._nextData.map((p) => {
      if (p.identifier === link.identifier) {
        p.isDeleted = true;
        return p;
      } else {
        return p;
      }
    });

    this._emit();

    try {
      await singleCall(new NetworkApi().deleteCatalogLink(link));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.CATALOG, link, MutationType.DELETE));
      return;
    } catch (error: any) {
      Logger.getInstance().log(error);

      // Rollback
      this._nextData = deepCopyList(this._prevData);
      this._emit();
      return;
    }
  }

  /**
   *
   * Move link to category
   */
  public async moveLinkToCategory(link: Link, category: TabCategory) {
    this._prevData = deepCopyList(this._nextData);

    this._nextData = this._nextData.map((p) => {
      if (p.identifier === link.identifier) {
        p.categoryIdentifier = category.identifier;
        return p;
      } else {
        return p;
      }
    });

    this._emit();

    try {
      await singleCall(new NetworkApi().moveCatalogLink(link, category.identifier));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.CATALOG, link, MutationType.UPDATE));
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.CATEGORY_LINK, category, MutationType.UPDATE));
      return;
    } catch (error: any) {
      Logger.getInstance().log(error);

      // Rollback
      this._nextData = deepCopyList(this._prevData);
      this._emit();
      return;
    }
  }
}
