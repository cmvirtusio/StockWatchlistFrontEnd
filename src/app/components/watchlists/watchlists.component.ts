import { Component, OnInit, OnDestroy } from '@angular/core';
import { WatchlistService } from '../../services/watchlist.service';
import { FlashMessagesService } from 'angular2-flash-messages';
//to navigate to a specific route initialized in app-routing.module.ts
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlists',
  templateUrl: './watchlists.component.html',
  styleUrls: ['./watchlists.component.css']
})
export class WatchlistsComponent implements OnInit, OnDestroy {
  curUserWatchlists;
  curWatchlist;
  curTickers;
  curSymbol;
  created: boolean = false;
  tempwlname: String;

  constructor(
    private wls: WatchlistService,
    private flash: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getwatchlistsofuser();
  }

  ngOnDestroy() {
    console.log("I am updating all watchlists");
    console.log(this.curUserWatchlists);
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
    //hardcode for now
    const curUser = localStorage.getItem('username');
    this.wls.getWatchlist(curUser).subscribe(
      suc => {
        this.curUserWatchlists = Object.keys(suc).map(key => suc[key]);
        if (this.curUserWatchlists.length === 0) {
        } else {
          this.curWatchlist = this.curUserWatchlists[0];
          this.curTickers = this.curWatchlist['tickers'];
        }
        // console.log(this.curUserWatchlists);
        // console.log(this.curWatchlist);
        // console.log(this.curTickers);
      },
      err => {
        console.log(err);
      }
    );
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
      err => {
        this.flash.show(err, { cssClass: 'alert-danger', timeout: 5000 });
      }
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
        err => {
          this.flash.show(err, { cssClass: 'alert-danger', timeout: 5000 });
        }
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
    }
    this.updatecurrentwatchlist();
  }

  removestock(string) {
    var index = this.curWatchlist['tickers'].indexOf(string, 0);
    if (index > -1) {
      this.curWatchlist['tickers'].splice(index, 1);
    }
    this.updatecurrentwatchlist();
  }

  updatecurrentwatchlist() {
    if (this.curWatchlist != null) {
      this.wls.updateWatchlist(this.curWatchlist).subscribe(
        suc => {
          console.log(suc);
          // if(suc['body'].startsWith("Deleted: ")){
          //   this.flash.show('Successfully deleted', {cssClass: 'alert-success', timeout: 5000});
          //   window.location.reload();
          // } else {
          //   this.flash.show(suc['body'], {cssClass: 'alert-danger', timeout: 5000});
          // }
        },
        err => {
          this.flash.show(err, { cssClass: 'alert-danger', timeout: 5000 });
        }
      );
    } else {
      this.flash.show('Nothing to Delete', { cssClass: 'alert-danger', timeout: 5000 });
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