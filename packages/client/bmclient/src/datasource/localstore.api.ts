import localForage from "localforage";
import { Subject } from "rxjs";
import { singleCall } from "./http/http.manager";
import { NetworkApi } from "./network.api";
import { NetworkMediaApi } from "./network.media.api";
import { MutationModelData, MutationModelIdentifier, MutationType, TaskData, TaskDataIdentifier, TaskManagerStatus, TaskTracker, TaskTrackerData } from "./schema";
import { MutationModel } from "./utils";

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
/**
 *
 *
 *
 * Tasks Progress Tracker
 */
export class TaskProgressTracker {
  private static instance: TaskProgressTracker;
  private source: Map<string, Subject<TaskTrackerData>> = new Map(); // Task UUID -> Subject
  private task: Map<string, TaskTrackerData> = new Map();
  private timer: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance() {
    if (!TaskProgressTracker.instance) {
      TaskProgressTracker.instance = new TaskProgressTracker();
    }
    return TaskProgressTracker.instance;
  }

  /**
   * Start long pulling
   */
  private async start() {
    if (this.timer !== null) return;
    this.timer = setInterval(async () => {
      await this.check();
    }, 1000);
  }

  /**
   *
   * Boot up
   */
  public bootUp() {
    return this.start();
  }

  private async check() {
    try {
      const taskResponse = await singleCall(new NetworkApi().getTaskProgressTracker());
      console.log(taskResponse, "HHH");
      if (taskResponse.status === 200) {
        const { data } = taskResponse as { data: TaskTracker[] };
        // If all tasks are complete, stop checking
        const isAllComplete = data.every((task) => {
          if (task.status === TaskManagerStatus.Success || task.status === TaskManagerStatus.Error) {
            return true;
          } else {
            return false;
          }
        });

        const allSuccess = data.filter((task) => {
          if (task.status === TaskManagerStatus.Success) {
            return true;
          } else {
            return false;
          }
        });

        const allError = data.filter((task) => {
          if (task.status === TaskManagerStatus.Error) {
            return true;
          } else {
            return false;
          }
        });

        // Delete all success and error tasks
        await Promise.all(
          allSuccess.map((task) => {
            return singleCall(new NetworkApi().deleteTask(task.identifier));
          })
        );

        await Promise.all(
          allError.map((task) => {
            return singleCall(new NetworkApi().deleteTask(task.identifier));
          })
        );

        if (isAllComplete || data.length === 0) {
          if (this.timer) {
            clearInterval(this.timer!);
            this.timer = null;
          }
        }

        data.forEach((task) => {
          const taskData: TaskTrackerData = new TaskTrackerData(task.status, task.message, task.error, task.progress);
          this.emit(task.identifier, taskData);
        });
      } else {
        if (this.timer) {
          clearInterval(this.timer!);
          this.timer = null;
        }
      }
    } catch (error) {
      if (this.timer) {
        clearInterval(this.timer!);
        this.timer = null;
      }
    }
  }

  /**
   *
   * Get task subject
   */
  private getSubject(taskUUID: string) {
    if (!this.source.has(taskUUID)) {
      this.source.set(taskUUID, new Subject<TaskTrackerData>());
    }
    return this.source.get(taskUUID)!;
  }

  /**
   *
   * Get task
   */
  private getTask(taskUUID: string) {
    if (!this.task.has(taskUUID)) {
      this.task.set(taskUUID, new TaskTrackerData(TaskManagerStatus.Initial, null, null, 0));
    }

    return this.task.get(taskUUID)!;
  }

  /**
   *
   * Emit task
   */
  private emit(taskUUID: string, data: TaskTrackerData) {
    this.task.set(taskUUID, data);
    const oldSubject = this.getSubject(taskUUID);
    oldSubject.next(data);

    // If the status is success and message is URL like ( contains more than one / )
    // Then automatically open the URL in download mode
    if (data.status === TaskManagerStatus.Success && data.message && data.message.includes("/")) {
      window.open(new NetworkMediaApi().getMediaAbsolutePath(data.message), "_blank");
    }

    // If the status is ok
    // If message contain bookmark and import
    // Then refresh catalog
    if (data.status === TaskManagerStatus.Success && data.message === "Bookmark imported successfully") {
      console.log("YES");
      MutationModel.getInstance().dispatch(new MutationModelData(MutationModelIdentifier.CATALOG, {}, MutationType.CREATE_MANY));
    }
  }

  /**
   *
   * Listen to task
   */
  public listen(taskUUID: string) {
    return this.getSubject(taskUUID).asObservable();
  }

  /**
   *
   * Set task
   */
  public setTask(task: TaskData) {
    this.start();
    const { identifier, taskUUID, data } = task;

    // Check for the same task
    const oldTask = this.getTask(taskUUID);
    if (!(oldTask.status === TaskManagerStatus.Initial || oldTask.status === TaskManagerStatus.Error)) {
      return;
    }

    switch (identifier) {
      case TaskDataIdentifier.IMPORT_BOOKMARK:
        console.log(identifier, taskUUID, data);
        singleCall(new NetworkMediaApi().uploadImportBookmark(data.file, taskUUID, data.tags)).then(() => {
          const newTask = new TaskTrackerData(TaskManagerStatus.Uploading, null, null, 100);
          this.emit(taskUUID, newTask);
        });

        break;

      case TaskDataIdentifier.EXPORT_BOOKMARK:
        singleCall(new NetworkMediaApi().exportBookmark(taskUUID)).then(() => {
          const newTask = new TaskTrackerData(TaskManagerStatus.Uploading, null, null, 100);
          this.emit(taskUUID, newTask);
        });

        break;
    }
  }
}
