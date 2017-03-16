import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { InAppBrowser, Splashscreen } from 'ionic-native';

import { StorageService } from '../providers/storage-service';
import { Home } from '../pages/home/home';

@Component({
  selector: 'app-login',
  templateUrl: 'login.html'
})
export class Login {
  private baseUrl: string = 'https://dota-connect-server.herokuapp.com/api/login';
  constructor(
    private navCtrl: NavController,
    private storage: StorageService,
    private alert: AlertController
  ) { }

  ionViewDidEnter() {
    Splashscreen.hide();
  }

  public loginWithSteam() {
    let browser = new InAppBrowser(this.baseUrl, '_blank', 'location=true');

    browser.on('loadstop')
      .subscribe((e) => {
        let url = e.url.split('?')[0];
        let query = e.url.split('?')[1];
        let keys = this.QueryStringToJSON(query);

        if (url === this.baseUrl + '/success') {
          let user_id = keys['openid.claimed_id'].split('/').splice(-1, 1)[0];
          this.storage.setID(user_id);
          browser.close();
          this.navCtrl.setRoot(Home);
        }
      }, (err) => {
        this.alert.create({
            title: 'Login Failed',
            message: 'Please try again.',
            buttons: ['Dismiss']
        }).present();
      });

    browser.on('loaderror')
      .subscribe(() => {
        browser.close();
      });
  }

  private QueryStringToJSON(query) {
    let pairs: String[] = query.split('&');
    let result = {};

    pairs.forEach(function (pair) {
      let str: any[];
      str = pair.split('=');
      result[str[0]] = decodeURIComponent(str[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
  }
}