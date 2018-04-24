import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
//to navigate to a specific route initialized in app-routing.module.ts
import { Router } from '@angular/router';
//Alert, but for users
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;
  saveUsername:boolean;

  //dependencies
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }

    this.authService.loginUser(user).subscribe(
      suc => {
        this.authService.saveUser(user.username);
        this.authService.saveToken(suc['access_token']);
        this.flashMessage.show('You are now logged in', {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['dashboard']);
      },
      err => {
        if(!this.saveUsername){
          this.username='';
        }
        this.password = '';
        this.flashMessage.show('Try Again', {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate(['login']);
      }
    );
  }

}
