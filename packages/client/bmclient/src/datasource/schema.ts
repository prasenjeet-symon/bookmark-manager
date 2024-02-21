import { JsonParser, Network } from "./utils";

/**
 *
 *
 * Task tracker data
 */
export class TaskTrackerData {
  public status: TaskManagerStatus;
  public message: string | null;
  public error: string | null;
  public progress: number;

  constructor(status: TaskManagerStatus, message: string | null, error: string | null, progress: number) {
    this.status = status;
    this.message = message;
    this.error = error;
    this.progress = progress;
  }
}

/**
 *
 * Task data
 */
export class TaskData {
  public identifier: TaskDataIdentifier;
  public data: any;
  public taskUUID: string;

  constructor(identifier: TaskDataIdentifier, data: any, taskUUID: string) {
    this.identifier = identifier;
    this.data = data;
    this.taskUUID = taskUUID;
  }
}
/**
 *
 *
 * Task data identifier
 */
export enum TaskDataIdentifier {
  IMPORT_BOOKMARK = "import_bookmark",
  EXPORT_BOOKMARK = "export_bookmark",
}

/**
 *
 * Api Mutation Success class
 */
export class ApiMutationSuccess implements Network<ApiMutationSuccess> {
  constructor(public message: string) {}

  public static fromJson(jsonString: string): ApiMutationSuccess {
    const json = JSON.parse(jsonString);
    const parsedMessage = JsonParser.parseStrict<string>(json, "message", "string");
    return new ApiMutationSuccess(parsedMessage);
  }

  public static fromRecord(record: any): ApiMutationSuccess {
    const parsedMessage = JsonParser.parseStrict<string>(record, "message", "string");
    return new ApiMutationSuccess(parsedMessage);
  }

  public toJson() {
    const jsonParsable = {
      message: this.message,
    };

    return JSON.stringify(jsonParsable);
  }

  toRecord() {
    return {
      message: this.message,
    };
  }

  deepCopy(): ApiMutationSuccess {
    return ApiMutationSuccess.fromRecord(this.toRecord());
  }
}
/**
 *
 * Api mutation error class
 */
export class ApiMutationError implements Network<ApiMutationError> {
  constructor(public error: string) {}

  public static fromJson(jsonString: string): ApiMutationError {
    const json = JSON.parse(jsonString);
    const parsedError = JsonParser.parseStrict<string>(json, "error", "string");

    return new ApiMutationError(parsedError);
  }

  public static fromRecord(record: any): ApiMutationError {
    const parsedError = JsonParser.parseStrict<string>(record, "error", "string");
    return new ApiMutationError(parsedError);
  }

  public toJson() {
    const jsonParsable = {
      error: this.error,
    };

    return JSON.stringify(jsonParsable);
  }

  toRecord() {
    return this;
  }

  deepCopy(): ApiMutationError {
    return ApiMutationError.fromRecord(this.toRecord());
  }
}

/**
 *
 * Authentication Class
 */
export class AuthenticationClass implements Network<AuthenticationClass> {
  constructor(public token: string, public userId: string, public email: string, public fullName: string, public timeZone: string | null) {}

  public static fromJson(jsonString: string): AuthenticationClass {
    const json = JSON.parse(jsonString);

    const parsedToken = JsonParser.parseStrict<string>(json, "token", "string");
    const parsedUserId = JsonParser.parseStrict<string>(json, "userId", "string");
    const parsedEmail = JsonParser.parseStrict<string>(json, "email", "string");
    const parsedFullName = JsonParser.parseStrict<string>(json, "fullName", "string");
    const parsedTimeZone = JsonParser.parse<string>(json, "timeZone", "string");

    return new AuthenticationClass(parsedToken, parsedUserId, parsedEmail, parsedFullName, parsedTimeZone);
  }

  public static fromRecord(record: any): AuthenticationClass {
    const parsedToken = JsonParser.parseStrict<string>(record, "token", "string");
    const parsedUserId = JsonParser.parseStrict<string>(record, "userId", "string");
    const parsedEmail = JsonParser.parseStrict<string>(record, "email", "string");
    const parsedFullName = JsonParser.parseStrict<string>(record, "fullName", "string");
    const parsedTimeZone = JsonParser.parse<string>(record, "timeZone", "string");

    return new AuthenticationClass(parsedToken, parsedUserId, parsedEmail, parsedFullName, parsedTimeZone);
  }

  public toJson(): string {
    const jsonParsable = {
      token: this.token,
      userId: this.userId,
      email: this.email,
      fullName: this.fullName,
      timeZone: this.timeZone,
    };

    return JSON.stringify(jsonParsable);
  }

