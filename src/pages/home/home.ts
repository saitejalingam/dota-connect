import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';

import { Login } from '../../login/login';
import { PlayerProfile } from '../player-profile/player-profile';

import { SteamIDService } from '../../providers/steamid-service';
import { SteamUserService } from '../../providers/steam-user-service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.html'
})
export class Home {
    @ViewChild('appcontent') nav;
    public profile: any;
    public onlineFriends: any;
    public offlineFriends: any;
    public hideOnline: boolean = false;
    public hideOffline: boolean = true;

    constructor(
        private navCtrl: NavController,
        private steamIDService: SteamIDService,
        private steamUserService: SteamUserService,
        private loading: LoadingController,
        private zone: NgZone
    ) { }

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
                this.offlineFriends = friends.filter((o) => { return o.personastate === 0; }).sort(this.sortByLastLogOff);
                this.onlineFriends = friends.filter((o) => { return o.personastate > 0; });
                this.nav.setRoot(PlayerProfile);
                loader.dismiss();
            }, (err) => {
                loader.dismiss();
                console.log(err);
            });
        });
    }

    private sortByLastLogOff(a, b): number {
        if (a.lastlogoff < b.lastlogoff) { return 1; }
        if (a.lastlogoff > b.lastlogoff) { return -1; }
        return 0;
    }

    public updateFriends(refresher) {
        this.steamUserService.getFriendSummaries()
            .subscribe((friends) => {
                this.steamUserService.friends = friends;
                this.offlineFriends = friends.filter((o) => { return o.personastate === 0; }).sort(this.sortByLastLogOff);
                this.onlineFriends = friends.filter((o) => { return o.personastate > 0; }).sort(this.sortByLastLogOff);
                refresher.complete();
            }, (err) => {
                refresher.complete();
                console.log(err);
            });
    }

    public toggleHideOnline() {
        this.zone.run(()=> { this.hideOnline = !this.hideOnline; });
    }

    public toggleHideOffline() {
        this.zone.run(()=> { this.hideOffline = !this.hideOffline; });
    }

    public logout() {
        this.steamIDService.removeID();
        this.navCtrl.setRoot(Login);
    }
}