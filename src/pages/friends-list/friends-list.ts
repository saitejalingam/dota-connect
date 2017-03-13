import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Database } from '@ionic/cloud-angular';

import { PlayerProfile } from '../player-profile/player-profile';

import { SteamUserService } from '../../providers/steam-user-service';

@Component({
    selector: 'friends-list',
    templateUrl: 'friends-list.html'
})
export class FriendsList {
    private profile: any;
    private friends: any;
    private online: Array<any> = new Array();
    private offline: Array<any> = new Array();
    private pinned: Array<any> = new Array();

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private menuCtrl: MenuController,
        private steamUserService: SteamUserService,
        private db: Database
    ) { }

    ionViewCanEnter() {
        this.profile = this.navParams.get('profile');
        this.friends = this.navParams.get('friends');
        this.online = this.friends.filter(o => o.personastate !== 0).sort(this.sortByState);
        this.offline = this.friends.filter(o => o.personastate === 0).sort(this.sortByLastLogOff);
        this.db.collection(this.profile.steamid + '_pinned').fetch()
            .subscribe((result: Array<any>) => {
                this.pinned = this.friends.filter((o) => {
                    return result.find(r => r.id === o.steamid);
                });
                
                return true;
            }, (err) => { return true; });
    }

    private sortByState(a, b): number {
        if (a.personastate > b.personastate) { return 1; }
        if (a.personastate < b.personastate) { return -1; }
        return 0;
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
                this.friends = friends;
                refresher.complete();
            }, (err) => {
                refresher.complete();
                console.log(err);
            });
    }

    public navigateToProfile(friend) {
        this.menuCtrl.close();
        this.nav.push(PlayerProfile, {
            player: this.profile,
            friend: friend,
            isPinned: this.isPinned(friend)
        });
    }

    private isPinned(friend: any) {
        return this.pinned.find(p => p.steamid === friend.steamid);
    }
}