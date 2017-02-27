import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { Login } from '../login/login';
import { Home } from '../pages/home/home';

import { SteamIDService } from '../providers/steamid-service';
import { DotaDataService } from '../providers/dota-data-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage : any;
  constructor(public platform: Platform, private steamIDService: SteamIDService, private dotaDataService: DotaDataService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.dotaDataService.getHeroes()
        .subscribe(() => {
          this.dotaDataService.getItems()
          .subscribe(() => {
            this.rootPage = this.steamIDService.getID() ? Home : Login;
          });
        });
    });
  }
}
