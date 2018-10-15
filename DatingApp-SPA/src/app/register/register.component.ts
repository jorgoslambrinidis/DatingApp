import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // in order to recieve prop into our child component
  // we need to specify @Input (import)
  // in this way we can have access to this property inside our register component
  // valuesFromHome has to be matching with the one from the home component

  // @Input() valuesFromHome: any;

  // add output property used for passing data from child to parent
  // this properties emit events..we will need EventEmitter
  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  // init service method to be able to use the method
  // init here the register to make use of the created register method in the auth service
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  register() {
    // console.log(this.model);
    // for the success method inside the subscribe() we will use empty parenthesis
    // because we are not using anything from this response inside what we are
    // doing after this is successful
    // we will also handling the error
    this.authService.register(this.model).subscribe(() => {
      console.log('registration successful');
    }, error => {
      console.log(error);
    });
  }

  cancel() {
    // for the cancel button we need component communication because
    // the button event is on the register component, but we need to
    // function together with the toggle method from the home component
    // to actually work as a cancel method.

    // 2 ways: parent->child or child->parent
    // ----------------------------------------------------------------
    // we are emitting something from this method
    // as long as we are emitting some form of data, to our parent component its fine
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }

}
