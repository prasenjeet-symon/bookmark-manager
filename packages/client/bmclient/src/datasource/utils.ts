/**
 *
 *
 * Mutation Manger
 */
export class MutationModel {
  private static instance: MutationModel;

  private constructor() {}

  public static getInstance() {
    if (!MutationModel.instance) {
      MutationModel.instance = new MutationModel();
    }
    return MutationModel.instance;
  }
}
