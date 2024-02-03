import { BehaviorSubject, Subscription } from "rxjs";
import { LocalDatabase } from "../localstore.api";
import { NetworkApi } from "../network.api";
import { ModelStore, ModelStoreStatus, MutationModelIdentifier, UserSetting } from "../schema";
import { Constants, MutationModel } from "../utils";

export class UserSettingModel {
  private readonly _nodeId: string; // Node Id : userId;
  private readonly _storeName: string;
  private readonly _database: LocalForage;

  private _source = new BehaviorSubject<ModelStore<UserSetting[]>>({
    status: ModelStoreStatus.BOOTING,
    data: [],
  });

  private _prevData: UserSetting[] = [];
  private _nextData: UserSetting[] = [];
  private _subscription: Subscription | null = null;

  constructor(nodeId: string) {
    MutationModel.getInstance().observable.subscribe((data) => {
      if (data.identifier === MutationModelIdentifier.USER_SETTING) {
        this._get();
      }
    });

    this._nodeId = nodeId;
    this._storeName = "user_setting_store";

    this._database = LocalDatabase.getInstance().database.createInstance({
      description: "Store for user setting",
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
    const rowItems = await Promise.all(keys.map((key) => this._database.getItem(key)));
    const data = rowItems.map((item) => {
      return UserSetting.fromJson(item);
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
    await Promise.all(this._nextData.map((item) => this._database.setItem(item.userIdentifier, item.toJson())));
  }

  /**
   *
   * Get from network
   */
  private _get() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this._subscription = new NetworkApi().getUserSetting().subscribe((val) => {
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
   * Get user setting, stream
   */
  public get userSetting() {
    return this._source.asObservable();
  }
}
