import { BehaviorSubject, defer, firstValueFrom, Observable, switchMap } from "rxjs";
import { NetworkApi } from "../network.api";
import { ApiMutationSuccess, ESubscriptionStatus, SubscriptionStatus } from "../schema";
import { ApiResponse } from "../utils";

/**
 *
 *
 * Subscription status
 */
export class Subscription {
  private static instance: Subscription;
  private _timer: any;

  private _subscription$: BehaviorSubject<SubscriptionStatus> = new BehaviorSubject<SubscriptionStatus>(new SubscriptionStatus(false, "", ""));
  private _freeTrial$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private _status$: BehaviorSubject<ESubscriptionStatus> = new BehaviorSubject<ESubscriptionStatus>(ESubscriptionStatus.FREE_TRIAL);

  // getter
  public get subscription$() {
    return this._subscription$.asObservable();
  }

  public get freeTrial$() {
    return this._freeTrial$.asObservable();
  }

  public get status$() {
    return this._status$.asObservable();
  }

  private constructor() {
    this.fetch();
  }

  public static getInstance() {
    if (!Subscription.instance) {
      Subscription.instance = new Subscription();
    }

    return Subscription.instance;
  }

  /**
   *
   * Fetch
   */
  private async fetch() {
    console.log("Fetch subscription status");
    const freeTrail = await singleCall(new NetworkApi().getFreeTrial());
    const subscription = await singleCall(new NetworkApi().getIsSubscriptionActive());

    if (freeTrail.status === 200 && subscription.status === 200) {
      const { message: freeTrialMessage } = freeTrail.data as ApiMutationSuccess;
      const subscriptions = subscription.data as SubscriptionStatus;

      this._freeTrial$.next(freeTrialMessage === "true");
      this._subscription$.next(subscriptions);

      // Determine status
      if (freeTrialMessage === "true") {
        this._status$.next(ESubscriptionStatus.FREE_TRIAL);
      } else if (subscriptions.isActive) {
        this._status$.next(ESubscriptionStatus.ACTIVE);
      } else {
        this._status$.next(ESubscriptionStatus.INACTIVE);
      }

      return;
    }
  }

  /**
   *
   * Keep fetching
   */
  public listen(initDate: Date = new Date()) {
    // It will keep fetching only for few seconds -->  50 sec
    // Add 50 sec to initial date
    const stopAfter = 50; // in sec
    const fetchGap = 5; // in sec

    const date = new Date(initDate.getTime() + stopAfter * 1000);
    const currentDate = new Date();

    if (currentDate < date) {
      const interval = date.getTime() - currentDate.getTime();

      this._timer = setInterval(async () => {
        await this.fetch();
      }, fetchGap * 1000);

      setTimeout(async () => {
        if (this._timer) {
          clearInterval(this._timer);
          this._timer = null;
          localStorage.removeItem("lastFetch");
        }
      }, interval);

      // Save token
      localStorage.setItem("lastFetch", initDate.toString());
    } else {
      // Save token
      localStorage.removeItem("lastFetch");
    }
  }

  /**
   *
   * Boot up
   */
  public bootUp() {
    const savedLastDate = localStorage.getItem("lastFetch");
    if (!savedLastDate) {
      return;
    }

    const datetime = new Date(savedLastDate);
    this.listen(datetime);
  }

  /**
   *
   * Dispose
   */
  public dispose() {
    this._status$.complete();
    this._freeTrial$.complete();
    this._subscription$.complete();
  }
}

/**
 *
 *
 * Token manager
 */
export class ApplicationToken {
  private static instance: ApplicationToken;

  private token: string | null = null;
  private userId: string | null = null;
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private userIdSubject = new BehaviorSubject<string | null>(null);

  public get observable() {
    return this.tokenSubject;
  }

  public get userIdObservable() {
    return this.userIdSubject;
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
  public saveToken(token: string, userId: string) {
    this.token = token;
    this.userId = userId;
    this.tokenSubject.next(token);
    this.userIdSubject.next(userId);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  }

  /**
   *
   * Get token
   */
  public get getToken() {
    return this.token;
  }

  /**
   * Get user id
   */
  public get getUserId() {
    return this.userId;
  }

  /**
   *
   * Delete token
   */
  public deleteToken() {
    this.token = null;
    this.userId = null;
    this.tokenSubject.next(null);
    this.userIdSubject.next(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.clear();
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

    const userId = localStorage.getItem("userId");
    if (userId) {
      this.userId = userId;
      this.userIdSubject.next(userId);
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
  private static makeHttpRequest(token: string | null, url: string, isFile: boolean, options?: RequestInit): Observable<ApiResponse> {
    return defer(() => {
      const abortController = new AbortController();

      // Fetch operation with the AbortController signal
      const fetchObservable = new Observable<ApiResponse>((observer) => {
        fetch(url, {
          ...options,
          headers: isFile ? { Authorization: `Bearer ${token}` } : { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          signal: abortController.signal,
        })
          .then(async (response) => {
            const jsonData = await response.json();
            const statusCode = response.status;
            const statusText = response.statusText;
            const stringJSON = JSON.stringify(jsonData || {});

            return new ApiResponse(statusCode, stringJSON, statusText);
          })
          .then((data) => {
            observer.next(data);
            observer.complete();
          })
          .catch((error) => {
            console.error(error);
            observer.error(error);
          });

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
      switchMap((token) => {
        return HttpManager.makeHttpRequest(token, url, false, options);
      })
    );
  }

  /**
   *
   * Request file
   */
  public static requestFile(url: string, options?: RequestInit): Observable<ApiResponse> {
    return ApplicationToken.getInstance().observable.pipe(
      switchMap((token) => {
        return HttpManager.makeHttpRequest(token, url, true, options);
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
