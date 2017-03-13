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
  private isPinned: boolean;

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
    this.isPinned = this.navParams.get('isPinned');
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

  private addPinned(): void {
    this.db.connect();
    this.db.collection(this.player.steamid + '_pinned').upsert({
      id: this.friend.steamid
    }).subscribe(() => {
      this.isPinned = true;
      this.db.disconnect();
    });
  }

  private removePinned(): void {
    this.db.connect();
    this.db.collection(this.player.steamid + '_pinned').remove({
      id: this.friend.steamid
    }).subscribe(() => {
      this.isPinned = false;
      this.db.disconnect();
    });
  }

  public getPushToken(): Observable<any> {
    let users = this.db.collection('users');
    this.db.connect();
    return users.find({ id: this.friend.steamid }).fetch();
  }
}