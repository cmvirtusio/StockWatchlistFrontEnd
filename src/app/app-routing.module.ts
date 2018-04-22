import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WatchlistsComponent } from './components/watchlists/watchlists.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  //home
  {path:'', component: HomeComponent},
  //login
  {path:'login', component: LoginComponent},
  //dashboard
  {path:'dashboard', component: DashboardComponent},
  //watchlists (This should be protected)
  {path:'watchlists', component: WatchlistsComponent},
  //register
  {path:'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
