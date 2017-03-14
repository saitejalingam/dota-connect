import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, Keyboard } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Database, Push, PushToken } from '@ionic/cloud-angular';

import { RecentGames } from '../components/recent-games/recent-games';
import { Messages } from '../components/messages/messages';

import { IonicPushService } from '../../providers/ionic-push-service';

@Component({
  selector: 'player-profile',
  templateUrl: 'player-profile.html'
})
export class PlayerProfile {
  private player: any;
  private friend: any;
  private favorites: Array<any> = new Array();
  private isFav: boolean;

  private tabOne: any;
  private tabTwo: any;
  private tabOneParams: any;
  private tabTwoParams: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alert: AlertController,
    private popover: PopoverController,
    private push: Push,
    private ionicPushService: IonicPushService,
    private db: Database,
    private keyboard: Keyboard
  ) {
    this.tabOne = RecentGames;
    this.tabOneParams = {
      player: this.navParams.get('friend')
    };

    this.tabTwo = Messages;
    this.tabTwoParams = {
      sender: this.navParams.get('player'),
      recipient: this.navParams.get('friend')
    };
  }

  ionViewCanEnter() {
    this.friend = this.navParams.get('friend');
    this.player = this.navParams.get('player');
    this.favorites = this.navParams.get('favorites');
    this.isFav = this.isFavorite();
    return true;
  };

  public inviteToPlay(): void {
    this.getPushToken()
      .flatMap((user) => {
        console.log(user);
        return this.ionicPushService.sendNotification(this.player.personaname, user.token);
      })
      .subscribe(() => {
        this.db.disconnect();
        this.alert.create({
          title: 'Invite sent!',
          subTitle: 'Your invitation to play has been sent to ' + this.friend.personaname,
          buttons: ['Dismiss']
        }).present();
      });
  }

  private addFavorite(): void {
    this.favorites.push(this.friend.steamid);
    this.updateFavorites().subscribe(() => {
      this.isFav = true;
      this.db.disconnect();
    }, (err) => {
      this.alert.create({
        title: 'Update failed!',
        message: 'Oops! Could not update your selection. Please try again.',
        buttons: ['Dismiss']
      }).present();
    });
  }

  private removeFavorite(): void {
    let index = this.favorites.findIndex((o) => {
      return o === this.friend.steamid
    });
    this.favorites.splice(index, 1);

    this.updateFavorites().subscribe(() => {
      this.isFav = false;
      this.db.disconnect();
    }, (err) => {
      this.alert.create({
        title: 'Update failed!',
        message: 'Oops! Could not update your selection. Please try again.',
        buttons: ['Dismiss']
      }).present()
    });
  }

  private updateFavorites(): Observable<any> {
    this.db.connect();
    return this.db.collection('favorites').upsert({
      id: this.player.steamid,
      favorites: this.favorites
    });
  }

  public getPushToken(): Observable<any> {
    let users = this.db.collection('users');
    this.db.connect();
    return users.find({ id: this.friend.steamid }).fetch();
  }

  private isFavorite() {
    return this.favorites.find(p => p === this.friend.steamid);
  }
}