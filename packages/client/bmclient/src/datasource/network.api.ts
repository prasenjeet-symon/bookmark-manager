import { map } from "rxjs";
import { HttpManager } from "./http/http.manager";
import { TabCategory, User, UserSetting, UserTab } from "./schema";
import { ApiResponse } from "./utils";

export class NetworkApi {
  private baseUrlRoute = "http://localhost:8081/server";
  private signUpRoute = `${this.baseUrlRoute}/auth/signup`;
  private signInRoute = `${this.baseUrlRoute}/auth/login`;
  private signUpGoogleRoute = `${this.baseUrlRoute}/auth/google-signup`;
  private signInGoogleRoute = `${this.baseUrlRoute}/auth/google-signin`;
  private isTokenValidRoute = `${this.baseUrlRoute}/auth/is-token-valid`;
  private logoutRoute = `${this.baseUrlRoute}/auth/logout`;
  private forgotPasswordRoute = `${this.baseUrlRoute}/auth/forgot-password`;
  private resetPasswordRoute = `${this.baseUrlRoute}/auth/reset-password`;
  private userRoute = `${this.baseUrlRoute}/api/user`;
  private userSettingRoute = `${this.baseUrlRoute}/api/user-setting`;
  private tabsRoute = `${this.baseUrlRoute}/api/tabs`;
  private categoriesRoute = `${this.baseUrlRoute}/api/categories`;

  /**
   *
   * Signup with email and password
   */
  public signup(email: string, password: string, fullName: string) {
    const reqBody = {
      email: email,
      password: password,
      fullName: fullName,
    };

    return HttpManager.request(this.signUpRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
  }

  /**
   *
   * Sign in with email and password
   */
  public signin(email: string, password: string) {
    const reqBody = {
      email: email,
      password: password,
    };

    return HttpManager.request(this.signInRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
  }

  /**
   *
   * Signup with google
   */
  public signupGoogle(token: string) {
    const reqBody = {
      token: token,
    };

    return HttpManager.request(this.signUpGoogleRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
  }

  /**
   *
   * Signin with google
   */
  public signinGoogle(token: string) {
    const reqBody = {
      token: token,
    };

    return HttpManager.request(this.signInGoogleRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
  }

  /**
   *
   * Is token valid
   */
  public isTokenValid(token: string) {
    const reqBody = {
      token: token,
    };

    return HttpManager.request(this.isTokenValidRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
  }

  /**
   *
   * Logout
   */
  public logout(token: string) {
    const reqBody = {
      token: token,
    };

    return HttpManager.request(this.logoutRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
  }

  /**
   *
   * Forgot password
   */
  public forgotPassword(email: string) {
    const reqBody = {
      email: email,
    };

    return HttpManager.request(this.forgotPasswordRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
  }

  /**
   *
   * Reset password
   */
  public resetPassword(token: string, userId: string, password: string) {
    const reqBody = {
      token: token,
      userId: userId,
      password: password,
    };

    return HttpManager.request(this.resetPasswordRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
  }

  /**
   *
   * Get user
   */
  public getUser() {
    return HttpManager.request(this.userRoute, {
      method: "GET",
    }).pipe(
      map((val) => {
        const { data, status, statusText } = val;
        if (status === 200) {
          const parsed = JSON.parse(data) as any;
          const item = User.fromJson(parsed);
          return new ApiResponse(status, item, statusText);
        } else {
          return val;
        }
      })
    );
  }

  /**
   *
   * Update user
   */
  public updateUser(user: User) {
    return HttpManager.request(this.userRoute, {
      method: "PUT",
      body: user.toJson(),
    });
  }

  /**
   *
   * Get user setting
   */
  public getUserSetting() {
    return HttpManager.request(this.userSettingRoute, {
      method: "GET",
    }).pipe(
      map((val) => {
        const { data, status, statusText } = val;
        if (status === 200) {
          const parsed = JSON.parse(data) as any;
          const item = UserSetting.fromJson(parsed);
          return new ApiResponse(status, item, statusText);
        } else {
          return val;
        }
      })
    );
  }

  /**
   *
   * Update user settings
   */
  public updateUserSetting(userSetting: UserSetting) {
    return HttpManager.request(this.userSettingRoute, {
      method: "PUT",
      body: userSetting.toJson(),
    });
  }

  /**
   *
   * Get use's tabs
   */
  public getTabs() {
    return HttpManager.request(this.tabsRoute, {
      method: "GET",
    }).pipe(
      map((val) => {
        const { data, status, statusText } = val;
        if (status === 200) {
          const parsed = JSON.parse(data) as Array<any>;
          const items = parsed.map((item) => UserTab.fromJson(item));
          return new ApiResponse(status, items, statusText);
        } else {
          return val;
        }
      })
    );
  }

  /**
   *
   * Add new tab
   */
  public addTab(userTab: UserTab) {
    return HttpManager.request(this.tabsRoute, {
      method: "POST",
      body: userTab.toJson(),
    });
  }

  /**
   *
   * Update tab
   *
   */
  public updateTab(userTab: UserTab) {
    return HttpManager.request(this.tabsRoute, {
      method: "PUT",
      body: userTab.toJson(),
    });
  }

  /**
   *
   * Delete tab
   */
  public deleteTab(userTab: UserTab) {
    return HttpManager.request(this.tabsRoute, {
      method: "DELETE",
      body: userTab.toJson(),
    });
  }

  /**
   * Get tab's categories
   */
  public getCategories(tabIdentifier: string) {
    const reqBody = {
      tabIdentifier: tabIdentifier,
    };

    return HttpManager.request(this.categoriesRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    }).pipe(
      map((val) => {
        const { data, status, statusText } = val;
        if (status === 200) {
          const parsed = JSON.parse(data) as Array<any>;
          const items = parsed.map((item) => TabCategory.fromJson(item));
          return new ApiResponse(status, items, statusText);
        } else {
          return val;
        }
      })
    );
  }

  /**
   *
   * Add new category
   */
  public addCategory(tabCategory: TabCategory) {
    return HttpManager.request(this.categoriesRoute, {
      method: "POST",
      body: tabCategory.toJson(),
    });
  }

  /**
   *
   * Update category
   */
  public updateCategory(tabCategory: TabCategory) {
    return HttpManager.request(this.categoriesRoute, {
      method: "PUT",
      body: tabCategory.toJson(),
    });
  }

  /**
   *
   * Delete category
   */
  public deleteCategory(tabCategory: TabCategory) {
    return HttpManager.request(this.categoriesRoute, {
      method: "DELETE",
      body: tabCategory.toJson(),
    });
  }

  /**
   *
   *
   *
   */
}
