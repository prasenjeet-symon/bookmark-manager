import { Subject } from "rxjs";
import { MutationModelData } from "./schema";
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
    return this.subject.asObservable();
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
  toJson(): Record<string, any>;
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
