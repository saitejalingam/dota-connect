import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { NavController, LoadingController, MenuController, AlertController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { Database, Push } from '@ionic/cloud-angular';

import { Login } from '../../login/login';
import { PlayerProfile } from '../player-profile/player-profile';
import { FriendsList } from '../friends-list/friends-list';

import { SteamIDService } from '../../providers/steamid-service';
import { SteamUserService } from '../../providers/steam-user-service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.html'
})
export class Home {
    @ViewChild('appcontent') nav;
    public profile: any;

    constructor(
        private navCtrl: NavController,
        private steamIDService: SteamIDService,
        private steamUserService: SteamUserService,
        private loading: LoadingController,
        private db: Database,
        private push: Push,
        private alert: AlertController
    ) { }

    ionViewCanEnter() {
        this.db.connect();
        this.db.collection('users').upsert({
            id: this.steamIDService.getID(),
            token: this.push.token.token
        }).subscribe(() => {
            this.db.disconnect();
            return true;
        }, () => {
            this.alert.create({
                title: 'API Failed',
                message: 'Sorry! Failed to register for notifications. Please try turning on Notifications and restarting the App.',
                buttons: ['Dismiss']
            }).present();
        });
    }

    ionViewCanLeave() {
        this.db.disconnect();
        return true;
    }

    ionViewDidEnter() {
        let loader = this.loading.create({
            content: 'Getting player profile...'
        });

        Splashscreen.hide();
        loader.present().then(() => {
            this.steamUserService.getPlayerProfile()
                .flatMap((profile) => {
                    this.profile = profile;
                    this.steamUserService.profile = profile;
                    return this.steamUserService.getPlayerFriends();
                })
                .flatMap((friendIDs) => {
                    this.steamUserService.friendIDs = friendIDs.map((friend) => { return friend.steamid; });
                    return this.steamUserService.getFriendSummaries();
                })
                .subscribe((friends) => {
                    this.steamUserService.friends = friends;
                    this.nav.setRoot(FriendsList, {
                        profile: this.profile,
                        friends: friends
                    });

                    loader.dismiss();
                }, (err) => {
                    loader.dismiss();
                    this.alert.create({
                        title: 'API Failed',
                        message: 'Oops! Failed to get player info. Please try again.',
                        buttons: ['Dismiss']
                    }).present();
                    console.log(err);
                });
        });
    }

    public logout() {
        this.steamIDService.removeID();
        this.db.disconnect();
        this.push.unregister();
        this.navCtrl.setRoot(Login);
    }
}