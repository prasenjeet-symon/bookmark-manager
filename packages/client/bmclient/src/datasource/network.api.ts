import { map, tap } from "rxjs";
import { ErrorManager } from "./http/error.manager";
import { ApplicationToken, HttpManager } from "./http/http.manager";
import { SuccessManager } from "./http/success.manager";
import { ApiMutationError, ApiMutationSuccess, AuthenticationClass, Link, TabCategory, User, UserSetting, UserTab } from "./schema";
import { ApiResponse, ApiResponseMessage } from "./utils";

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
  private linksRoute = `${this.baseUrlRoute}/api/links`;
  private newLinkRoute = `${this.baseUrlRoute}/api/links/new`;

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
    }).pipe(
      map((val) => {
        const { status, statusText, data } = val;
        if (status === 200) {
          const parsed = JSON.parse(data) as any;
          const item = AuthenticationClass.fromJson(parsed);
          return new ApiResponse(status, item, statusText);
        } else {
          return val;
        }
      }),
      map((val) => {
        const { data, status, statusText } = val;
        if (status !== 200) {
          const parsed = JSON.parse(data) as any;
          const error = ApiMutationError.fromJson(parsed);
          return new ApiResponse(status, error, statusText);
        } else {
          return val;
        }
      }),
      tap((val) => {
        const { data, status } = val;
        if (status === 200) {
          const responseData = data as AuthenticationClass;
          ApplicationToken.getInstance().saveToken(responseData.token);
          SuccessManager.getInstance().dispatch("Welcome to Bookmark Manager!");
        } else {
          const responseData = data as ApiMutationError;
          const error = responseData.error.trim().toLowerCase();
          console.log(error);

          switch (error) {
            case ApiResponseMessage.USER_EXISTS.trim().toLowerCase():
              ErrorManager.getInstance().dispatch("User already exists. Please login.");
              break;
          }
        }
      })
    );
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
    }).pipe(
      map((val) => {
        const { status, statusText, data } = val;
        if (status === 200) {
          const parsed = JSON.parse(data) as any;
          const item = AuthenticationClass.fromJson(parsed);
          return new ApiResponse(status, item, statusText);
        } else {
          return val;
        }
      }),
      map((val) => {
        const { data, status, statusText } = val;
        if (status !== 200) {
          const parsed = JSON.parse(data) as any;
          const error = ApiMutationError.fromJson(parsed);
          return new ApiResponse(status, error, statusText);
        } else {
          return val;
        }
      }),
      tap((val) => {
        const { data, status } = val;

        if (status === 200) {
          const responseData = data as AuthenticationClass;
          ApplicationToken.getInstance().saveToken(responseData.token);
          SuccessManager.getInstance().dispatch("Welcome back to Bookmark Manager!");
        } else {
          const responseData = data as ApiMutationError;
          const error = responseData.error.trim().toLowerCase();

          switch (error) {
            case ApiResponseMessage.USER_NOT_FOUND.trim().toLowerCase():
              ErrorManager.getInstance().dispatch("User not found. Please signup.");
              break;
            case ApiResponseMessage.INVALID_PASSWORD.trim().toLowerCase():
              ErrorManager.getInstance().dispatch("Wrong password. Please try again.");
              break;

            default:
              ErrorManager.getInstance().dispatch("Something went wrong. Please try again.");
              break;
          }
        }
      })
    );
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
    }).pipe(
      map((val) => {
        const { status, statusText, data } = val;
        if (status === 200) {
          const parsed = JSON.parse(data) as any;
          const item = AuthenticationClass.fromJson(parsed);
          return new ApiResponse(status, item, statusText);
        } else {
          return val;
        }
      }),
      map((val) => {
        const { data, status, statusText } = val;
        if (status !== 200) {
          const parsed = JSON.parse(data) as any;
          const error = ApiMutationError.fromJson(parsed);
          return new ApiResponse(status, error, statusText);
        } else {
          return val;
        }
      }),
      tap((val) => {
        const { data, status } = val;

        if (status === 200) {
          const responseData = data as AuthenticationClass;
          ApplicationToken.getInstance().saveToken(responseData.token);
          SuccessManager.getInstance().dispatch("Welcome to Bookmark Manager!");
        } else {
          const responseData = data as ApiMutationError;
          const error = responseData.error.trim().toLowerCase();

          switch (error) {
            case ApiResponseMessage.USER_EXISTS.trim().toLowerCase():
              ErrorManager.getInstance().dispatch("User already exists. Please login.");
              break;

            default:
              ErrorManager.getInstance().dispatch("Something went wrong. Please try again.");
              break;
          }
        }
      })
    );
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
    }).pipe(
      map((val) => {
        const { status, statusText, data } = val;
        if (status === 200) {
          const parsed = JSON.parse(data) as any;
          const item = AuthenticationClass.fromJson(parsed);
          return new ApiResponse(status, item, statusText);
        } else {
          return val;
        }
      }),
      map((val) => {
        const { data, status, statusText } = val;
        if (status !== 200) {
          const parsed = JSON.parse(data) as any;
          const error = ApiMutationError.fromJson(parsed);
          return new ApiResponse(status, error, statusText);
        } else {
          return val;
        }
      }),
      tap((val) => {
        const { data, status } = val;

        if (status === 200) {
          const responseData = data as AuthenticationClass;
          ApplicationToken.getInstance().saveToken(responseData.token);
          SuccessManager.getInstance().dispatch("Welcome back to Bookmark Manager!");
        } else {
          const responseData = data as ApiMutationError;
          const error = responseData.error.trim().toLowerCase();

          switch (error) {
            case ApiResponseMessage.USER_NOT_FOUND.trim().toLowerCase():
              ErrorManager.getInstance().dispatch("User not found. Please signup.");
              break;

            default:
              ErrorManager.getInstance().dispatch("Something went wrong. Please try again.");
              break;
          }
        }
      })
    );
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
  public logout() {
    const token = ApplicationToken.getInstance().getToken;

    const reqBody = {
      token: token,
    };

    return HttpManager.request(this.logoutRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    }).pipe(
      tap((val) => {
        const { status } = val;
        if (status === 200) {
          ApplicationToken.getInstance().deleteToken();
          SuccessManager.getInstance().dispatch("Logged out successfully");
        }
      })
    );
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
    }).pipe(
      map((val) => {
        const { status, statusText, data } = val;
        if (status === 200) {
          const parsed = JSON.parse(data) as any;
          const item = ApiMutationSuccess.fromJson(parsed);
          return new ApiResponse(status, item, statusText);
        } else {
          return val;
        }
      }),
      map((val) => {
        const { data, status, statusText } = val;
        if (status !== 200) {
          const parsed = JSON.parse(data) as any;
          const error = ApiMutationError.fromJson(parsed);
          return new ApiResponse(status, error, statusText);
        } else {
          return val;
        }
      }),
      tap((val) => {
        const { data, status } = val;

        if (status === 200) {
          const responseData = data as ApiMutationSuccess;
          SuccessManager.getInstance().dispatch("Email sent successfully. Please check your email.");
        } else {
          const responseData = data as ApiMutationError;
          const error = responseData.error.trim().toLowerCase();

          switch (error) {
            case ApiResponseMessage.USER_NOT_FOUND.trim().toLowerCase():
              ErrorManager.getInstance().dispatch("User not found. Please signup.");
              break;

            default:
              ErrorManager.getInstance().dispatch("Something went wrong. Please try again.");
              break;
          }
        }
      })
    );
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
   * Get all links of category
   */
  public getLinks(tabIdentifier: string, categoryIdentifier: string) {
    const reqBody = {
      tabIdentifier: tabIdentifier,
      categoryIdentifier: categoryIdentifier,
    };

    return HttpManager.request(this.linksRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    }).pipe(
      map((val) => {
        const { data, status, statusText } = val;
        if (status === 200) {
          const parsed = JSON.parse(data) as Array<any>;
          const items = parsed.map((item) => Link.fromJson(item));
          return new ApiResponse(status, items, statusText);
        } else {
          return val;
        }
      })
    );
  }

  /**
   *
   * Add new link to category
   */
  public addLink(tabIdentifier: string, categoryIdentifier: string, link: Link) {
    const reqBody = {
      ...link,
      tabIdentifier: tabIdentifier,
      categoryIdentifier: categoryIdentifier,
    };

    return HttpManager.request(this.newLinkRoute, {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
  }

  /**
   *
   * Update link
   */
  public updateLink(tabIdentifier: string, categoryIdentifier: string, link: Link) {
    const reqBody = {
      ...link,
      tabIdentifier: tabIdentifier,
      categoryIdentifier: categoryIdentifier,
    };

    return HttpManager.request(this.linksRoute, {
      method: "PUT",
      body: JSON.stringify(reqBody),
    });
  }

  /**
   *
   * Delete link
   */
  public deleteLink(tabIdentifier: string, categoryIdentifier: string, link: Link) {
    const reqBody = {
      ...link,
      tabIdentifier: tabIdentifier,
      categoryIdentifier: categoryIdentifier,
    };

    return HttpManager.request(this.linksRoute, {
      method: "DELETE",
      body: JSON.stringify(reqBody),
    });
  }

  /**
   *
   *
   *
   */
}
