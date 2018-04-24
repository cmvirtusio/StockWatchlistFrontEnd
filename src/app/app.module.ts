import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//ng new appname --routing (if done before creating the app)
//ng g m route --routing (if done after creating the app)
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WatchlistsComponent } from './components/watchlists/watchlists.component';
import { RegisterComponent } from './components/register/register.component';




//enable twowaybinding
import { FormsModule } from '@angular/forms';


//This Enables http calls;
import { HttpClientModule } from '@angular/common/http';

//my services
import { AlphavantageService } from './services/alphavantage.service';
import { AuthService } from './services/auth.service';
import { FormvalidationService } from './services/formvalidation.service';
import { WatchlistService } from './services/watchlist.service';

//npm install angular2-flash-messages --save
import { FlashMessagesModule } from 'angular2-flash-messages';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    WatchlistsComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FlashMessagesModule.forRoot()
  ],
  providers: [AlphavantageService,AuthService,FormvalidationService, WatchlistService],
  bootstrap: [AppComponent]
})
export class AppModule { }
