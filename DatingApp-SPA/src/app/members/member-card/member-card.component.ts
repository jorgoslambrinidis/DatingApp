import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';

// when we generate component from snippet,
// outside from app folder (top level), angular has no longer
// capability to directly import this into our app module file

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  // because our member-card component it is going to be child component
  // of our member-list component, we are going to pass our user down to
  // this card component so we can display the contents of the user inside
  // this particular component.
  // So we will add an input property because we are going to pass down
  // the user from our parent component, in this case member-list component

  @Input() user: User; // we are going to say that the user is of type User

  constructor() { }

  ngOnInit() {
  }

}
