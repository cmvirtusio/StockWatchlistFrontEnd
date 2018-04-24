import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
//Alert, but for users
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private authService : AuthService,
    private flash : FlashMessagesService,
  ) { }

  ngOnInit() {
  }

  onLogoutClick(){
    this.flash.show('You are now logged out', {cssClass: 'alert-success', timeout: 5000});
    this.authService.logout();
  }

}
