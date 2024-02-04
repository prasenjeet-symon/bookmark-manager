import { BehaviorSubject, Subscription } from "rxjs";
import { singleCall } from "../http/http.manager";
import { LocalDatabase } from "../localstore.api";
import { NetworkApi } from "../network.api";
import { ModelStore, ModelStoreStatus, MutationModelData, MutationModelIdentifier, MutationType, TabCategory } from "../schema";
import { Constants, Logger, MutationModel, deepCopyList } from "../utils";

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
    this._storeName = "tab_category_store";

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
        return TabCategory.fromJson(JSON.parse(item!));
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
    this._source.next(new ModelStore(this._nextData));
  }

  /**
   * Get tab's category
   */
  public getCategories() {
    return this._source.asObservable();
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
      this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.TAB_CATEGORY, category, MutationType.CREATE));
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
      this._saveLocal();
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
      this._saveLocal();
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
}
