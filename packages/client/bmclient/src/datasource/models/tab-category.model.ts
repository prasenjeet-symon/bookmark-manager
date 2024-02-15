import { BehaviorSubject, Subscription, combineLatest, map, of, switchMap } from "rxjs";
import { ApplicationToken, singleCall } from "../http/http.manager";
import { LocalDatabase } from "../localstore.api";
import { CategoryToLinkMapping, UserToSettingMapping } from "../mapping";
import { NetworkApi } from "../network.api";
import { Link, ModelStore, ModelStoreStatus, MutationModelData, MutationModelIdentifier, MutationType, TabCategory } from "../schema";
import { Constants, Logger, MutationModel, deepCopyList, onlyActiveItemsModelStore } from "../utils";

export class TabCategoryModel {
  private readonly _nodeId: string; // Node Id : tabIdentifier;
  private readonly _storeName: string;
  private readonly _database: LocalForage;

  private _source = new BehaviorSubject<ModelStore<TabCategory[]>>({
    status: ModelStoreStatus.BOOTING,
    data: [],
  });

  private _prevData: TabCategory[] = [];
  private _nextData: TabCategory[] = [];
  private _subscription: Subscription | null = null;

  constructor(nodeId: string) {
    MutationModel.getInstance().observable.subscribe((data) => {
      if (data.identifier === MutationModelIdentifier.TAB_CATEGORY) {
        this._get();
      }
    });

    this._nodeId = nodeId;
    this._storeName = `tab_category_store_${nodeId}`;

    this._database = LocalDatabase.getInstance().database.createInstance({
      description: "Store for tab category",
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
        return TabCategory.fromJson(item!);
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
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }

    this._subscription = new NetworkApi().getCategories(this._nodeId).subscribe((val) => {
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
   * Get tab's category
   */
  public getCategories() {
    const userToSettingMapping = UserToSettingMapping.getInstance();
    const userId = ApplicationToken.getInstance().getUserId;
    const settingModel = userToSettingMapping.get(userId || "");

    const onlyActiveCategories$ = this._source.pipe(map(onlyActiveItemsModelStore)).pipe(
      switchMap((categoriesStore) => {
        const allCategories = categoriesStore.data;
        if (allCategories.length === 0) {
          return of([]);
        }

        const allCategoriesLength$ = allCategories.map((category: TabCategory) => {
          const categoryToLinkMapping = CategoryToLinkMapping.getInstance();
          const linkModel = categoryToLinkMapping.get(category.identifier, category.tabIdentifier);

          return linkModel
            .getCategoryLink()
            .pipe(
              map((linksStore) => {
                return linksStore.data as Link[];
              })
            )
            .pipe(
              map((links) => {
                return links.length;
              })
            );
        });

        return combineLatest(allCategoriesLength$).pipe(
          map((linksLength) => {
            return linksLength.map((linkLength, i) => {
              const data = allCategories[i] as TabCategory;
              data.linkCount = linkLength;
              return data;
            });
          })
        );
      })
    );

    return settingModel.userSetting.pipe(
      switchMap((userSettingStore) => {
        const { data, status } = userSettingStore;
        if (status !== ModelStoreStatus.READY || data.length === 0) {
          return of(new ModelStore([]));
        }

        const settingFinal = data[0];
        return onlyActiveCategories$.pipe(
          map((categories) => {
            const finalData = categories.map((category) => {
              category.canShowLinkCount = settingFinal.showNumberOfBookmarkInCategory;
              category.canShowTagInTooltip = settingFinal.showTagsInTooltip;
              category.canShowNoteInTooltip = settingFinal.showNoteInTooltip;
              return category;
            });

            return new ModelStore(finalData);
          })
        );
      })
    );
  }

  /**
   *
   * Add new category
   *
   */
  public async addCategory(category: TabCategory) {
    this._prevData = deepCopyList(this._nextData);
    this._nextData.push(category);
    this._emit();

    try {
      await singleCall(new NetworkApi().addCategory(category));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.TAB_CATEGORY, category, MutationType.CREATE));
      return;
    } catch (error) {
      console.log(error);
      Logger.getInstance().log(error);

      // Rollback
      this._nextData = deepCopyList(this._prevData);
      this._emit();
      return;
    }
  }

  /**
   *
   * Update category
   */
  public async updateCategory(category: TabCategory) {
    this._prevData = deepCopyList(this._nextData);

    this._nextData = this._nextData.map((p) => {
      if (p.identifier === category.identifier) {
        return category;
      } else {
        return p;
      }
    });

    this._emit();

    try {
      await singleCall(new NetworkApi().updateCategory(category));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.TAB_CATEGORY, category, MutationType.UPDATE));
      return;
    } catch (error) {
      Logger.getInstance().log(error);

      // Rollback
      this._nextData = deepCopyList(this._prevData);
      this._emit();
      return;
    }
  }

  /**
   *
   * Delete category
   */
  public async deleteCategory(category: TabCategory) {
    this._prevData = deepCopyList(this._nextData);

    this._nextData = this._nextData.map((p) => {
      if (p.identifier === category.identifier) {
        p.isDeleted = true;
        return p;
      } else {
        return p;
      }
    });

    this._emit();

    try {
      await singleCall(new NetworkApi().deleteCategory(category));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.TAB_CATEGORY, category, MutationType.DELETE));
      return;
    } catch (error) {
      Logger.getInstance().log(error);

      // Rollback
      this._nextData = deepCopyList(this._prevData);
      this._emit();
      return;
    }
  }

  /**
   *
   * Update orders of categories
   */
  public async updateOrders(categories: TabCategory[]) {
    this._prevData = deepCopyList(this._nextData);

    const categoriesWithOrders = categories.map((p, i) => {
      p.order = i + 1;
      return p;
    });

    this._nextData = categoriesWithOrders;
    this._emit();

    try {
      await Promise.all(categoriesWithOrders.map((p) => singleCall(new NetworkApi().updateCategory(p))));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.TAB_CATEGORY, categoriesWithOrders, MutationType.UPDATE_MANY));
      return;
    } catch (error) {
      Logger.getInstance().log(error);

      // Rollback
      this._nextData = deepCopyList(this._prevData);
      this._emit();
      return;
    }
  }
}
