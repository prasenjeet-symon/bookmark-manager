import { BehaviorSubject, Subscription } from "rxjs";
import { LocalDatabase } from "../localstore.api";
import { NetworkApi } from "../network.api";
import { Link, ModelStore, ModelStoreStatus, MutationModelIdentifier } from "../schema";
import { Constants, MutationModel } from "../utils";

export class CategoryLinkModel {
  private readonly _nodeId: string; // Node Id : categoryIdentifier;
  private readonly _nodeIdP1: string; // Node Id : tabIdentifier;
  private readonly _storeName: string;
  private readonly _database: LocalForage;

  private _source = new BehaviorSubject<ModelStore<Link[]>>({
    status: ModelStoreStatus.BOOTING,
    data: [],
  });

  private _prevData: Link[] = [];
  private _nextData: Link[] = [];
  private _subscription: Subscription | null = null;

  constructor(nodeId: string, nodeIdP1: string) {
    MutationModel.getInstance().observable.subscribe((data) => {
      if (data.identifier === MutationModelIdentifier.CATEGORY_LINK) {
        this._get();
      }
    });

    this._nodeId = nodeId;
    this._nodeIdP1 = nodeIdP1;
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
    const keys = await this._database.keys();
    const rowItems = await Promise.all(keys.map((key) => this._database.getItem<string>(key)));
    const data = rowItems
      .filter((item) => item !== null)
      .map((item) => {
        return Link.fromJson(JSON.parse(item!));
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

    this._subscription = new NetworkApi().getLinks(this._nodeIdP1, this._nodeId).subscribe((val) => {
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
