import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, Searchbar } from 'ionic-angular';
import { Keyboard } from 'ionic-native';

import { PlayerProfile } from '../player-profile/player-profile';

@Component({
    selector: 'search-friends',
    templateUrl: 'search.html'
})
export class Search {
    @ViewChild('searchInput') searchInput;
    
    public player: any;
    public favorites: any;
    public friends: Array<any>;
    private searchText: string = '';
    private searchList: Array<any> = new Array();

    constructor(
        private nav: NavController,
        private navParams: NavParams
    ) {}

    ionViewDidLoad() {
        this.player = this.navParams.get('player');
        this.friends = this.navParams.get('friends');
        this.favorites = this.navParams.get('favorites');
        this.searchList = this.friends;
    }

    ionViewDidEnter() {
        setTimeout(() => {
            this.searchInput.setFocus();
            Keyboard.show();
        }, 100);
    }

    ionViewCanLeave() {
        Keyboard.close();
        return true;
    }

    public onSearchInput(ev) {
        let value = ev.target.value;
        this.searchList = this.friends.filter((friend) => {
            return (friend.personaname.toLowerCase().indexOf(value.toLowerCase()) > -1);
        });
    }

    public onSearchClear() {
        this.searchText = '';
        this.searchList = this.friends;
    }

    public onSearchCancel() {
        this.searchList = [];
        this.nav.pop();
    }

    public navigateToProfile(friend) {
         this.nav.push(PlayerProfile, {
            player: this.player,
            friend: friend,
            favorites: this.favorites
        });
    }
}