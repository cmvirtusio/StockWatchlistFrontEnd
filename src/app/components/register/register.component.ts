import { Component, OnInit } from '@angular/core';
import { FormvalidationService } from '../../services/formvalidation.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
//reroute
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //my backend needs
  //username
  //password
  //passwordConfirmation
  //No need to create a model, coz it is only used by this Component
  username : String;
  password : String;
  passwordConfirmation : String;

  //dependency injection
  constructor(
    private formvalidationservice : FormvalidationService,
    private authservice : AuthService,
    private flash : FlashMessagesService,
    private router : Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const registerObject = {
      username : this.username,
      password : this.password,
      passwordConfirmation : this.passwordConfirmation
    };
    // Required Fields
    if(!this.formvalidationservice.validateRegister(registerObject)) {
      this.flash.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    } else {
      //run comparepasswords
      if(!this.formvalidationservice.comparePassword(registerObject)){
        this.flash.show('Passwords do not match', {cssClass: 'alert-danger', timeout: 3000});
      }
    }

    //Register user
    this.authservice.registerUser(registerObject).subscribe(
      suc => {
        const message = suc['body'];
        if(suc['body'] == 'User Created'){
          this.flash.show(message, {cssClass: 'alert-success', timeout: 3000});
        } else {
          this.flash.show(message, {cssClass: 'alert-danger', timeout: 3000});
          this.router.navigate(['/register']);
        }
      },
      err => {
        this.flash.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/register']);
      }
    );
  }



}
