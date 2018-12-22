import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// here we have to make this Injectable
@Injectable()
export class MemberListResolver implements Resolve<User[]> {
   constructor(
     private userService: UserService,
     private router: Router,
     private alertify: AlertifyService) {}

     // here we have to implement our Resolve Method -> this is our resolver
     resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        // we have to return something from this method
        // use pipe for -> redirect the user back, and get out of the user as well

        // when we resolve, we go out to our user service, get the user that matches
        // the route parameters that we are aiming to get
        // and the rest of this (after the pipe) is purely to catch the error and return
        // out of this method if we have a problem. If we don't have a problem we just going to
        // continue on to our route that we are activating, but in this case we have the opportunity
        // to get the data from our routes, instead going to our user service to get it

        // because this is a resolver we have to provide this, just as we did with our _guards
        // go to our app.module.ts, define "MemberListResolver" in the "providers"

        // because is route resolver we also have to add this to our "routes.ts" file
        return this.userService.getUsers().pipe(
          catchError(error => {
            this.alertify.error('Problem retrieving data');
            this.router.navigate(['/home']);
            // "of" is a type of the observable -> return an observable of null
            return of(null);
          })
        );
     }
}
