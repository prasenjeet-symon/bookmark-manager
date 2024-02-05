import { Subject } from "rxjs";

export class SuccessManager {
  private static instance: SuccessManager;
  private message: Subject<string> = new Subject();

  public get observable() {
    return this.message.asObservable();
  }

  private constructor() {}

  public static getInstance() {
    if (!SuccessManager.instance) {
      SuccessManager.instance = new SuccessManager();
    }
    return SuccessManager.instance;
  }

  public dispatch(message: string) {
    this.message.next(message);
  }

  public dispose() {
    this.message.complete();
  }
}
