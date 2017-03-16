import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { NavController, LoadingController, MenuController, AlertController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { Database, Push } from '@ionic/cloud-angular';

import { Login } from '../../login/login';
import { PlayerProfile } from '../player-profile/player-profile';
import { FriendsList } from '../friends-list/friends-list';

import { StorageService } from '../../providers/storage-service';
import { SteamUserService } from '../../providers/steam-user-service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.html'
})
export class Home {
    @ViewChild('appcontent') nav;
    public profile: any;
    private playerID: string;

    constructor(
        private navCtrl: NavController,
        private storage: StorageService,
        private steamUserService: SteamUserService,
        private loading: LoadingController,
        private db: Database,
        private push: Push,
        private alert: AlertController
    ) { }

    ionViewCanEnter() {
        this.db.connect();
        this.db.collection('users').upsert({
            id: this.playerID,
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
        this.playerID = this.storage.getID();
        let storedProfile = this.storage.getProfile(this.playerID);
        let loader = this.loading.create({
            content: 'Loading player profile...'
        });

        Splashscreen.hide();
        if (storedProfile) {
            this.profile = storedProfile;
            this.loadProfileData();
            this.nav.setRoot(FriendsList);
        } else {
            loader.present().then(() => {
                this.loadProfileData(loader);
            });
        }
    }

    public loadProfileData(loader?: any) {
        this.steamUserService.getPlayerProfile()
            .subscribe((profile) => {
                loader && loader.dismiss();
                this.profile = profile;
                this.storage.setProfile(this.playerID, profile);
                loader && this.nav.setRoot(FriendsList);
            }, (err) => {
                loader && loader.dismiss();
                this.alert.create({
                    title: 'API Failed',
                    message: 'Oops! Failed to get player info. Please try again.',
                    buttons: ['Dismiss']
                }).present();
                console.log(err);
            });
    }

    public logout() {
        this.storage.removeID();
        this.db.disconnect();
        this.push.unregister();
        this.navCtrl.setRoot(Login);
    }
}