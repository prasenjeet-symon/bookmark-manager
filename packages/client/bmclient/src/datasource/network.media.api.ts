import { map, tap } from "rxjs";
import { ErrorManager } from "./http/error.manager";
import { HttpManager } from "./http/http.manager";
import { SuccessManager } from "./http/success.manager";
import { ApiMutationError, ApiMutationSuccess } from "./schema";
import { ApiResponse } from "./utils";

export class NetworkMediaApi {
  private baseUrlRoute = "http://localhost:8081/server";
  private importBookmarkRoute = `${this.baseUrlRoute}/api/import-bookmark`;
  private exportBookmarkRoute = `${this.baseUrlRoute}/api/export-bookmark`;

  public getMediaAbsolutePath(path: string) {
    return `${this.baseUrlRoute}/media${path}`;
  }

  /**
   *
   * Upload import bookmark file
   */
  public uploadImportBookmark(file: File, taskUUID: string, tags: string[]) {
    const formData = new FormData();
    formData.append("bookmarkFile", file);
    formData.append("taskUUID", taskUUID);
    formData.append("tags", JSON.stringify(tags));

    return HttpManager.requestFile(this.importBookmarkRoute, {
      method: "POST",
      body: formData,
    }).pipe(
      map((val) => {
        const { status, statusText, data } = val;
        if (status === 200) {
          const success = ApiMutationSuccess.fromJson(data);
          return new ApiResponse(status, success, statusText);
        } else {
          return val;
        }
      }),
      map((val) => {
        const { data, status, statusText } = val;
        if (status !== 200) {
          const error = ApiMutationError.fromJson(data);
          return new ApiResponse(status, error, statusText);
        } else {
          return val;
        }
      }),
      tap((val) => {
        const { data, status } = val;
        if (status === 200) {
          const responseData = data as ApiMutationSuccess;
          SuccessManager.getInstance().dispatch('Import started successfully');
        }
      }),
      tap((val) => {
        const { data, status } = val;
        if (status !== 200) {
          const responseData = data as ApiMutationError;
          ErrorManager.getInstance().dispatch(responseData.error);
        }
      })
    );
  }

  /**
   * Export bookmark
   */
  public exportBookmark(taskUUID: string) {
    console.log(taskUUID);
    return HttpManager.request(this.exportBookmarkRoute, {
      method: "POST",
      body: JSON.stringify({ taskUUID: taskUUID }),
    }).pipe(
      map((val) => {
        const { status, statusText, data } = val;
        if (status === 200) {
          const success = ApiMutationSuccess.fromJson(data);
          return new ApiResponse(status, success, statusText);
        } else {
          return val;
        }
      }),
      map((val) => {
        const { data, status, statusText } = val;
        if (status !== 200) {
          const error = ApiMutationError.fromJson(data);
          return new ApiResponse(status, error, statusText);
        } else {
          return val;
        }
      }),
      tap((val) => {
        const { data, status } = val;
        if (status === 200) {
          const responseData = data as ApiMutationSuccess;
          SuccessManager.getInstance().dispatch("Export started successfully");
        }
      }),
      tap((val) => {
        const { data, status } = val;
        if (status !== 200) {
          const responseData = data as ApiMutationError;
          ErrorManager.getInstance().dispatch(responseData.error);
        }
      })
    );
  }
}
