import { BehaviorSubject, Subscription, map } from "rxjs";
import { singleCall } from "../http/http.manager";
import { LocalDatabase } from "../localstore.api";
import { NetworkApi } from "../network.api";
import { Link, ModelStore, ModelStoreStatus, MutationModelData, MutationModelIdentifier, MutationType } from "../schema";
import { Constants, Logger, MutationModel, deepCopyList, onlyActiveItemsModelStore } from "../utils";

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
    this._source.value.data = this._nextData;
    this._source.value.status = ModelStoreStatus.READY;
    this._source.next(this._source.value);
  }

  /**
   *
   * Add new link
   *
   */
  public async addLink(link: Link) {
    this._prevData = deepCopyList(this._nextData);
    this._nextData.push(link);
    this._emit();

    try {
      await singleCall(new NetworkApi().addLink(this._nodeIdP1, this._nodeId, link));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.CATEGORY_LINK, link, MutationType.CREATE));
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
   * Update link
   */
  public async updateLink(link: Link) {
    this._prevData = deepCopyList(this._nextData);

    this._nextData = this._nextData.map((p) => {
      if (p.identifier === link.identifier) {
        return link;
      } else {
        return p;
      }
    });

    this._emit();

    try {
      await singleCall(new NetworkApi().updateLink(this._nodeIdP1, this._nodeId, link));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.CATEGORY_LINK, link, MutationType.UPDATE));
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
      await singleCall(new NetworkApi().deleteLink(this._nodeIdP1, this._nodeId, link));
      await this._saveLocal();
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.CATEGORY_LINK, link, MutationType.DELETE));
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
   * Move delete link
   */
  public async moveDeleteLink(link: Link) {
    this._nextData = this._nextData.filter((p) => {
      return p.identifier !== link.identifier;
    });

    this._emit();
    await this._saveLocal();
  }

  /**
   *
   * Move add link
   */
  public async moveAddLink(link: Link) {
    this._nextData.push(link);
    this._emit();
    await this._saveLocal();
  }

  /**
   *
   * Get category link
   */
  public getCategoryLink() {
    return this._source.pipe(map(onlyActiveItemsModelStore));
  }
}
