import { JsonParser, Network } from "./utils";

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

  static fromJson(json: any): User {
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

  // Deep copy
  public deepCopy(): User {
    return User.fromJson(this.toJson());
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
  public static fromJson(json: any): UserSetting {
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

  /**
   * deep copy
   */
  public deepCopy(): UserSetting {
    return UserSetting.fromJson(this.toJson());
  }
}

/**
 *
 * User's tab
 */
/**
 *  {
        "id": 1,
        "identifier": "77803157-7baf-405a-b022-d6a71967ed9a",
        "userIdentifier": "109dfb0d-af1f-4de1-bcd5-a7d13d2f96a6",
        "name": "Tab One",
        "order": 1,
        "createdAt": "2024-01-30T15:33:31.785Z",
        "updatedAt": "2024-01-30T15:33:31.785Z",
        "isDeleted": false
    }
 */

export class UserTab implements Network<UserTab> {
  id: number;
  identifier: string;
  userIdentifier: string;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  constructor(id: number, identifier: string, userIdentifier: string, name: string, order: number, createdAt: Date, updatedAt: Date, isDeleted: boolean) {
    this.id = id;
    this.identifier = identifier;
    this.userIdentifier = userIdentifier;
    this.name = name;
    this.order = order;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
  }

  public static fromJson(json: any): UserTab {
    const parsedId = JsonParser.parseStrict<number>(json, "id", "int");
    const parsedIdentifier = JsonParser.parseStrict<string>(json, "identifier", "string");
    const parsedUserIdentifier = JsonParser.parseStrict<string>(json, "userIdentifier", "string");
    const parsedName = JsonParser.parseStrict<string>(json, "name", "string");
    const parsedOrder = JsonParser.parseStrict<number>(json, "order", "int");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(json, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(json, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(json, "isDeleted", "boolean");

    return new UserTab(parsedId, parsedIdentifier, parsedUserIdentifier, parsedName, parsedOrder, parsedCreatedAt, parsedUpdatedAt, parsedIsDeleted);
  }

  public toJson(): string {
    const jsonParsable = {
      id: this.id,
      identifier: this.identifier,
      userIdentifier: this.userIdentifier,
      name: this.name,
      order: this.order,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
    };

    return JSON.stringify(jsonParsable);
  }

  public deepCopy(): UserTab {
    return UserTab.fromJson(this.toJson());
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

  public static fromJson(json: any): TabCategory {
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

  public deepCopy(): TabCategory {
    return TabCategory.fromJson(JSON.parse(this.toJson()));
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

  public static fromJson(json: any): Tag {
    const parsedId = JsonParser.parseStrict<number>(json, "id", "int");
    const parsedIdentifier = JsonParser.parseStrict<string>(json, "identifier", "string");
    const parsedName = JsonParser.parseStrict<string>(json, "name", "string");
    const parsedOrder = JsonParser.parseStrict<number>(json, "order", "int");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(json, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(json, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(json, "isDeleted", "boolean");

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

  public deepCopy(): Tag {
    return Tag.fromJson(JSON.parse(this.toJson()));
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

  public static fromJson(json: any): LinkTag {
    const parsedId = JsonParser.parseStrict<number>(json, "id", "int");
    const parsedLinkIdentifier = JsonParser.parseStrict<string>(json, "linkIdentifier", "string");
    const parsedTagIdentifier = JsonParser.parseStrict<string>(json, "tagIdentifier", "string");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(json, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(json, "updatedAt", "datetime");
    const parsedTag = Tag.fromJson(json["tag"]);

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

  public deepCopy(): LinkTag {
    return LinkTag.fromJson(JSON.parse(this.toJson()));
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
  categoryIdentifier: string;
  userIdentifier: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  linkTags: LinkTag[];

  constructor(
    id: number,
    identifier: string,
    title: string | null,
    url: string,
    order: number,
    icon: string | null,
    notes: string | null,
    categoryIdentifier: string,
    userIdentifier: string,
    createdAt: Date,
    updatedAt: Date,
    isDeleted: boolean,
    linkTags: LinkTag[]
  ) {
    this.id = id;
    this.identifier = identifier;
    this.title = title;
    this.url = url;
    this.order = order;
    this.icon = icon;
    this.notes = notes;
    this.categoryIdentifier = categoryIdentifier;
    this.userIdentifier = userIdentifier;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
    this.linkTags = linkTags;
  }

  public static fromJson(json: any): Link {
    const parsedId = JsonParser.parseStrict<number>(json, "id", "int");
    const parsedIdentifier = JsonParser.parseStrict<string>(json, "identifier", "string");
    const parsedTitle = JsonParser.parseStrict<string | null>(json, "title", "string");
    const parsedUrl = JsonParser.parseStrict<string>(json, "url", "string");
    const parsedOrder = JsonParser.parseStrict<number>(json, "order", "int");
    const parsedIcon = JsonParser.parse<string>(json, "icon", "string");
    const parsedNotes = JsonParser.parse<string>(json, "notes", "string");
    const parsedCategoryIdentifier = JsonParser.parseStrict<string>(json, "categoryIdentifier", "string");
    const parsedUserIdentifier = JsonParser.parseStrict<string>(json, "userIdentifier", "string");
    const parsedCreatedAt = JsonParser.parseStrict<Date>(json, "createdAt", "datetime");
    const parsedUpdatedAt = JsonParser.parseStrict<Date>(json, "updatedAt", "datetime");
    const parsedIsDeleted = JsonParser.parseStrict<boolean>(json, "isDeleted", "boolean");
    const parsedLinkTags = (json["linkTags"] as Array<any>).map((item: any) => LinkTag.fromJson(item));

    return new Link(
      parsedId,
      parsedIdentifier,
      parsedTitle,
      parsedUrl,
      parsedOrder,
      parsedIcon,
      parsedNotes,
      parsedCategoryIdentifier,
      parsedUserIdentifier,
      parsedCreatedAt,
      parsedUpdatedAt,
      parsedIsDeleted,
      parsedLinkTags
    );
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
      categoryIdentifier: this.categoryIdentifier,
      userIdentifier: this.userIdentifier,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isDeleted: this.isDeleted,
      linkTags: this.linkTags,
    };

    return JSON.stringify(jsonParsable);
  }

  deepCopy(): Link {
    return Link.fromJson(JSON.parse(this.toJson()));
  }
}
