import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable()
export class WatchlistService {
  serverurl : String;
  constructor(
    private _http: HttpClient
  ) { 
    this.serverurl = 'http://watchlistrest-env.4x3xwqnm49.us-east-2.elasticbeanstalk.com/';
    //this.serverurl = 'http://localhost:8080/';
  }

  createWatchlist(wl){
    const url = this.serverurl+'watchlist';
    const options = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+localStorage.getItem('token'),
        'Content-Type':  'application/json'
      }),
      //options added to make responseType = text, no html error
      observe: "response" as 'body',
      responseType: "text" as 'text'
    };
    return this._http.post(url,wl,options);
  }

  getWatchlist(){
    const url = this.serverurl+'watchlist';
    const options = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+localStorage.getItem('token')
      })
    };
    return this._http.get(url,options);
  }

  updateWatchlist(wl){
    const url = this.serverurl+'watchlist/'+wl.id;
    const options = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+localStorage.getItem('token'),
        'Content-Type':  'application/json'
      }),
      //options added to make responseType = text, no html error
      observe: "response" as 'body',
      responseType: "text" as 'text'
    };
    return this._http.put(url,wl,options);
  }

  deleteWatchlist(wl){
    const url = this.serverurl+'watchlist/'+wl.id;
    const options = {
      headers: new HttpHeaders({
        'Authorization': "Bearer "+localStorage.getItem('token')
      }),
      //options added to make responseType = text, no html error
      observe: "response" as 'body',
      responseType: "text" as 'text'
    };
    return this._http.delete(url,options);
  }
}
