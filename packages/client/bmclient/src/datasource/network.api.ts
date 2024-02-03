import { HttpManager } from "./http/http.manager";

export class NetworkApi {
  private baseUrl = "http://localhost:8081/server";
  private signUp = `${this.baseUrl}/auth/signup`;
  private signIn = `${this.baseUrl}/auth/login`;
  private signUpGoolge = `${this.baseUrl}/auth/google-signup`;
  private signInGoogle = `${this.baseUrl}/auth/google-signin`;

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

    return HttpManager.request(this.signUp, {
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

    return HttpManager.request(this.signIn, {
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

    return HttpManager.request(this.signUpGoolge, {
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

    return HttpManager.request(this.signInGoogle, {
      method: "POST",
      body: JSON.stringify(reqBody),
    });
  }
}
