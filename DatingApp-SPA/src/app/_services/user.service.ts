import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';

// here -> create the header   <- we can get rid of this
// const httpOptions = {
//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token'),
//   })
// };


@Injectable({
  providedIn: 'root'
})
export class UserService {
  // we are going to query our api from this file
  // define url link in the environments/environment.ts
  baseUrl = environment.apiUrl;

  // define the use of HttpClient Service
  constructor(private http: HttpClient) { }

    // to use these method we have to send authentication/authorization bearer token
    // with the request -> we have to add that to our request !!!!!!!!!!!!!!

    // this.http.get method takes some options inside, in that options, and
    // inside the option can be the headers -> in postman we used authorization header
    // to send our bearer token to the server

    // we have to create a header to be sent to the server in our request headers -> above our class


    // here add a couple of methods
    // this is going to return an observable of type User...an array of users
    getUsers(): Observable<User[]> {
      // we need to tell our get method what it's going to be returning
      // -> in this case it's going to be returning a User array
      return this.http.get<User[]>(this.baseUrl + 'users'); // pass our httpOptions, <- remove httpOptions
    }

    // pass the id in getUser method
    getUser(id): Observable<User> {
      return this.http.get<User>(this.baseUrl + 'users/' + id); // pass our httpOptions, <- remove httpOptions
    }

    // updateUser method
    updateUser(id: number, user: User) {
      // pass the id, and the whole user object
      return this.http.put(this.baseUrl + 'users/' + id, user);
    }
    // -> next we have to go to our component "member-edit.component.ts"

}
