import { BehaviorSubject, Subscription, combineLatest, map, of, switchMap } from "rxjs";
import { ApplicationToken, singleCall } from "../http/http.manager";
import { LocalDatabase } from "../localstore.api";
import { TabToCategoryMapping, UserToSettingMapping } from "../mapping";
import { NetworkApi } from "../network.api";
import { ModelStore, ModelStoreStatus, MutationModelData, MutationModelIdentifier, MutationType, UserTab } from "../schema";
import { Constants, Logger, MutationModel, deepCopyList, onlyActiveItemsModelStore } from "../utils";

export class UserTabModel {
  private readonly _nodeId: string; // Node Id : userId;
  private readonly _storeName: string;
  private readonly _database: LocalForage;

  private _source = new BehaviorSubject<ModelStore<UserTab[]>>({
    status: ModelStoreStatus.BOOTING,
    data: [],
  });

  private _prevData: UserTab[] = [];
  private _nextData: UserTab[] = [];
  private _subscription: Subscription | null = null;

  constructor(nodeId: string) {
    MutationModel.getInstance().observable.subscribe((data) => {
      if (data.identifier === MutationModelIdentifier.TABS) {
        this._get();
      }
    });

    this._nodeId = nodeId;
    this._storeName = "user_tab_store";

    this._database = LocalDatabase.getInstance().database.createInstance({
      description: "Store for user tab",
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
        return UserTab.fromJson(item!);
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

    this._subscription = new NetworkApi().getTabs().subscribe((val) => {
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
    this._source.value.data = this._nextData;
    this._source.value.status = ModelStoreStatus.READY;
    this._source.next(this._source.value);
  }

  /**
   *
   * Get tabs
   */
  public getTabs() {
    const userId = ApplicationToken.getInstance().getUserId;
    const userToSettingMapping = UserToSettingMapping.getInstance();
    const settingModel = userToSettingMapping.get(userId || "");

    const tabsWithLinksCount$ = this._source.pipe(map(onlyActiveItemsModelStore)).pipe(
      switchMap((tabsState) => {
        if (tabsState.data.length === 0) {
          return of(new ModelStore([]));
        }

        const allTabs = tabsState.data as UserTab[];

        const tabsWithLinkCount$ = combineLatest(
          allTabs.map((tab) => {
            const tabToCategoryMapping = TabToCategoryMapping.getInstance();
            const categoryModel = tabToCategoryMapping.get(tab.identifier);
            return categoryModel
              .getCategories()
              .pipe(
                map((categoriesState) => {
                  const allCategories = categoriesState.data;
                  return allCategories.map((cat) => cat.linkCount);
                })
              )
              .pipe(
                map((linksCount) => {
                  return linksCount.reduce((a, b) => a + b, 0);
                })
              );
          })
        )
          .pipe(
            map((linksCount) => {
              return allTabs.map((tab, index) => {
                tab.linkCount = linksCount[index];
                return tab;
              });
            })
          )
          .pipe(
            map((val) => {
              return new ModelStore(val, tabsState.status);
            })
          );

        return tabsWithLinkCount$;
      })
    );

    return settingModel.userSetting.pipe(
      switchMap((settingState) => {
        if (settingState.data.length === 0 || settingState.status !== ModelStoreStatus.READY) {
          return of(new ModelStore([]));
        }

        const settingFinal = settingState.data[0];

        return tabsWithLinksCount$.pipe(
          map((tabsState) => {
            const tabs = tabsState.data as UserTab[];
            const finalTabs = tabs.map((p) => {
              p.canShowLinkCount = settingFinal.showNumberOfBookmarkInTab;
              return p;
            });

            return new ModelStore(finalTabs, tabsState.status);
          })
        );
      })
    );
  }

  /**
   *
   * Add new tab
   */
  public async addTab(tab: UserTab) {
    this._prevData = deepCopyList(this._nextData);
    this._nextData.push(tab);
    this._emit();

    try {
      await singleCall(new NetworkApi().addTab(tab));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.TABS, tab, MutationType.CREATE));
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
   * Update tab
   */
  public async updateTab(tab: UserTab) {
    this._prevData = deepCopyList(this._nextData);
    this._nextData = this._nextData.map((p) => {
      if (p.identifier === tab.identifier) {
        return tab;
      } else {
        return p;
      }
    });

    this._emit();

    try {
      await singleCall(new NetworkApi().updateTab(tab));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.TABS, tab, MutationType.UPDATE));
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
   * Delete tab
   */
  public async deleteTab(tab: UserTab) {
    this._prevData = deepCopyList(this._nextData);
    this._nextData = this._nextData.map((p) => {
      if (p.identifier === tab.identifier) {
        p.isDeleted = true;
        return p;
      } else {
        return p;
      }
    });

    this._emit();

    try {
      await singleCall(new NetworkApi().deleteTab(tab));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.TABS, tab, MutationType.DELETE));
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
