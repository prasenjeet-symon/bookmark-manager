import { BehaviorSubject, Subscription } from "rxjs";
import { singleCall } from "../http/http.manager";
import { LocalDatabase } from "../localstore.api";
import { NetworkApi } from "../network.api";
import { ModelStore, ModelStoreStatus, MutationModelData, MutationModelIdentifier, MutationType, UserTab } from "../schema";
import { Constants, Logger, MutationModel, deepCopyList } from "../utils";

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
        return UserTab.fromJson(JSON.parse(item!));
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
    this._source.next(new ModelStore(this._nextData));
  }

  /**
   *
   * Get tabs
   */
  public getTabs() {
    return this._source.asObservable();
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
      this._saveLocal();
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
      this._saveLocal();
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
      this._saveLocal();
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
