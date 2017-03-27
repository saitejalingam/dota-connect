import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { Push, PushToken } from '@ionic/cloud-angular';


import { Login } from '../login/login';
import { Home } from '../pages/home/home';

import { StorageService } from '../providers/storage-service';
import { DotaDataService } from '../providers/dota-data-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  public rootPage: any;

  constructor(
    public platform: Platform,
    private storage: StorageService,
    private dotaDataService: DotaDataService,
    private push: Push,
    private alert: AlertController,
    private toast: ToastController
  ) { }

  ngOnInit() { this.initializeApp(); };

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      
      this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
        console.log('Token saved:', t.token);
      }).catch(() => {
        this.toast.create({
          message: 'Failed to register for push notifications. Some features may not work. Please restart the app.',
          showCloseButton: true,
          position: 'bottom',
          duration: 10000
        }).present();
      });

      this.rootPage = this.storage.getID() ? Home : Login;
      this.dotaDataService.fetchHeroes()
        .flatMap((heroes) => {
          this.dotaDataService.heroes = heroes;
          return this.dotaDataService.fetchItems();
        })
        .subscribe((items) => {
          this.dotaDataService.items = items;
        }, (err) => {
          this.toast.create({
            message: 'Failed to fetch data. Some features may not work. Please restart the app.',
            showCloseButton: true,
            position: 'bottom',
            duration: 10000
          }).present();
        });
    });
  }
}
