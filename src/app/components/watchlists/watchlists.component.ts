import { Component, OnInit, OnDestroy } from '@angular/core';
import { WatchlistService } from '../../services/watchlist.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlphavantageService } from '../../services/alphavantage.service';
import { Chart } from 'chart.js';
import { Stockreturns } from '../../models/stockreturns';

@Component({
  selector: 'app-watchlists',
  templateUrl: './watchlists.component.html',
  styleUrls: ['./watchlists.component.css']
})
export class WatchlistsComponent implements OnInit {
  curUserWatchlists;
  curWatchlist;
  curTickers;
  curSymbol;
  created: boolean = false;
  tempwlname: String;
  chart = []; // This will hold our chart info
  stockreturns: Stockreturns;
  tickerToChart: String;

  constructor(
    private wls: WatchlistService,
    private flash: FlashMessagesService,
    private router: Router,
    private auth: AuthService,
    private avs: AlphavantageService
  ) { }

  ngOnInit() {
    this.getwatchlistsofuser();
    this.tickerToChart = "SPY";
    this.getValuesFromWL(this.tickerToChart);
  }

  onchangedropdownselect(wls) {
    this.curWatchlist = wls;
    this.curTickers = this.curWatchlist['tickers'];

    console.log('even after dropdown');
    console.log(this.curUserWatchlists);
    console.log(this.curWatchlist);
    console.log(this.curTickers);
  }

  //Error Handler for watchlist CRUD operations
  errorhandlerwatchlist(errBody) {
    if (errBody.error === 'invalid_token') {
      this.flash.show('invalid_token, You are now logged out', { cssClass: 'alert-danger', timeout: 5000 });
      this.auth.logout();
      this.router.navigate(['login']);
    } else {
      this.flash.show(errBody, { cssClass: 'alert-danger', timeout: 5000 });
    }
  }

  initiatecreate() {
    this.created = !this.created;
  }

  createwatchlist() {
    const testWL = { 'name': this.tempwlname, tickers: ["SPY", "AAPL", "NVDA", "TLT", "GLD"] }
    this.wls.createWatchlist(testWL).subscribe(
      suc => {
        if (suc['body'].startsWith("Watchlist Created")) {
          this.flash.show(suc['body'], { cssClass: 'alert-success', timeout: 5000 });
          window.location.reload();
        } else {
          this.flash.show(suc['body'], { cssClass: 'alert-danger', timeout: 5000 });
        }
      },
      err => this.errorhandlerwatchlist(JSON.parse(err['error']))
    );
    this.created = false;
    this.tempwlname = null;
  }

  getwatchlistsofuser() {
    this.wls.getWatchlist().subscribe(
      suc => {
        this.curUserWatchlists = Object.keys(suc).map(key => suc[key]);
        if (this.curUserWatchlists.length === 0) {
          this.tempwlname = "Sample Watchlist";
          this.createwatchlist();
        } else {
          this.curWatchlist = this.curUserWatchlists[0];
          this.curTickers = this.curWatchlist['tickers'];
        }
      },
      err => this.errorhandlerwatchlist(err['error'])
    );
  }

  updatecurrentwatchlist() {
    if (this.curWatchlist != null) {
      this.wls.updateWatchlist(this.curWatchlist).subscribe(
        suc => {
          //console.log(suc);
        },
        err => this.errorhandlerwatchlist(JSON.parse(err['error']))
      );
    } else {
      this.flash.show('Nothing to Update', { cssClass: 'alert-danger', timeout: 5000 });
    }
  }

  deletecurrentwatchlist() {
    if (this.curWatchlist != null) {
      this.wls.deleteWatchlist(this.curWatchlist).subscribe(
        suc => {
          if (suc['body'].startsWith("Deleted: ")) {
            this.flash.show('Successfully deleted', { cssClass: 'alert-success', timeout: 5000 });
            window.location.reload();
          } else {
            this.flash.show(suc['body'], { cssClass: 'alert-danger', timeout: 5000 });
          }
        },
        err => this.errorhandlerwatchlist(JSON.parse(err['error']))
      );
    } else {
      this.flash.show('Nothing to Delete', { cssClass: 'alert-danger', timeout: 5000 });
    }
  }

  addstock() {
    var letters = /^[a-zA-Z]+$/
    if (!letters.test(this.curSymbol)) {
      this.flash.show("Alphabetical Characters Only", { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    const string = this.curSymbol.toUpperCase();
    let index = this.curWatchlist['tickers'].indexOf(string, 0);
    if (index > -1) {
      this.flash.show("Already In Watchlist", { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    if (this.curWatchlist['tickers'].length > 9) {
      this.flash.show("Cannot have more than 10", { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    this.curWatchlist['tickers'].push(string);
    this.updatecurrentwatchlist();
  }

  removestock(string) {
    let index = this.curWatchlist['tickers'].indexOf(string, 0);
    if (index > -1) {
      this.curWatchlist['tickers'].splice(index, 1);
      this.updatecurrentwatchlist();
    }
  }

  getValuesFromWL(stock) {
    this.avs.dailyReturns(stock).subscribe(
      suc => {
        let firstproperty = Object.keys(suc)[0];
        if (firstproperty === "Error Message") {
          this.flash.show(suc[firstproperty], { cssClass: 'alert-danger', timeout: 5000 });
          this.removestock(stock);
        } else {
          this.stockreturns = new Stockreturns(stock, suc);
          this.chartsdr();
          this.tickerToChart = stock;
        }
      },
      err => this.flash.show(err, { cssClass: 'alert-danger', timeout: 5000 })
    )
  }

  chartsdr() {
    let dates = this.stockreturns.dailyReturns.map(daily => daily.date).reverse();
    let prices = this.stockreturns.dailyReturns.map(daily => daily.price).reverse();
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            data: prices,
            borderColor: "#3cba9f",
            fill: false
          },
        ]
      },
      options: {
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
          }
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }
}