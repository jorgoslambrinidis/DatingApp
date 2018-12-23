import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  // we can use the method in the form itself to reset the form
  // in order to access the form we need to use the @ViewChild decorator
  @ViewChild('editForm') editForm: NgForm;

 // we are retrieving our user details
  // and using our route to provide the data
  // adding our user propery and assinging to this data from our route
  user: User;

  // adding the "Host Listener Decorator" here
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private authService: AuthService) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }

  updateUser() {
    // console.log(this.user);
    // we need to subscribe to this because is returning an Observable
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      // when the user is updated successfully
      this.alertify.success('Profile updated successfully');
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.error(error);
    });
    // this from here pasted up
    // this.alertify.success('Profile updated successfully');
    // this.editForm.reset(this.user);
  }
}


// *** info ***
// adding a _guard to protect us from clicking to another menu link
// without saving our changes in edit profile