  public toRecord() {
    return {
      token: this.token,
      userId: this.userId,
      email: this.email,
      fullName: this.fullName,
      timeZone: this.timeZone,
    };
  }

  public deepCopy(): AuthenticationClass {
    return AuthenticationClass.fromRecord(this.toRecord());
  }
}
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
  USERS = "users",
  USER_SETTING = "user_setting",
  TAB_CATEGORY = "tab_category",
  CATEGORY_LINK = "category_link",
  CATALOG = "catalog",
}

/**
 *
 * Mutation identifier
 */
export enum ApplicationMutationIdentifier {
  ADD_TAB = "add_tab",
  DELETE_TAB = "delete_tab",
  UPDATE_TAB = "update_tab",
  ADD_CATEGORY = "add_category",
  UPDATE_CATEGORY = "update_category",
  DELETE_CATEGORY = "delete_category",
  ADD_LINK = "add_link",
  UPDATE_LINK = "update_link",
  DELETE_LINK = "delete_link",
  USER_SETTING = "user_setting",
  DELETE_CATALOG_LINK = "delete_catalog_link",
  MOVE_CATALOG_LINK = "move_catalog_link",
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

  constructor(identifier: MutationModelIdentifier, data: any, type: MutationType) {
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

  public constructor(data: T, status: ModelStoreStatus = ModelStoreStatus.READY) {
    this.data = data;
    this.status = status;
  }
}
/**
 *
 *
 * User
 */
export class User implements Network<User> {
  id: number;
  email: string;
  mobile: string | null;
  fullName: string;
  profilePicture: string | null;
  password: string;
  userId: string;
  dateOfBirth: Date | null;
  timeZone: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  maxSession: number;

  constructor(
    id: number,
    email: string,
    mobile: string | null,
    fullName: string,
    profilePicture: string | null,
    password: string,
    userId: string,
    dateOfBirth: Date | null,
    timeZone: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean,
    maxSession: number
  ) {
    this.id = id;
    this.email = email;
    this.mobile = mobile;
    this.fullName = fullName;
    this.profilePicture = profilePicture;
    this.password = password;
    this.userId = userId;
    this.dateOfBirth = dateOfBirth;
    this.timeZone = timeZone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
    this.maxSession = maxSession;
  }

  static fromJson(jsonString: string): User {
    const json = JSON.parse(jsonString);

    const parsedId = JsonParser.parseStrict<number>(json, "id", "int");
    const parsedEmail = JsonParser.parseStrict<string>(json, "email", "string");
    const parsedMobile = JsonParser.parse<string>(json, "mobile", "string");
    const parsedFullName = JsonParser.parseStrict<string>(json, "fullName", "string");
    const parsedProfilePicture = JsonParser.parse<string>(json, "profilePicture", "string");
    const parsedPassword = JsonParser.parseStrict<string>(json, "password", "string");
    const parsedUserId = JsonParser.parseStrict<string>(json, "userId", "string");
    const parsedDateOfBirth = JsonParser.parse<Date>(json, "dateOfBirth", "string");
    const parsedTimeZone = JsonParser.parseStrict<string>(json, "timeZone", "string");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(json, "createdAt", "string");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(json, "updatedAt", "string");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(json, "isDeleted", "boolean");
    const parsedMaxSession = JsonParser.parseStrict<number>(json, "maxSession", "int");

    return new User(
      parsedId,
      parsedEmail,
      parsedMobile,
      parsedFullName,
      parsedProfilePicture,
      parsedPassword,
      parsedUserId,
      parsedDateOfBirth,
      parsedTimeZone,
      parsedCreatedAt,
      parsedUpdatedAt,
      parsedIsDeleted,
      parsedMaxSession
    );
  }

  public static fromRecord(record: any): User {
    const parsedId = JsonParser.parseStrict<number>(record, "id", "int");
    const parsedEmail = JsonParser.parseStrict<string>(record, "email", "string");
    const parsedMobile = JsonParser.parse<string>(record, "mobile", "string");
    const parsedFullName = JsonParser.parseStrict<string>(record, "fullName", "string");
    const parsedProfilePicture = JsonParser.parse<string>(record, "profilePicture", "string");
    const parsedPassword = JsonParser.parseStrict<string>(record, "password", "string");
    const parsedUserId = JsonParser.parseStrict<string>(record, "userId", "string");
    const parsedDateOfBirth = JsonParser.parse<Date>(record, "dateOfBirth", "string");
    const parsedTimeZone = JsonParser.parseStrict<string>(record, "timeZone", "string");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(record, "createdAt", "string");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(record, "updatedAt", "string");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(record, "isDeleted", "boolean");
    const parsedMaxSession = JsonParser.parseStrict<number>(record, "maxSession", "int");

    return new User(
      parsedId,
      parsedEmail,
      parsedMobile,
      parsedFullName,
      parsedProfilePicture,
      parsedPassword,
      parsedUserId,
      parsedDateOfBirth,
      parsedTimeZone,
      parsedCreatedAt,
      parsedUpdatedAt,
      parsedIsDeleted,
      parsedMaxSession
    );
  }

