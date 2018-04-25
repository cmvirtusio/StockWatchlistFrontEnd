import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AlphavantageService {

  constructor(
    private _http:HttpClient
  ) { }

  dailyReturns(ticker:string){
    return this._http.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+ ticker +"&apikey=L1TV17SLEIT0P4ZT");
  }

}
