import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { Observable } from 'rxjs';

import { Login } from '../../login/login';
import { PlayerProfile } from '../player-profile/player-profile';

import { SteamIDService } from '../../providers/steamid-service';
import { SteamUserService } from '../../providers/steam-user-service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.html'
})
export class Home implements OnInit {
    @ViewChild('appcontent') nav;
    public profile: any;
    public onlineFriends: any;
    public offlineFriends: any;
    constructor(
        private navCtrl: NavController,
        private steamIDService: SteamIDService,
        private steamUserService: SteamUserService
    ) { }

    ngOnInit() {
        this.nav.setRoot(PlayerProfile);
    }

    ionViewCanEnter() {
        this.steamUserService.getPlayerProfile()
            .subscribe((response) => {
                this.profile = response;
                console.log(this.profile);

                this.steamUserService.getPlayerFriends()
                    .subscribe((response) => {
                        let friendIDs = response.map((friend) => { return friend.steamid; });
                        if (friendIDs.length > 0) {
                            this.steamUserService.getFriendSummaries(friendIDs)
                                .subscribe((response) => {
                                    this.sortFriends(response);
                                });
                        };
                    });
            });
    }

    ionViewDidEnter() {
        Splashscreen.hide();
    }

    private sortFriends(friends: Array<any>) {
        this.offlineFriends = friends.filter((o) => { return o.personastate === 0; }).sort(this.sortByLastLogOff);
        this.onlineFriends = friends.filter((o) => { return o.personastate > 0; });

        console.log(this.offlineFriends);
        console.log(this.onlineFriends);
    }

    private sortByLastLogOff(a, b): number {
        if (a.lastlogoff < b.lastlogoff) { return 1; }
        if (a.lastlogoff > b.lastlogoff) { return -1; }
        return 0;
    }

    public logout() {
        this.steamIDService.removeID();
        this.navCtrl.setRoot(Login);
    }
}