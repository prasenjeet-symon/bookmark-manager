/**
 *
 * Model Store Status
 */
export enum ModelStoreStatus {
  READY = "READY",
  ERROR = "error",
  BOOTING = "booting",
}

/**
 *
 *
 * Model Mutation Identifier
 */
export enum MutationModelIdentifier {
  TABS = "tabs",
}

/**
 *
 * Mutation identifier
 */
export enum ApplicationMutationIdentifier {
  ADD_TAB = "add_tab",
}

/**
 *
 *
 * Mutation Types
 */
export enum MutationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  CREATE_MANY = "create_many",
  UPDATE_MANY = "update_many",
  DELETE_MANY = "delete_many",
}

export namespace MutationType {
  // From value
  export function fromValue(value: string) {
    switch (value) {
      case "create":
        return MutationType.CREATE;
      case "update":
        return MutationType.UPDATE;
      case "delete":
        return MutationType.DELETE;
      case "create_many":
        return MutationType.CREATE_MANY;
      case "update_many":
        return MutationType.UPDATE_MANY;
      case "delete_many":
        return MutationType.DELETE_MANY;
      default:
        return MutationType.CREATE;
    }
  }

  // To value
  export function toValue(value: MutationType) {
    switch (value) {
      case MutationType.CREATE:
        return "create";
      case MutationType.UPDATE:
        return "update";
      case MutationType.DELETE:
        return "delete";
      case MutationType.CREATE_MANY:
        return "create_many";
      case MutationType.UPDATE_MANY:
        return "update_many";
      case MutationType.DELETE_MANY:
        return "delete_many";
      default:
        return "create";
    }
  }
}
/**
 *
 *
 * Mutation Model Data
 */
export class MutationModelData {
  public identifier: MutationModelIdentifier;
  public data: any;
  public type: MutationType;

  constructor(
    identifier: MutationModelIdentifier,
    data: any,
    type: MutationType
  ) {
    this.identifier = identifier;
    this.data = data;
    this.type = type;
  }
}

/**
 *
 *
 * Application mutation data
 */
export class ApplicationMutationData {
  public identifier: ApplicationMutationIdentifier;
  public data: any;

  constructor(identifier: ApplicationMutationIdentifier, data: any) {
    this.identifier = identifier;
    this.data = data;
  }
}
/**
 *
 * Model store
 */
export class ModelStore<T> {
  public status: ModelStoreStatus;
  public data: T;

  public constructor(
    data: T,
    status: ModelStoreStatus = ModelStoreStatus.READY
  ) {
    this.data = data;
    this.status = status;
  }
}
