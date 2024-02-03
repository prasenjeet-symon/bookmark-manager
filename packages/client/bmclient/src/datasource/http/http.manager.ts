import { BehaviorSubject, defer, mergeMap, Observable } from "rxjs";

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
  private static makeHttpRequest(token: string | null, url: string, options?: RequestInit): Observable<Response> {
    return defer(() => {
      const abortController = new AbortController();

      // Fetch operation with the AbortController signal
      const fetchObservable = new Observable<Response>((observer) => {
        fetch(url, { ...options, headers: { Authorization: `Bearer ${token}` }, signal: abortController.signal })
          .then((response) => {
            observer.next(response);
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
  public static request(url: string, options?: RequestInit): Observable<Response> {
    return ApplicationToken.getInstance().observable.pipe(
      mergeMap((token) => {
        return HttpManager.makeHttpRequest(token, url, options);
      })
    );
  }
}
