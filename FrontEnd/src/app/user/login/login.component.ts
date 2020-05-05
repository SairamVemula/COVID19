import { UserService } from './../../user.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import * as _ from 'lodash';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private user: SocialUser;
  private loggedIn: boolean;
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  login(user) {
    this.userService.login(user).subscribe((res) => {
      console.log(res.sessionToken);
      localStorage.setItem('sessionToken', res.sessionToken);
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user) => {
      this.user = user;
      console.log(user);
      this.userService
        .loginGoogle(_.pick('id', 'name', 'email'))
        .subscribe((res) => {
          console.log(res.sessionToken);
          localStorage.setItem('sessionToken', res.sessionToken);
        });
      this.loggedIn = user != null;
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((user) => {
      this.user = user;
      console.log(user);
      this.userService
        .loginFaceBook(_.pick('id', 'name', 'email'))
        .subscribe((res) => {
          console.log(res.sessionToken);
          localStorage.setItem('sessionToken', res.sessionToken);
        });
      this.loggedIn = user != null;
    });
  }

  signOut(): void {
    this.authService.signOut();
  }
  ngOnInit(): void {
    // this.authService.authState.subscribe((user) => {
    //   this.user = user;
    //   console.log(user);
    //   this.loggedIn = user != null;
    // });
  }
}
// SocialUser{
// authToken: "ya29.a0Ae4lvC33yNvXFKSe0y9-AzNI32x9MPrDnGorj451ctamTLAzLPbh2FZCvndq5DFvklPi9DE7alVEyEYNbfoU3JB2ccRl2Hoo_CuuL_ogS-oWdlIrPPpT8LXEnJV8uRrgdE5sv-W9krtcIBdaY5evoZgGeeq3wfSeLCc"
// email: "rajuadep1990@gmail.com"
// firstName: "Raju"
// id: "107778406027663033417"
// idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc0YmQ4NmZjNjFlNGM2Y2I0NTAxMjZmZjRlMzhiMDY5YjhmOGYzNWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjU1MDk5NTY2NDA5LWNxcDlkdG1mYTNuNXRsY24waGk1Z3BsNnBpOG40bDJmLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjU1MDk5NTY2NDA5LWNxcDlkdG1mYTNuNXRsY24waGk1Z3BsNnBpOG40bDJmLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA3Nzc4NDA2MDI3NjYzMDMzNDE3IiwiZW1haWwiOiJyYWp1YWRlcDE5OTBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ0ZWE2YzNUWEF2bFJXUldiZjN4VW9BIiwibmFtZSI6IlJhanUgQWRlcCIsInBpY3R1cmUiOiJodHRwczovL2xoNS5nb29nbGV1c2VyY29udGVudC5jb20vLTExQTJ3ZjQxT05zL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FBS1dKSk9Ialo4cUo0c2VNelpwSmNkdWU1bXBRWlE4UWcvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlJhanUiLCJmYW1pbHlfbmFtZSI6IkFkZXAiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU4ODY4ODA4MywiZXhwIjoxNTg4NjkxNjgzLCJqdGkiOiI2MDJjZGUwY2Q4ODVjZmU5ZTVhNzkyYmUyMjUwYjgyMDJlNDU5MTkyIn0.kW6qc4SrZ9BL6DaAvq8x39bK7vyhLll3BtWaQ_TvmGtqM077xYejs4ql1ZltclcpmQn0ZIA1AYXQDB9YlPMkN6EfGCpQ_a9Xh1mRxCUljCB03XAHPuYYY6zI1uwG-6GC3935HybEpkHLpQWwMO577ZqPuR9E_WTJChf6MWEBVc5c145-xxqlWAv4_zAta5NjqgPivwPj3YWOSTLZCJGkpMYD_Vn8T-fPpYN1YYLHoA1I7gwpsy3xBSBqSDLTLE7eLyrHs22PyABwh5JWbapMNJpllQu17qFiHptyelCdPX9gK_jX-9ZReO5_ul1uAELO_MWX9tWnEUJM7w8lgEj3fg"
// lastName: "Adep"
// name: "Raju Adep"
// photoUrl: "https://lh5.googleusercontent.com/-11A2wf41ONs/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJOHjZ8qJ4seMzZpJcdue5mpQZQ8Qg/s96-c/photo.jpg"
// provider: "GOOGLE"
// }
