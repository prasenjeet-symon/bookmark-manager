import localforage from "localforage";
import { Subject } from "rxjs";
import { ModelStore, MutationModelData } from "./schema";
/**
 *
 * Api response message
 */
export class ApiResponseMessage {
  public static readonly USER_EXISTS = "User already exists";
  public static readonly USER_NOT_FOUND = "User not found";
  public static readonly INVALID_PASSWORD = "Invalid password";
}

/**
 *
 *
 */
export class Constants {
  public static get LOCAL_STORE_VERSION() {
    return 1;
  }

  // Default driver
  public static get DEFAULT_DRIVER() {
    return localforage.INDEXEDDB;
  }
}

/**
 *
 *
 * Api Response
 */
export class ApiResponse {
  public status: number;
  public data: any;
  public statusText: string;

  constructor(status: number, data: any, statusText: string) {
    this.status = status;
    this.data = data;
    this.statusText = statusText;
  }
}
/**
 *
 *
 * Mutation Manger
 */
export class MutationModel {
  private static instance: MutationModel;

  private subject = new Subject<MutationModelData>();

  public get observable() {
    return this.subject;
  }

  private constructor() {}

  public static getInstance() {
    if (!MutationModel.instance) {
      MutationModel.instance = new MutationModel();
    }
    return MutationModel.instance;
  }

  // Dispatch
  public dispatch(data: MutationModelData) {
    this.subject.next(data);
  }

  // Dispose
  public dispose() {
    this.subject.complete();
  }
}
/**
 *
 *
 * Json field parser
 */
export class JsonParser {
  public static parse<T>(json: any, key: string, type: "string" | "int" | "boolean" | "datetime" | "float"): T | null {
    if (!json || !key) return null;
    const isKey = Object.keys(json).includes(key);
    if (!isKey) return null;
    const value = json[key];
    if (value === null) return null;

    switch (type) {
      case "string":
        return String(value) as T;
      case "int":
        return Number.parseInt(value) as T;
      case "boolean":
        return Boolean(value) as T;
      case "datetime":
        return new Date(value) as T;
      case "float":
        return Number.parseFloat(value) as T;
      default:
        return null;
    }
  }

  /**
   * Parsed required field
   */
  public static parseStrict<T>(json: any, key: string, type: "string" | "int" | "boolean" | "datetime" | "float"): T {
    if (!json || !key) throw new Error("Json or key is null");
    const isKey = Object.keys(json).includes(key);
    if (!isKey) throw new Error(`${key} not found`);
    const value = json[key];
    if (value === null) throw new Error(`Value of ${key} is null`);

    switch (type) {
      case "string":
        return String(value) as T;
      case "int":
        return Number.parseInt(value) as T;
      case "boolean":
        return Boolean(value) as T;
      case "datetime":
        return new Date(value) as T;
      case "float":
        return Number.parseFloat(value) as T;
      default:
        throw new Error(`Type ${type} not supported`);
    }
  }
}
/**
 *
 * Network interface
 */
export interface Network<T> {
  toJson(): string;
  toRecord(): any;
  deepCopy(): T;
}

/**
 *
 *
 * Logger
 */
export class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(...args: any): void {
    console.log(...args);
  }

  private logWithColor(message: string, color: string): void {
    console.log(`${color}%s\x1b[0m`, message);
  }

  public logWarning(message: string): void {
    this.logWithColor(`Warning: ${message}`, "\x1b[33m"); // Yellow
  }

  public logError(message: string): void {
    this.logWithColor(`Error: ${message}`, "\x1b[31m"); // Red
  }

  public logSuccess(message: string): void {
    this.logWithColor(`Success: ${message}`, "\x1b[32m"); // Green
  }
}
/**
 *
 * Deep copy list
 */
export function deepCopyList<T extends Network<T>>(list: T[]): T[] {
  return list.map((item) => item.deepCopy());
}

/**
 *
 * Give me int id
 */
export function getRandomIntId(): number {
  return Math.floor(+new Date() / 1000);
}
/**
 *
 *
 */
export function trimText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.slice(0, maxLength) + "...";
  }
}

/**
 *
 *
 */
export function getRandomInt(n: number): number {
  return Math.floor(Math.random() * n) + 1;
}

/**
 *
 *
 *
 */
export async function getIcoIcon(link: string): Promise<string | null> {
  try {
    // Send a GET request to the website with no cors
    const response = await fetch(link, { mode: "no-cors" });
    const html = await response.text();

    // Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Find the link to the ICO icon
    let iconLink: string | null = null;
    const iconTags = doc.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    iconTags.forEach((tag) => {
      iconLink = tag.getAttribute("href");
      if (iconLink) {
        // If the link is relative, convert it to absolute
        if (!iconLink.startsWith("http")) {
          const baseUrl = new URL(link);
          iconLink = new URL(iconLink, baseUrl).href;
        }
      }
    });

    return iconLink;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

/**
 *
 * Only active item
 */
export function onlyActiveItems<T extends ApiResponse>(data: T) {
  const oldData = data.data;
  const status = data.status;

  if (status !== 200) {
    return data;
  }

  if (!Array.isArray(oldData)) {
    return data;
  }

  const nonDeletedItems = (oldData as Array<any>).filter((p) => p.isDeleted === false);
  return new ApiResponse(data.status, nonDeletedItems, data.statusText);
}

/**
 *
 * Only active item for model store
 */
export function onlyActiveItemsModelStore<T extends Array<any>>(data: ModelStore<T>) {
  const allItems = data.data;
  const nonDeletedItems = allItems.filter((p) => p.isDeleted === false);
  return new ModelStore(nonDeletedItems, data.status);
}
/**
 *
 * Open all links to new tab
 */

export function openUrlsInInterval(urlList: string[]): void {
  for (let i = 0; i < urlList.length; i++) {
    window.open(urlList[i], "_blank");
  }
}
