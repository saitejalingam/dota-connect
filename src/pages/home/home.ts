import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Login } from '../../login/login';
import { SteamIDService } from '../../providers/steamid-service';
import { ManageAccounts } from '../manage-accounts/manage-accounts';

@Component({
    selector: 'app-home',
    templateUrl: 'home.html'
})
export class Home implements OnInit {
    @ViewChild('appcontent') nav;
    constructor(private navCtrl: NavController, private steamIDService: SteamIDService) { }

    ngOnInit() {
        this.nav.setRoot(ManageAccounts);
     }

    public navigateTo(): void {

    }

    public logout() {
        this.steamIDService.removeID();
        this.navCtrl.setRoot(Login);
    }
}