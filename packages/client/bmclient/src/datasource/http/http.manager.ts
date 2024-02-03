import { BehaviorSubject, defer, firstValueFrom, mergeMap, Observable } from "rxjs";
import { ApiResponse } from "../utils";

/**
 *
 *
 * Token manager
 */
export class ApplicationToken {
  private static instance: ApplicationToken;

  private token: string | null = null;
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public get observable() {
    return this.tokenSubject.asObservable();
  }

  private constructor() {}

  public static getInstance() {
    if (!ApplicationToken.instance) {
      ApplicationToken.instance = new ApplicationToken();
    }
    return ApplicationToken.instance;
  }

  /**
   *
   * Save token
   */
  public saveToken(token: string) {
    this.token = token;
    this.tokenSubject.next(token);
    localStorage.setItem("token", token);
  }

  /**
   *
   * Get token
   */
  public get getToken() {
    return this.token;
  }

  /**
   *
   * Delete token
   */
  public deleteToken() {
    this.token = null;
    this.tokenSubject.next(null);
    localStorage.removeItem("token");
  }

  /**
   *
   * Boot up and set token
   */
  public bootUp() {
    const token = localStorage.getItem("token");
    if (token) {
      this.token = token;
      this.tokenSubject.next(token);
    }
  }
}
/**
 *
 *
 * HTTP manager
 */
export class HttpManager {
  // Reusable function for making HTTP requests
  private static makeHttpRequest(token: string | null, url: string, options?: RequestInit): Observable<ApiResponse> {
    return defer(() => {
      const abortController = new AbortController();

      // Fetch operation with the AbortController signal
      const fetchObservable = new Observable<ApiResponse>((observer) => {
        fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, signal: abortController.signal })
          .then(async (response) => {
            const jsonData = await response.json();
            const statusCode = response.status;
            const statusText = response.statusText;

            return new ApiResponse(statusCode, jsonData, statusText);
          })
          .then((data) => {
            observer.next(data);
            observer.complete();
          })
          .catch((error) => observer.error(error));

        return () => {
          abortController.abort();
        };
      });

      return fetchObservable;
    });
  }

  /**
   *
   * Make http request
   */
  public static request(url: string, options?: RequestInit): Observable<ApiResponse> {
    return ApplicationToken.getInstance().observable.pipe(
      mergeMap((token) => {
        return HttpManager.makeHttpRequest(token, url, options);
      })
    );
  }
}
/**
 *
 *
 * Single call HTTP
 */
export async function singleCall(obs: Observable<ApiResponse>) {
  const result = await firstValueFrom(obs);
  const { status } = result;
  if (status !== 200) throw new Error("Failed to fetch data");
  return result;
}
