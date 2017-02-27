import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';

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
                console.log(response);

                this.steamUserService.getPlayerFriends()
                    .subscribe((response) => {
                        let friendIDs = response.map((friend) => { return friend.steamid; });
                        if (friendIDs.length > 0) {
                            this.steamUserService.getFriendSummaries(friendIDs)
                                .subscribe((response) => {
                                    console.log(response);
                                    return true;
                                });
                        };
                    });
            });
    }

    ionViewDidEnter() {
        Splashscreen.hide();
    }

    public logout() {
        this.steamIDService.removeID();
        this.navCtrl.setRoot(Login);
    }
}