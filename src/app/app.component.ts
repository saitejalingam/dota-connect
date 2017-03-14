import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { Push, PushToken } from '@ionic/cloud-angular';


import { Login } from '../login/login';
import { Home } from '../pages/home/home';

import { SteamIDService } from '../providers/steamid-service';
import { DotaDataService } from '../providers/dota-data-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  public rootPage: any;

  constructor(
    public platform: Platform,
    private steamIDService: SteamIDService,
    private dotaDataService: DotaDataService,
    private push: Push,
    private alert: AlertController
  ) { }

  ngOnInit() { this.initializeApp(); };

  initializeApp() {
    this.push.register().then((t: PushToken) => {
      return this.push.saveToken(t);
    }).then((t: PushToken) => {
      console.log('Token saved:', t.token);
    });

    this.platform.ready().then(() => {
      StatusBar.styleDefault();

      this.dotaDataService.fetchHeroes()
        .flatMap((heroes) => {
          this.dotaDataService.heroes = heroes;
          return this.dotaDataService.fetchItems();
        })
        .subscribe((items) => {
          this.dotaDataService.items = items;
          this.rootPage = this.steamIDService.getID() ? Home : Login;
        }, (err) => {
          this.alert.create({
            title: 'API Failed',
            message: 'Failed to fetch data. Some features may not work. Please restart the app.',
            buttons: ['Dismiss']
          }).present();
        });
    });
  }
}
