import { Component, OnInit, OnDestroy } from '@angular/core';
import { WatchlistService } from '../../services/watchlist.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private wls: WatchlistService,
    private flash: FlashMessagesService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getwatchlistsofuser();
  }

  onchangedropdownselect(wls) {
    this.curWatchlist = wls;
    this.curTickers = this.curWatchlist['tickers'];

    console.log('even after dropdown');
    console.log(this.curUserWatchlists);
    console.log(this.curWatchlist);
    console.log(this.curTickers);
  }

  getwatchlistsofuser() {
    const curUser = localStorage.getItem('username');
    this.wls.getWatchlist(curUser).subscribe(
      suc => {
        this.curUserWatchlists = Object.keys(suc).map(key => suc[key]);
        if (this.curUserWatchlists.length === 0) {
        } else {
          this.curWatchlist = this.curUserWatchlists[0];
          this.curTickers = this.curWatchlist['tickers'];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  errorhandlerwatchlist(err) {
    const errBody = JSON.parse(err['error']);
    const test = errBody[Object.keys(errBody)[0]];
    if (test === 'invalid_token') {
      this.flash.show('invalid_token, You are now logged out', { cssClass: 'alert-danger', timeout: 5000 });
      this.auth.logout();
      this.router.navigate(['login']);
    } else {
      this.flash.show(err, { cssClass: 'alert-danger', timeout: 5000 });
    }
  }

  initiatecreate() {
    this.created = !this.created;
  }
  createwatchlist() {

    //hardcode for now
    const testWL = { 'name': this.tempwlname, tickers: ["SPY", "GLD"] }

    this.wls.createWatchlist(testWL).subscribe(
      suc => {
        if (suc['body'].startsWith("Watchlist Created")) {
          this.flash.show(suc['body'], { cssClass: 'alert-success', timeout: 5000 });
          window.location.reload();
        } else {
          this.flash.show(suc['body'], { cssClass: 'alert-danger', timeout: 5000 });
        }
      },
      err => this.errorhandlerwatchlist(err)
    );
    this.created = false;
    this.tempwlname = null;
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
        err => this.errorhandlerwatchlist(err)
      );
    } else {
      this.flash.show('Nothing to Delete', { cssClass: 'alert-danger', timeout: 5000 });
    }
  }

  updatecurrentwatchlist() {
    if (this.curWatchlist != null) {
      this.wls.updateWatchlist(this.curWatchlist).subscribe(
        suc => {
          //console.log(suc);
        },
        err => this.errorhandlerwatchlist(err)
      );
    } else {
      this.flash.show('Nothing to Delete', { cssClass: 'alert-danger', timeout: 5000 });
    }
  }

  addstock() {
    const string = this.curSymbol.toUpperCase();
    var index = this.curWatchlist['tickers'].indexOf(string, 0);
    if (index > -1) {
      //this.watchList.splice(index, 1);
    } else {
      this.curWatchlist['tickers'].push(string);
      this.updatecurrentwatchlist();
    }
  }

  removestock(string) {
    var index = this.curWatchlist['tickers'].indexOf(string, 0);
    if (index > -1) {
      this.curWatchlist['tickers'].splice(index, 1);
      this.updatecurrentwatchlist();
    }
  }

  getValues() {
    console.log(this.curSymbol);
  }
  getValuesFromWL(stock) {
    this.curSymbol = stock;
    this.getValues();
  }
}