import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

// Components are injectable by default, but services are not
// because of that we need to specify the @Injectable decorator
// This allows us to inject things in our service

// *** when we add service to our code we also need to
// *** add the service in app module in providers []

@Injectable({
  // this tells our service, and any components we choose
  // the service which module is providing this service
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) {}

  // login method
  login(model: any) {
    // in order to make use of our xjs operators in Ang6 we have to pass in pipe method
    return this.http.post(this.baseUrl + 'login', model).pipe(
      // token -> key-value pair
      // map operator to store the token locally
      // so we can have easy access to it when we need to get it
      map((response: any) => {
        // we are passing the response here
        // var for user -> inside here is the token object (ex. from postman)
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          console.log(this.decodedToken);
        }
      })
    );
  }

  // register method
  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }

  loggedIn() {
    const token = localStorage.getItem('token'); // get token if the user is logged in
    // return !!token; // !! -> this will return true or false value
    return !this.jwtHelper.isTokenExpired(token);
  }

}
