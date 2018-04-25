import { Injectable } from '@angular/core';
//Imported so that I can pull
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
  serverurl:string; // url of backend;
  constructor(private _http: HttpClient) {
    this.serverurl = 'http://watchlistrest-env.4x3xwqnm49.us-east-2.elasticbeanstalk.com/';
    //this.serverurl = 'http://localhost:8080/';
  }

  registerUser(user) {
    const url = this.serverurl+'register';
    const options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      //options added to make responseType = text, no html error
      observe: "response" as 'body',
      responseType: "text" as 'text'
    };
    return this._http.post(url,user,options);
  }

  
  loginUser(user){
    //URL way
    //const url = this.serverurl+'oauth/token'+'?grant_type=password&username='+user.username+'&password='+user.password;

    //urlencoded way
    const url = this.serverurl+'oauth/token';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Basic bXktdHJ1c3RlZC1jbGllbnQ6c2VjcmV0",
        'Content-Type':  'application/x-www-form-urlencoded'
      })
    };
    let body = `username=${encodeURIComponent(user.username)}&password=${encodeURIComponent(user.password)}&grant_type=password`;

    return this._http.post(url,body,httpOptions);
  }

  saveToken(token){
    localStorage.setItem('token',token);
  }

  isOnline(){
    if(localStorage.getItem('token')===null){
      return false;
    } else {
      return true;
    }
  }

  logout(){
    localStorage.removeItem('token');
  }

}
