import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Database } from '@ionic/cloud-angular';

import { Search } from '../search/search';
import { PlayerProfile } from '../player-profile/player-profile';

import { SteamUserService } from '../../providers/steam-user-service';
import { StorageService } from '../../providers/storage-service';
import { IonicPushService } from '../../providers/ionic-push-service';

@Component({
    selector: 'friends-list',
    templateUrl: 'friends-list.html'
})
export class FriendsList {
    private profile: any;
    private playerID: string;
    private friends: any;
    private online: Array<any> = new Array();
    private offline: Array<any> = new Array();
    private favorites: Array<any> = new Array();

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private menuCtrl: MenuController,
        private steamUserService: SteamUserService,
        private db: Database,
        private loading: LoadingController,
        private toast: ToastController,
        private pushService: IonicPushService,
        private storage: StorageService
    ) { }

    ionViewDidLoad() {
        this.playerID = this.storage.getID();
        this.profile = this.storage.getProfile(this.playerID);

        let storedFriends = this.storage.getFriends(this.playerID);
        let storedFavorites = this.storage.getFavorites(this.playerID);

        if (storedFriends && storedFavorites) {
            this.friends = storedFriends;
            this.favorites = storedFavorites;
            this.sortFriends();
            this.loadFriends();
        } else {
            let loader = this.loading.create({
                content: 'Loading friends...'
            });

            loader.present().then(() => {
                this.loadFriends(loader);
            });
        }
    }

    ionViewDidEnter() {
        this.db.collection('favorites').find({ id: this.profile.steamid }).fetch()
            .subscribe((result) => {
                let results = result ? (result.favorites || []) : null;
                if (results) {
                    this.favorites = this.friends.filter((o) => { return results.find(r => r === o.steamid); }).sort(this.sortByPersonaName);
                    this.storage.setFavorites(this.playerID, this.favorites);
                    this.sortFriends();
                }
            });
    }

    ionViewCanLeave() {
        this.menuCtrl.close();
        return true;
    }

    public loadFriends(loader?: any) {
        this.steamUserService.getPlayerFriends()
            .flatMap((friendIDs) => {
                this.steamUserService.friendIDs = friendIDs.map((friend) => { return friend.steamid; });
                return this.steamUserService.getFriendSummaries();
            })
            .subscribe((friends) => {
                this.friends = friends;
                this.storage.setFriends(this.playerID, friends);
                this.updateFavorites();
                this.sortFriends();
                loader && loader.dismiss();
            }, (err) => {
                loader && loader.dismiss();
                this.toast.create({
                    message: 'Oops! Failed to get player info. Please try again.',
                    position: 'bottom',
                    showCloseButton: true,
                    duration: 10000
                }).present();
                console.log(err);
            });
    }

    private sortByState(a, b): number {
        if (a.personastate > b.personastate) { return 1; }
        if (a.personastate < b.personastate) { return -1; }
        return 0;
    }

    private sortByPersonaName(a, b): number {
        if (a.personaname > b.personaname) { return 1; }
        if (a.personaname < b.personaname) { return -1; }
        return 0;
    }

    private sortByLastLogOff(a, b): number {
        if (a.lastlogoff < b.lastlogoff) { return 1; }
        if (a.lastlogoff > b.lastlogoff) { return -1; }
        return 0;
    }

    private sortFriends() {
        this.online = this.friends.filter(o => {
            return o.personastate !== 0 && this.favorites.findIndex(f => f.steamid === o.steamid) < 0
        }).sort(this.sortByState);
        this.offline = this.friends.filter(o => {
            return o.personastate === 0 && this.favorites.findIndex(f => f.steamid === o.steamid) < 0
        }).sort(this.sortByLastLogOff);
    }

    public updateFriends(refresher) {
        this.steamUserService.getFriendSummaries()
            .subscribe((friends) => {
                this.steamUserService.friends = friends;
                this.friends = friends;
                this.updateFavorites();
                this.sortFriends();
                refresher.complete();
            }, (err) => {
                refresher.complete();
                this.toast.create({
                    message: 'Oops! Failed to update friends info. Please try again.',
                    position: 'bottom',
                    showCloseButton: true,
                    duration: 10000
                }).present();
            });
    }

    public updateFavorites() {
        let ids = this.favorites.map(o => { return o.steamid });
        this.favorites = this.friends.filter((o) => { return ids.find(r => r === o.steamid); }).sort(this.sortByPersonaName);
    }

    public navigateToProfile(friend: any) {
        this.nav.push(PlayerProfile, {
            player: this.profile,
            friend: friend,
            favorites: this.favorites.map((o) => { return o.steamid })
        });
    }

    public navigateToSearch() {
        this.nav.push(Search, {
            player: this.profile,
            friends: this.friends,
            favorites: this.favorites.map((o) => { return o.steamid })
        });
    }

    public sendQuickInvite(friend: any, slidingList) {
        slidingList.close();
        this.pushService.inviteToPlay(friend, this.profile);
    }
}