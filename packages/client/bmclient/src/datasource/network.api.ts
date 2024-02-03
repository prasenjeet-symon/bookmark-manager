import { HttpManager } from "./http/http.manager";

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
}
