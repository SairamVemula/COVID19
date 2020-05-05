import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  mongoURI = 'http://localhost:3000/api/users/';

  //REGISTER
  register(user) {
    return this.http.post<Response>(this.mongoURI + 'register', user);
  }

  //LOGIN
  login(user) {
    return this.http.post<Response>(this.mongoURI + 'login', user);
  }

  //LOGIN VIA GOOGLE
  loginGoogle(user) {
    return this.http.post<Response>(this.mongoURI + 'googleLogin', user);
  }

  //LOGIN VIA FACEBOOK
  loginFaceBook(user) {
    return this.http.post<Response>(this.mongoURI + 'facebookLogin', user);
  }
}
interface Response {
  success: boolean;
  message: string;
  data: object;
  sessionToken: string;
}
