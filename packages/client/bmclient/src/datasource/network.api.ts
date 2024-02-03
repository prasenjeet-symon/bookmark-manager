import { HttpManager } from "./http/http.manager";

export class NetworkApi {
  private baseUrl = "http://localhost:8081/server";
  private signUp = `${this.baseUrl}/auth/signup`;

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
}
