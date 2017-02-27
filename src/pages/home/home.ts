import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';

import { Login } from '../../login/login';
import { ManageAccounts } from '../manage-accounts/manage-accounts';

import { SteamIDService } from '../../providers/steamid-service';
import { SteamUserService } from '../../providers/steam-user-service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.html'
})
export class Home implements OnInit {
    @ViewChild('appcontent') nav;

    public profile: any;
    public friends: any;
    constructor(
        private navCtrl: NavController,
        private steamIDService: SteamIDService,
        private steamUserService: SteamUserService
    ) {
        this.steamUserService.getPlayerProfile()
            .subscribe((response) => {
                console.log(response.json());
                this.profile = response.json().response.players[0];
            });

        this.steamUserService.getPlayerFriends()
            .subscribe((response) => {
                let friends = response.json().friendslist.friends || [];
                let friendIDs = friends.map((friend) => { return friend.steamid; });
                if (friendIDs.length > 0) {
                    this.steamUserService.getFriendSummaries(friendIDs)
                        .subscribe((response) => {
                            console.log(response.json());
                            this.friends = response.json().response.players;
                        });
                };
            });
    }

    ngOnInit() {
        this.nav.setRoot(ManageAccounts);
    }
    
    ionViewDidEnter() {
        Splashscreen.hide();
    }

    public navigateTo(): void {

    }

    public logout() {
        this.steamIDService.removeID();
        this.navCtrl.setRoot(Login);
    }
}