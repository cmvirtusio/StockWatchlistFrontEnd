import { Injectable } from '@angular/core';

@Injectable()
export class FormvalidationService {

  constructor() { }

  validateRegister(user) {
    if(user.username == undefined || user.password == undefined || user.passwordConfirmation == undefined) {
        return false;
    } else {
      return true;
    }
  }

  comparePassword(user) {
    if(user.password === user.passwordConfirmation) {
        return true;
    } else {
      return false;
    }
  }

}
