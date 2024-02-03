import { BehaviorSubject } from "rxjs";
import { singleCall } from "../http/http.manager";
import { LocalDatabase } from "../localstore.api";
import { NetworkApi } from "../network.api";
import { ModelStore, ModelStoreStatus, MutationModelData, MutationModelIdentifier, MutationType, User } from "../schema";
import { Constants, Logger, MutationModel, deepCopyList } from "../utils";

export class UserDetailModel {
  private readonly _nodeId: string; // Node Id : userId;
  private readonly _storeName: string;
  private readonly _database: LocalForage;

  private _source = new BehaviorSubject<ModelStore<User[]>>({
    status: ModelStoreStatus.BOOTING,
    data: [],
  });

  private _prevData: User[] = [];
  private _nextData: User[] = [];

  constructor(nodeId: string) {
    MutationModel.getInstance().observable.subscribe((data) => {
      if (data.identifier === MutationModelIdentifier.USERS) {
        this._get();
      }
    });

    this._nodeId = nodeId;
    this._storeName = "user_detail_store";

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
    const rowItems = await Promise.all(keys.map((key) => this._database.getItem(key)));
    const data = rowItems.map((item) => {
      return User.fromJson(item);
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
    await Promise.all(this._nextData.map((item) => this._database.setItem(item.userId, item.toJson())));
  }

  /**
   *
   * Get from network
   */
  private _get() {
    new NetworkApi().getUser().subscribe((val) => {
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
   * Get user details
   */
  public getUserDetails() {
    return this._source.asObservable();
  }

  /**
   * Update user
   */
  public async updateUser(user: User) {
    this._prevData = deepCopyList(this._nextData);
    this._nextData = this._nextData.map((p) => {
      if (p.userId === user.userId) {
        return user;
      } else {
        return p;
      }
    });

    this._emit();

    try {
      await singleCall(new NetworkApi().updateUser(user));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.USERS, user, MutationType.UPDATE));
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
