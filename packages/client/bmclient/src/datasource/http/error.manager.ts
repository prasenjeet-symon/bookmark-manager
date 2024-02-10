import { Subject } from "rxjs";

export class ErrorManager {
  private static instance: ErrorManager;
  private errorMessage: Subject<string> = new Subject();

  public get observable() {
    return this.errorMessage;
  }

  private constructor() {}

  public static getInstance() {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }
    return ErrorManager.instance;
  }

  public dispatch(error: string) {
    this.errorMessage.next(error);
  }

  public dispose() {
    this.errorMessage.complete();
  }
}
