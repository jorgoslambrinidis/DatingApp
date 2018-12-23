import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent> {
  canDeactivate(component: MemberEditComponent) {
    if (component.editForm.dirty) {
      return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
    }
    return true;
  }
}

// if someone clicks to "x" on browser, or close the tab, angular does not have controll
// on something outside of the routes, and we cannot guard that. We don't have controll to prevent
// the user from clicking the close browser/tab function

// **************************************** !!! ****************************************
// to make and prevent something like that we have to add "Host Listener Decorator"
// **************************************** !!! ****************************************

// - this has ability to listen our host, in this case, the browser, and
// take an action based on something that is happening to our browser
// --> continue in member-edit.component.ts
