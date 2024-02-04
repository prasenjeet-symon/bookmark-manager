import { BehaviorSubject, Subscription } from "rxjs";
import { LocalDatabase } from "../localstore.api";
import { ModelStore, ModelStoreStatus, MutationModelIdentifier } from "../schema";
import { Constants, MutationModel } from "../utils";
import { NetworkApi } from "../network.api";

export class CategoryLinkModel {
  private readonly _nodeId: string; // Node Id : categoryIdentifier;
  private readonly _storeName: string;
  private readonly _database: LocalForage;

  private _source = new BehaviorSubject<ModelStore<CategoryLink[]>>({
    status: ModelStoreStatus.BOOTING,
    data: [],
  });

  private _prevData: CategoryLink[] = [];
  private _nextData: CategoryLink[] = [];
  private _subscription: Subscription | null = null;

  constructor(nodeId: string) {
    MutationModel.getInstance().observable.subscribe((data) => {
      if (data.identifier === MutationModelIdentifier.CATEGORY_LINK) {
        this._get();
      }
    });

    this._nodeId = nodeId;
    this._storeName = "category_link_store";

    this._database = LocalDatabase.getInstance().database.createInstance({
      description: "Store for category link",
      storeName: this._storeName,
      version: Constants.LOCAL_STORE_VERSION,
    });

    this._getLocal().then(() => {
      this._get();
    });
  }

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
}
