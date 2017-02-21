import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SteamUserService } from '../../providers/steam-user-service'

@Component({
  selector: 'manage-accounts',
  templateUrl: 'manage-accounts.html'
})
export class ManageAccounts {
  constructor(public navCtrl: NavController, public steamUserService: SteamUserService) { }

  public linkSteamAccount(): void {
    console.log('in manage accs');
    this.steamUserService.linkSteamAccount();
  }

  steamAccs: Array<Object> = [
    {
      name: 'Account 1'
    },
    {
      name: 'Account 2'
    }
  ]
}