  toJson(): any {
    const jsonParsable = {
      id: this.id,
      email: this.email,
      mobile: this.mobile,
      fullName: this.fullName,
      profilePicture: this.profilePicture,
      password: this.password,
      userId: this.userId,
      dateOfBirth: this.dateOfBirth,
      timeZone: this.timeZone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
      maxSession: this.maxSession,
    };

    return JSON.stringify(jsonParsable);
  }

  public toRecord() {
    return {
      id: this.id,
      email: this.email,
      mobile: this.mobile,
      fullName: this.fullName,
      profilePicture: this.profilePicture,
      password: this.password,
      userId: this.userId,
      dateOfBirth: this.dateOfBirth,
      timeZone: this.timeZone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
      maxSession: this.maxSession,
    };
  }

  // Deep copy
  public deepCopy(): User {
    return User.fromRecord(this.toRecord());
  }
}
/**
 *
 *
 * User setting
 */
export class UserSetting implements Network<UserSetting> {
  id: number;
  userIdentifier: string;
  isDarkMode: boolean;
  numberOfColumns: string;
  showNumberOfBookmarkInTab: boolean;
  showNumberOfBookmarkInCategory: boolean;
  showTagsInTooltip: boolean;
  showNoteInTooltip: boolean;
  allowDragDropToMoveLink: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    userIdentifier: string,
    isDarkMode: boolean,
    numberOfColumns: string,
    showNumberOfBookmarkInTab: boolean,
    showNumberOfBookmarkInCategory: boolean,
    showTagsInTooltip: boolean,
    showNoteInTooltip: boolean,
    allowDragDropToMoveLink: boolean,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.userIdentifier = userIdentifier;
    this.isDarkMode = isDarkMode;
    this.numberOfColumns = numberOfColumns;
    this.showNumberOfBookmarkInTab = showNumberOfBookmarkInTab;
    this.showNumberOfBookmarkInCategory = showNumberOfBookmarkInCategory;
    this.showTagsInTooltip = showTagsInTooltip;
    this.showNoteInTooltip = showNoteInTooltip;
    this.allowDragDropToMoveLink = allowDragDropToMoveLink;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * from Json
   */
  public static fromJson(jsonString: string): UserSetting {
    const json = JSON.parse(jsonString);

    const parsedId = JsonParser.parseStrict<number>(json, "id", "int");
    const parsedUserIdentifier = JsonParser.parseStrict<string>(json, "userIdentifier", "string");
    const parsedIsDarkMode = JsonParser.parseStrict<boolean>(json, "isDarkMode", "boolean");
    const parsedNumberOfColumns = JsonParser.parseStrict<string>(json, "numberOfColumns", "string");
    const parsedShowNumberOfBookmarkInTab = JsonParser.parseStrict<boolean>(json, "showNumberOfBookmarkInTab", "boolean");
    const parsedShowNumberOfBookmarkInCategory = JsonParser.parseStrict<boolean>(json, "showNumberOfBookmarkInCategory", "boolean");
    const parsedShowTagsInTooltip = JsonParser.parseStrict<boolean>(json, "showTagsInTooltip", "boolean");
    const parsedShowNoteInTooltip = JsonParser.parseStrict<boolean>(json, "showNoteInTooltip", "boolean");
    const parsedAllowDragDropToMoveLink = JsonParser.parseStrict<boolean>(json, "allowDragDropToMoveLink", "boolean");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(json, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(json, "updatedAt", "datetime");

    return new UserSetting(
      parsedId,
      parsedUserIdentifier,
      parsedIsDarkMode,
      parsedNumberOfColumns,
      parsedShowNumberOfBookmarkInTab,
      parsedShowNumberOfBookmarkInCategory,
      parsedShowTagsInTooltip,
      parsedShowNoteInTooltip,
      parsedAllowDragDropToMoveLink,
      parsedCreatedAt,
      parsedUpdatedAt
    );
  }

  public static fromRecord(record: any) {
    const parsedId = JsonParser.parseStrict<number>(record, "id", "int");
    const parsedUserIdentifier = JsonParser.parseStrict<string>(record, "userIdentifier", "string");
    const parsedIsDarkMode = JsonParser.parseStrict<boolean>(record, "isDarkMode", "boolean");
    const parsedNumberOfColumns = JsonParser.parseStrict<string>(record, "numberOfColumns", "string");
    const parsedShowNumberOfBookmarkInTab = JsonParser.parseStrict<boolean>(record, "showNumberOfBookmarkInTab", "boolean");
    const parsedShowNumberOfBookmarkInCategory = JsonParser.parseStrict<boolean>(record, "showNumberOfBookmarkInCategory", "boolean");
    const parsedShowTagsInTooltip = JsonParser.parseStrict<boolean>(record, "showTagsInTooltip", "boolean");
    const parsedShowNoteInTooltip = JsonParser.parseStrict<boolean>(record, "showNoteInTooltip", "boolean");
    const parsedAllowDragDropToMoveLink = JsonParser.parseStrict<boolean>(record, "allowDragDropToMoveLink", "boolean");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(record, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(record, "updatedAt", "datetime");

    return new UserSetting(
      parsedId,
      parsedUserIdentifier,
      parsedIsDarkMode,
      parsedNumberOfColumns,
      parsedShowNumberOfBookmarkInTab,
      parsedShowNumberOfBookmarkInCategory,
      parsedShowTagsInTooltip,
      parsedShowNoteInTooltip,
      parsedAllowDragDropToMoveLink,
      parsedCreatedAt,
      parsedUpdatedAt
    );
  }

  public toJson(): string {
    const jsonParsable = {
      id: this.id,
      userIdentifier: this.userIdentifier,
      isDarkMode: this.isDarkMode,
      numberOfColumns: this.numberOfColumns,
      showNumberOfBookmarkInTab: this.showNumberOfBookmarkInTab,
      showNumberOfBookmarkInCategory: this.showNumberOfBookmarkInCategory,
      showTagsInTooltip: this.showTagsInTooltip,
      showNoteInTooltip: this.showNoteInTooltip,
      allowDragDropToMoveLink: this.allowDragDropToMoveLink,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    return JSON.stringify(jsonParsable);
  }

  toRecord() {
    return {
      id: this.id,
      userIdentifier: this.userIdentifier,
      isDarkMode: this.isDarkMode,
      numberOfColumns: this.numberOfColumns,
      showNumberOfBookmarkInTab: this.showNumberOfBookmarkInTab,
      showNumberOfBookmarkInCategory: this.showNumberOfBookmarkInCategory,
      showTagsInTooltip: this.showTagsInTooltip,
      showNoteInTooltip: this.showNoteInTooltip,
      allowDragDropToMoveLink: this.allowDragDropToMoveLink,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * deep copy
   */
  public deepCopy(): UserSetting {
    return UserSetting.fromRecord(this.toRecord());
  }
}

/**
 *
 * User's tab
 */
/**
 */

export class UserTab implements Network<UserTab> {
  id: number;
  identifier: string;
  userIdentifier: string;
  name: string;
  color: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  // default property
  public linkCount: number = 0;
  public canShowLinkCount: boolean = false;

  constructor(id: number, identifier: string, userIdentifier: string, name: string, color: string | null, order: number, createdAt: Date, updatedAt: Date, isDeleted: boolean) {
    this.id = id;
    this.identifier = identifier;
    this.userIdentifier = userIdentifier;
    this.name = name;
    this.color = color;
    this.order = order;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
  }

  public static fromJson(jsonString: string): UserTab {
    const json = JSON.parse(jsonString);

    const parsedId = JsonParser.parseStrict<number>(json, "id", "int");
    const parsedIdentifier = JsonParser.parseStrict<string>(json, "identifier", "string");
    const parsedUserIdentifier = JsonParser.parseStrict<string>(json, "userIdentifier", "string");
    const parsedName = JsonParser.parseStrict<string>(json, "name", "string");
    const parsedColor = JsonParser.parse<string>(json, "color", "string");
    const parsedOrder = JsonParser.parseStrict<number>(json, "order", "int");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(json, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(json, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(json, "isDeleted", "boolean");

    return new UserTab(parsedId, parsedIdentifier, parsedUserIdentifier, parsedName, parsedColor, parsedOrder, parsedCreatedAt, parsedUpdatedAt, parsedIsDeleted);
  }

  public static fromRecord(record: any): UserTab {
    const parsedId = JsonParser.parseStrict<number>(record, "id", "int");
    const parsedIdentifier = JsonParser.parseStrict<string>(record, "identifier", "string");
    const parsedUserIdentifier = JsonParser.parseStrict<string>(record, "userIdentifier", "string");
    const parsedName = JsonParser.parseStrict<string>(record, "name", "string");
    const parsedColor = JsonParser.parse<string>(record, "color", "string");
    const parsedOrder = JsonParser.parseStrict<number>(record, "order", "int");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(record, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(record, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(record, "isDeleted", "boolean");

    return new UserTab(parsedId, parsedIdentifier, parsedUserIdentifier, parsedName, parsedColor, parsedOrder, parsedCreatedAt, parsedUpdatedAt, parsedIsDeleted);
  }

  public toJson(): string {
    const jsonParsable = {
      id: this.id,
      identifier: this.identifier,
      userIdentifier: this.userIdentifier,
      name: this.name,
      color: this.color,
      order: this.order,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
    };

    return JSON.stringify(jsonParsable);
  }

  toRecord() {
    return {
      id: this.id,
      identifier: this.identifier,
      userIdentifier: this.userIdentifier,
      name: this.name,
      color: this.color,
      order: this.order,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
    };
  }

  public deepCopy(): UserTab {
    return UserTab.fromRecord(this.toRecord());
  }
}
/**
 *
 * Tab's category
 *
 */
export class TabCategory implements Network<TabCategory> {
  id: number;
  identifier: string;
  name: string;
  order: number;
  color: string | null;
  icon: string | null;
  tabIdentifier: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  // default property
  public tab: UserTab | null = null;
  public linkCount: number = 0;
  public canShowLinkCount: boolean = false;
  public canShowTagInTooltip: boolean = false;
  public canShowNoteInTooltip: boolean = false;

  constructor(
    id: number,
    identifier: string,
    name: string,
    order: number,
    color: string | null,
    icon: string | null,
    tabIdentifier: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean
  ) {
    this.id = id;
    this.identifier = identifier;
    this.name = name;
    this.order = order;
    this.color = color;
    this.icon = icon;
    this.tabIdentifier = tabIdentifier;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
  }

  public static fromJson(jsonString: string): TabCategory {
    const json = JSON.parse(jsonString);

    const parsedId = JsonParser.parseStrict<number>(json, "id", "int");
    const parsedIdentifier = JsonParser.parseStrict<string>(json, "identifier", "string");
    const parsedName = JsonParser.parseStrict<string>(json, "name", "string");
    const parsedOrder = JsonParser.parseStrict<number>(json, "order", "int");
    const parsedColor = JsonParser.parse<string>(json, "color", "string");
    const parsedIcon = JsonParser.parse<string>(json, "icon", "string");
    const parsedTabIdentifier = JsonParser.parseStrict<string>(json, "tabIdentifier", "string");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(json, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(json, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(json, "isDeleted", "boolean");

    return new TabCategory(parsedId, parsedIdentifier, parsedName, parsedOrder, parsedColor, parsedIcon, parsedTabIdentifier, parsedCreatedAt, parsedUpdatedAt, parsedIsDeleted);
  }

  public static fromRecord(record: any): TabCategory {
    const parsedId = JsonParser.parseStrict<number>(record, "id", "int");
    const parsedIdentifier = JsonParser.parseStrict<string>(record, "identifier", "string");
    const parsedName = JsonParser.parseStrict<string>(record, "name", "string");
    const parsedOrder = JsonParser.parseStrict<number>(record, "order", "int");
    const parsedColor = JsonParser.parse<string>(record, "color", "string");
    const parsedIcon = JsonParser.parse<string>(record, "icon", "string");
    const parsedTabIdentifier = JsonParser.parseStrict<string>(record, "tabIdentifier", "string");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(record, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(record, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(record, "isDeleted", "boolean");

    return new TabCategory(parsedId, parsedIdentifier, parsedName, parsedOrder, parsedColor, parsedIcon, parsedTabIdentifier, parsedCreatedAt, parsedUpdatedAt, parsedIsDeleted);
  }

  public toJson(): string {
    const jsonParsable = {
      id: this.id,
      identifier: this.identifier,
      name: this.name,
      order: this.order,
      color: this.color,
      icon: this.icon,
      tabIdentifier: this.tabIdentifier,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
    };

    return JSON.stringify(jsonParsable);
  }

  toRecord() {
    return {
      id: this.id,
      identifier: this.identifier,
      name: this.name,
      order: this.order,
      color: this.color,
      icon: this.icon,
      tabIdentifier: this.tabIdentifier,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
    };
  }

  public deepCopy(): TabCategory {
    return TabCategory.fromRecord(this.toRecord());
  }
}
/**
 *
 * Tag
 */
export class Tag implements Network<Tag> {
  id: number;
  identifier: string;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  constructor(id: number, identifier: string, name: string, order: number, createdAt: Date, updatedAt: Date, isDeleted: boolean) {
    this.id = id;
    this.identifier = identifier;
    this.name = name;
    this.order = order;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
  }

  public static fromJson(jsonString: string): Tag {
    const json = JSON.parse(jsonString);

    const parsedId = JsonParser.parseStrict<number>(json, "id", "int");
    const parsedIdentifier = JsonParser.parseStrict<string>(json, "identifier", "string");
    const parsedName = JsonParser.parseStrict<string>(json, "name", "string");
    const parsedOrder = JsonParser.parseStrict<number>(json, "order", "int");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(json, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(json, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(json, "isDeleted", "boolean");

    return new Tag(parsedId, parsedIdentifier, parsedName, parsedOrder, parsedCreatedAt, parsedUpdatedAt, parsedIsDeleted);
  }

  public static fromRecord(record: any): Tag {
    const parsedId = JsonParser.parseStrict<number>(record, "id", "int");
    const parsedIdentifier = JsonParser.parseStrict<string>(record, "identifier", "string");
    const parsedName = JsonParser.parseStrict<string>(record, "name", "string");
    const parsedOrder = JsonParser.parseStrict<number>(record, "order", "int");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(record, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(record, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(record, "isDeleted", "boolean");

    return new Tag(parsedId, parsedIdentifier, parsedName, parsedOrder, parsedCreatedAt, parsedUpdatedAt, parsedIsDeleted);
  }

  public toJson(): string {
    const jsonParsable = {
      id: this.id,
      identifier: this.identifier,
      name: this.name,
      order: this.order,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
    };

    return JSON.stringify(jsonParsable);
  }

  toRecord() {
    return {
      id: this.id,
      identifier: this.identifier,
      name: this.name,
      order: this.order,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
    };
  }

  public deepCopy(): Tag {
    return Tag.fromRecord(this.toRecord());
  }
}

/**
 *
 * Link Tag
 */

export class LinkTag implements Network<LinkTag> {
  id: number;
  linkIdentifier: string;
  tagIdentifier: string;
  createdAt: Date;
  updatedAt: Date;
  tag: Tag;

  constructor(id: number, linkIdentifier: string, tagIdentifier: string, createdAt: Date, updatedAt: Date, tag: Tag) {
    this.id = id;
    this.linkIdentifier = linkIdentifier;
    this.tagIdentifier = tagIdentifier;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.tag = tag;
  }

  public static fromJson(jsonString: string): LinkTag {
    const json = JSON.parse(jsonString);

    const parsedId = JsonParser.parseStrict<number>(json, "id", "int");
    const parsedLinkIdentifier = JsonParser.parseStrict<string>(json, "linkIdentifier", "string");
    const parsedTagIdentifier = JsonParser.parseStrict<string>(json, "tagIdentifier", "string");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(json, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(json, "updatedAt", "datetime");
    const parsedTag = Tag.fromRecord(json["tag"]);

    return new LinkTag(parsedId, parsedLinkIdentifier, parsedTagIdentifier, parsedCreatedAt, parsedUpdatedAt, parsedTag);
  }

  public static fromRecord(record: any): LinkTag {
    const parsedId = JsonParser.parseStrict<number>(record, "id", "int");
    const parsedLinkIdentifier = JsonParser.parseStrict<string>(record, "linkIdentifier", "string");
    const parsedTagIdentifier = JsonParser.parseStrict<string>(record, "tagIdentifier", "string");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(record, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(record, "updatedAt", "datetime");
    const parsedTag = Tag.fromRecord(record["tag"]);

    return new LinkTag(parsedId, parsedLinkIdentifier, parsedTagIdentifier, parsedCreatedAt, parsedUpdatedAt, parsedTag);
  }

  public toJson(): string {
    const jsonParsable = {
      id: this.id,
      linkIdentifier: this.linkIdentifier,
      tagIdentifier: this.tagIdentifier,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      tag: this.tag,
    };

    return JSON.stringify(jsonParsable);
  }

  public toRecord() {
    return {
      id: this.id,
      linkIdentifier: this.linkIdentifier,
      tagIdentifier: this.tagIdentifier,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      tag: this.tag,
    };
  }

  public deepCopy(): LinkTag {
    return LinkTag.fromRecord(this.toRecord());
  }
}

/**
 *
 * Link
 */

export class Link implements Network<Link> {
  id: number;
  identifier: string;
  title: string | null;
  url: string;
  order: number;
  icon: string | null;
  notes: string | null;
  color: string | null;
  categoryIdentifier: string | null;
  userIdentifier: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  tags: string[];

  selected: boolean = false;
  tab: UserTab | null= null;
  category: TabCategory | null = null;

  constructor(
    id: number,
    identifier: string,
    title: string | null,
    url: string,
    order: number,
    icon: string | null,
    notes: string | null,
    color: string | null,
    categoryIdentifier: string | null,
    userIdentifier: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean,
    tags: string[]
  ) {
    this.id = id;
    this.identifier = identifier;
    this.title = title;
    this.url = url;
    this.order = order;
    this.icon = icon;
    this.notes = notes;
    this.color = color;
    this.categoryIdentifier = categoryIdentifier;
    this.userIdentifier = userIdentifier;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
    this.tags = tags;
  }

  public static fromJson(jsonString: string): Link {
    const json = JSON.parse(jsonString);

    const parsedId = JsonParser.parseStrict<number>(json, "id", "int");
    const parsedIdentifier = JsonParser.parseStrict<string>(json, "identifier", "string");
    const parsedTitle = JsonParser.parse<string>(json, "title", "string");
    const parsedUrl = JsonParser.parseStrict<string>(json, "url", "string");
    const parsedOrder = JsonParser.parseStrict<number>(json, "order", "int");
    const parsedIcon = JsonParser.parse<string>(json, "icon", "string");
    const parsedNotes = JsonParser.parse<string>(json, "notes", "string");
    const parsedColor = JsonParser.parse<string>(json, "color", "string");
    const parsedCategoryIdentifier = JsonParser.parse<string>(json, "categoryIdentifier", "string");
    const parsedUserIdentifier = JsonParser.parseStrict<string>(json, "userIdentifier", "string");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(json, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(json, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(json, "isDeleted", "boolean");
    const parsedLinkTags = (json["tags"] as Array<any>).map((p) => String(p));

    return new Link(
      parsedId,
      parsedIdentifier,
      parsedTitle,
      parsedUrl,
      parsedOrder,
      parsedIcon,
      parsedNotes,
      parsedColor,
      parsedCategoryIdentifier,
      parsedUserIdentifier,
      parsedCreatedAt,
      parsedUpdatedAt,
      parsedIsDeleted,
      parsedLinkTags
    );
  }

  // From record
  public static fromRecord(record: any): Link {
    const parsedId = JsonParser.parseStrict<number>(record, "id", "int");
    const parsedIdentifier = JsonParser.parseStrict<string>(record, "identifier", "string");
    const parsedTitle = JsonParser.parse<string>(record, "title", "string");
    const parsedUrl = JsonParser.parseStrict<string>(record, "url", "string");
    const parsedOrder = JsonParser.parseStrict<number>(record, "order", "int");
    const parsedIcon = JsonParser.parse<string>(record, "icon", "string");
    const parsedNotes = JsonParser.parse<string>(record, "notes", "string");
    const parsedColor = JsonParser.parse<string>(record, "color", "string");
    const parsedCategoryIdentifier = JsonParser.parse<string>(record, "categoryIdentifier", "string");
    const parsedUserIdentifier = JsonParser.parseStrict<string>(record, "userIdentifier", "string");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(record, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(record, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(record, "isDeleted", "boolean");
    const parsedLinkTags = (record["tags"] as Array<any>).map((p) => String(p));

    const link = new Link(
      parsedId,
      parsedIdentifier,
      parsedTitle,
      parsedUrl,
      parsedOrder,
      parsedIcon,
      parsedNotes,
      parsedColor,
      parsedCategoryIdentifier,
      parsedUserIdentifier,
      parsedCreatedAt,
      parsedUpdatedAt,
      parsedIsDeleted,
      parsedLinkTags
    );

    return link;
  }

  public toJson(): string {
    const jsonParsable = {
      id: this.id,
      identifier: this.identifier,
      title: this.title,
      url: this.url,
      order: this.order,
      icon: this.icon,
      notes: this.notes,
      color: this.color,
      categoryIdentifier: this.categoryIdentifier,
      userIdentifier: this.userIdentifier,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
      tags: this.tags,
    };

    return JSON.stringify(jsonParsable);
  }

  public toRecord(): any {
    const jsonParsable = {
      id: this.id,
      identifier: this.identifier,
      title: this.title,
      url: this.url,
      order: this.order,
      icon: this.icon,
      notes: this.notes,
      color: this.color,
      categoryIdentifier: this.categoryIdentifier,
      userIdentifier: this.userIdentifier,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
      tags: this.tags,
    };

    return jsonParsable;
  }

  public deepCopy(): Link {
    return Link.fromRecord(this.toRecord());
  }
}

/**
 *
 *
 * Task Tracker
 */
export enum TaskManagerStatus {
  Initial = "initial",
  Success = "success",
  Error = "error",
  Uploading = "uploading",
  Processing = "processing",
}

export namespace TaskManagerStatus {
  // From key
  export function fromKey(key: string): TaskManagerStatus {
    switch (key) {
      case "initial":
        return TaskManagerStatus.Initial;
      case "success":
        return TaskManagerStatus.Success;
      case "error":
        return TaskManagerStatus.Error;
      case "uploading":
        return TaskManagerStatus.Uploading;
      case "processing":
        return TaskManagerStatus.Processing;
      default:
        return TaskManagerStatus.Initial;
    }
  }

  /**
   * Get the key of a TaskManagerStatus enum value
   * @param status - The TaskManagerStatus value
   * @returns The key of the TaskManagerStatus value
   */
  export function getKey(status: TaskManagerStatus): string {
    switch (status) {
      case TaskManagerStatus.Initial:
        return "initial";
      case TaskManagerStatus.Success:
        return "success";
      case TaskManagerStatus.Error:
        return "error";
      case TaskManagerStatus.Uploading:
        return "uploading";
      case TaskManagerStatus.Processing:
        return "processing";
      default:
        return "initial";
    }
  }
}
/**
 *
 *
 */
export class TaskTracker implements Network<TaskTracker> {
  id: number;
  userIdentifier: string;
  identifier: string;
  status: TaskManagerStatus;
  message: string;
  error: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  constructor(
    id: number,
    userIdentifier: string,
    identifier: string,
    status: TaskManagerStatus,
    message: string,
    error: string,
    progress: number,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean
  ) {
    this.id = id;
    this.userIdentifier = userIdentifier;
    this.identifier = identifier;
    this.status = status;
    this.message = message;
    this.error = error;
    this.progress = progress;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
  }

  public static fromRecord(record: any): TaskTracker {
    const parsedId = JsonParser.parseStrict<number>(record, "id", "int");
    const parsedUserIdentifier = JsonParser.parseStrict<string>(record, "userIdentifier", "string");
    const parsedIdentifier = JsonParser.parseStrict<string>(record, "identifier", "string");
    const parsedStatus = TaskManagerStatus.fromKey(JsonParser.parseStrict<string>(record, "status", "string"));
    const parsedMessage = JsonParser.parseStrict<string>(record, "message", "string");
    const parsedError = JsonParser.parseStrict<string>(record, "error", "string");
    const parsedProgress = JsonParser.parseStrict<number>(record, "progress", "float");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(record, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(record, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(record, "isDeleted", "boolean");

    return new TaskTracker(
      parsedId,
      parsedUserIdentifier,
      parsedIdentifier,
      parsedStatus,
      parsedMessage,
      parsedError,
      parsedProgress,
      parsedCreatedAt,
      parsedUpdatedAt,
      parsedIsDeleted
    );
  }

  public static fromJson(json: string): TaskTracker {
    return TaskTracker.fromRecord(JSON.parse(json));
  }

  public toJson(): string {
    return JSON.stringify(this.toRecord());
  }

  public toRecord(): any {
    return {
      id: this.id,
      userIdentifier: this.userIdentifier,
      identifier: this.identifier,
      status: TaskManagerStatus.getKey(this.status),
      message: this.message,
      error: this.error,
      progress: this.progress,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
    };
  }

  public deepCopy(): TaskTracker {
    return TaskTracker.fromRecord(this.toRecord());
  }
}

/**
 *
 *
 * Subscription
 */
export class SubscriptionStatus implements Network<SubscriptionStatus> {
  isActive: boolean;
  subscriptionId: string;
  sessionId: string;

  constructor(isActive: boolean, subscriptionId: string, sessionId: string) {
    this.isActive = isActive;
    this.subscriptionId = subscriptionId;
    this.sessionId = sessionId;
  }

  public static fromJson(json: string): SubscriptionStatus {
    return SubscriptionStatus.fromRecord(JSON.parse(json));
  }

  public toJson(): string {
    return JSON.stringify(this.toRecord());
  }

  public static fromRecord(record: any): SubscriptionStatus {
    const parsedIsActive = JsonParser.parseStrict<boolean>(record, "isActive", "boolean");
    const parsedSubscriptionId = JsonParser.parseStrict<string>(record, "subscriptionId", "string");
    const parsedSessionId = JsonParser.parseStrict<string>(record, "sessionId", "string");

    return new SubscriptionStatus(parsedIsActive, parsedSubscriptionId, parsedSessionId);
  }

  public toRecord(): any {
    return {
      isActive: this.isActive,
      subscriptionId: this.subscriptionId,
      sessionId: this.sessionId,
    };
  }

  public deepCopy(): SubscriptionStatus {
    return SubscriptionStatus.fromRecord(this.toRecord());
  }
}
/**
 *
 *
 *
 */
export enum ESubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  FREE_TRIAL = "FREE_TRIAL",
}
