import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Login } from '../login/login';
import { Home } from '../pages/home/home';
import { SteamIDService } from '../providers/steamid-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  constructor(public platform: Platform, private steamIDService: SteamIDService) {
    this.initializeApp();
    this.rootPage = steamIDService.getID() ? Home : Login;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
