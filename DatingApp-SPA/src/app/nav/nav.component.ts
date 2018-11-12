import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  // initialize object of type any
  model: any = {};

  // * inject our service in the constructor
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  // create method to login
  login() {
    // console.log(this.model);
    // because is Observable, we always have to subscribe to our method
    // in subscibe we use 2nd overload
    this.authService.login(this.model).subscribe(next => {
      console.log('Logged in successfully');
    }, error => {
      // console.log('Failed to login');
      console.log(error);
    });
  }

  loggedIn() {
    const token = localStorage.getItem('token'); // get token if the user is logged in
    return !!token; // !! -> this will return true or false value
  }

  logout() {
    localStorage.removeItem('token');
    console.log('logged out!');
  }

}

// Login with Bob, Password -> Logged in successfully
// Go to Network tab in console, login -> go to headers, preview and response to see the token
// Go to https://jwt.io/ and paste the token to get the user
