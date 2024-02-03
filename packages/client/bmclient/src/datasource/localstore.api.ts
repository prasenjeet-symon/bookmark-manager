import localForage from "localforage";

/**
 *
 * Local Store Database API
 */
export class LocalDatabase {
  private static instance: LocalDatabase;
  private db: LocalForage;

  private constructor() {
    localForage.config({
      name: "bmclient",
      storeName: "data",
      description: "bmclient local store",
      driver: localForage.INDEXEDDB,
      version: 1,
    });

    this.db = localForage;
  }

  public get database() {
    return this.db;
  }

  public static getInstance() {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }
}
