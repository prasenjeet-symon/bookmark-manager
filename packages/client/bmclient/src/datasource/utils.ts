import { Subject } from "rxjs";
import { MutationModelData } from "./schema";

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
